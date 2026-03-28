// path: app/login.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // <-- FIXED IMPORT
import { useRouter } from 'expo-router';
import { Mail, Phone, Lock, AlertCircle, Check } from 'lucide-react-native';
import { InputField } from '../components/InputField';

type LoginRole = "customer" | "driver" | "operator";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<LoginRole>("customer");
  const [identifier, setIdentifier] = useState(""); 
  const [isEmail, setIsEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsEmail(/[a-zA-Z@]/.test(identifier));
  }, [identifier]);

  const handleIdentifierChange = (value: string) => {
    // FIXED NEGATED CONDITION
    if (/[a-zA-Z@]/.test(value)) {
      setIdentifier(value);
    } else {
      const digits = value.replaceAll(/\D/g, "");
      if (digits.length <= 10) setIdentifier(digits);
    }
    
    if (error) setError("");
  };

  const handleSubmit = () => {
    if (isEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(identifier)) return setError("Invalid email format.");
    } else if (identifier.length !== 10) {
      return setError("Invalid mobile number.");
    }

    const passRegex = /^(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passRegex.test(password)) return setError("Invalid credentials.");

    if (role === "operator") router.replace("/operator/home");
    else if (role === "driver") router.replace("/driver/home");
    else router.replace("/customer/home");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Hatid Agad,</Text>
            <Text style={[styles.title, { color: '#39B5A8' }]}>Walang Abala.</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Log In</Text>
              <Text style={styles.cardSubtitle}>
                {role === "customer" ? "Welcome back! Ship with ease." : `Access your ${role} portal.`}
              </Text>
            </View>

            <View style={styles.roleSelector}>
              {(["customer", "driver", "operator"] as LoginRole[]).map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.roleButton, role === r && styles.roleButtonActive]}
                  onPress={() => { setRole(r); setError(""); setIdentifier(""); }}
                >
                  <Text style={[styles.roleText, role === r && styles.roleTextActive]}>
                    {r === "customer" ? "sender" : r}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {error ? (
              <View style={styles.errorBox}>
                <AlertCircle size={20} color="#EF4444" />
                <Text style={styles.errorBoxText}>{error}</Text>
              </View>
            ) : null}

            <InputField
              label="Email or Mobile Number"
              icon={isEmail ? <Mail size={20} color="rgba(57, 181, 168, 0.4)" /> : <Phone size={20} color="rgba(57, 181, 168, 0.4)" />}
              isPhone={!isEmail}
              value={identifier}
              onChangeText={handleIdentifierChange}
              placeholder={isEmail ? "name@email.com" : "912 345 6789"}
              keyboardType={isEmail ? "email-address" : "numeric"}
              autoCapitalize="none"
            />

            <InputField
              label="Password"
              icon={<Lock size={20} color="rgba(57, 181, 168, 0.4)" />}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry={!showPassword}
              showEye
              eyeOpen={showPassword}
              onEyeClick={() => setShowPassword(!showPassword)}
            />

            <View style={styles.rowBetween}>
              <TouchableOpacity style={styles.checkboxRow} onPress={() => setKeepLoggedIn(!keepLoggedIn)}>
                <View style={[styles.checkbox, keepLoggedIn && styles.checkboxActive]}>
                  {keepLoggedIn && <Check size={14} color="#FFF" />}
                </View>
                <Text style={styles.rememberText}>Remember me</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Continue</Text>
            </TouchableOpacity>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>New to PakiSHIP? </Text>
              <TouchableOpacity onPress={() => router.push("/signup")}>
                <Text style={styles.footerLink}>Create Account</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#caefed' },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  headerTextContainer: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 40, fontWeight: '800', color: '#041614', lineHeight: 45 },
  card: { backgroundColor: '#FFF', borderRadius: 40, padding: 24, shadowColor: '#39B5A8', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 5 },
  cardHeader: { alignItems: 'center', marginBottom: 24 },
  cardTitle: { fontSize: 28, fontWeight: 'bold', color: '#041614' },
  cardSubtitle: { fontSize: 14, color: '#9CA3AF', marginTop: 8 },
  roleSelector: { flexDirection: 'row', backgroundColor: '#F0F9F8', padding: 6, borderRadius: 16, marginBottom: 24 },
  roleButton: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  roleButtonActive: { backgroundColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  roleText: { fontSize: 13, fontWeight: 'bold', color: '#9CA3AF', textTransform: 'capitalize' },
  roleTextActive: { color: '#39B5A8' },
  errorBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF2F2', padding: 16, borderRadius: 16, marginBottom: 16, gap: 8 },
  errorBoxText: { color: '#EF4444', fontWeight: 'bold', fontSize: 14 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, marginBottom: 24, paddingHorizontal: 4 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkbox: { width: 20, height: 20, borderRadius: 6, borderWidth: 2, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: '#39B5A8', borderColor: '#39B5A8' },
  rememberText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  forgotText: { fontSize: 13, fontWeight: 'bold', color: '#39B5A8' },
  submitButton: { backgroundColor: '#041614', paddingVertical: 18, borderRadius: 20, alignItems: 'center' },
  submitButtonText: { color: '#FFF', fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2 },
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: '#9CA3AF', fontWeight: '500' },
  footerLink: { color: '#39B5A8', fontWeight: 'bold', textDecorationLine: 'underline' }
});