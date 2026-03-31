import { Alert } from 'react-native'; // <-- Add this import
import { getAppConfig } from '../config/appConfig';

const { apiBaseUrl } = getAppConfig();

export const api = {
  postForm: async (endpoint: string, formData: FormData) => {
    try {
      // Debug alert to confirm the URL is correct
      console.log(`Sending to: ${apiBaseUrl}${endpoint}`);
      
      const response = await fetch(`${apiBaseUrl}${endpoint}`, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      // Safely try to parse JSON
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error(`Server did not return JSON. Status: ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(data?.message || `HTTP Error ${response.status}`);
      }

      return data;
    } catch (error: any) {
      console.error(`API Error on ${endpoint}:`, error);
      // Force the UI to show the error so you aren't guessing!
      Alert.alert('Connection Error', error.message || 'Could not connect to backend');
      throw error;
    }
  },
};