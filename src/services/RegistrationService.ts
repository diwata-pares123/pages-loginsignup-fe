import { supabase } from '../lib/supabase'; 
import { Platform } from 'react-native';

// Use ! to tell TS these are guaranteed to exist, 
// or provide a fallback string to avoid the 'undefined' error.
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.XX:3001/api/v1"; 

export type UserRole = 'CUSTOMER' | 'DRIVER' | 'OPERATOR';

export interface RegistrationData {
  fullName: string;
  email: string;
  password?: string;
  phone: string;
  birthDate: string;
}

// Defining the shape of an Expo File Asset to fix the 'any' types
interface ExpoFileAsset {
  uri: string;
  mimeType?: string;
  name?: string;
}

export const RegistrationService = {
  /**
   * Main entry point for all registration types
   */
  async register(role: UserRole, userData: RegistrationData, files: Record<string, ExpoFileAsset | null> = {}) {
    try {
      // 1. PRE-CHECK
      await this.checkUserAvailability(userData.email, userData.phone);

      // 2. SUPABASE
      const authData = await this.signUpSupabase(role, userData);
      const userId = authData.data.user?.id;
      
      if (!userId) {
        throw new Error("User creation failed: No ID returned from Auth provider.");
      }

      // 3. NESTJS SYNC
      await this.syncWithBackend(role, userId, userData, files);

      return authData.data;
    } catch (error: any) {
      console.error(`[RegistrationService] ${role} Error:`, error.message);
      throw error;
    }
  },

  async checkUserAvailability(email: string, phone: string) {
    const url = `${BASE_URL}/users/check-user?email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`;
    const res = await fetch(url);
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error?.message || "Email or Phone already registered.");
    }
  },

  async signUpSupabase(role: UserRole, data: RegistrationData) {
    // If password is undefined, Supabase will throw an error, 
    // so we provide a check or a default empty string
    const result = await supabase.auth.signUp({
      email: data.email,
      password: data.password ?? '', 
      options: {
        data: {
          full_name: data.fullName,
          phone_number: data.phone,
          role: role,
        },
      },
    });

    if (result.error) throw result.error;
    return result;
  },

  async syncWithBackend(role: UserRole, userId: string, data: RegistrationData, files: Record<string, ExpoFileAsset | null>) {
    const formData = new FormData();
    
    formData.append("user_id", userId);
    formData.append("full_name", data.fullName);
    formData.append("email", data.email);
    formData.append("phone_number", data.phone);
    formData.append("role", role);
    formData.append("date_of_birth", data.birthDate);
    formData.append("terms_accepted_at", new Date().toISOString());

    // Fix for the File Object Mapping
    Object.keys(files).forEach((key) => {
      const file = files[key];
      if (file?.uri) {
        const cleanUri = Platform.OS === 'android' ? file.uri : file.uri.replace('file://', '');
        
        // This structure is specifically required by React Native's FormData
        const filePayload = {
          uri: cleanUri,
          type: file.mimeType || 'image/jpeg',
          name: file.name || `${key}.jpg`,
        };

        // We cast to 'any' here because standard TS FormData 
        // doesn't know about React Native's special file object handling
        formData.append(key, filePayload as any);
      }
    });

    const res = await fetch(`${BASE_URL}/users/profile`, {
      method: "POST",
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData?.message || "Backend synchronization failed.");
    }

    return await res.json();
  }
};