import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react-native';

type TabRole = 'sender' | 'driver' | 'operator';

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabRole>('sender');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const subtitles: Record<TabRole, string> = {
    sender: 'Access your sender portal.',
    driver: 'Access your driver portal.',
    operator: 'Access your operator portal.',
  };

  const handleLogin = () => {
    // TODO: wire authentication flow here
  };

  const handleCreateAccount = () => {
    router.push(`/signup?role=${activeTab}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.pageHeader}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <ArrowLeft size={24} color="#13918F" />
            </TouchableOpacity>
            <View style={styles.titleWrapper}>
              <Text style={styles.mainTitle}>Hatid Agad,</Text>
              <Text style={styles.mainTitleAccent}>Walang Abala.</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Log In</Text>
            <Text style={styles.cardSubtitle}>{subtitles[activeTab]}</Text>

            <View style={styles.tabContainer}>
              {(['sender', 'driver', 'operator'] as TabRole[]).map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tab, activeTab === tab && styles.activeTab]}
                  onPress={() => setActiveTab(tab)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>EMAIL OR MOBILE NUMBER</Text>
                <View style={styles.inputContainer}>
                  <View style={styles.prefixBox}>
                    <Text style={styles.prefixText}>+63</Text>
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder="912 345 6789"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="phone-pad"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>PASSWORD</Text>
                <View style={styles.inputContainer}>
                  <View style={styles.inputIcon}>
                    <Lock size={20} color="#39B5A8" />
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder="••••••••"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                    {showPassword ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#9CA3AF" />}
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.rowBetween}>
                <View style={styles.checkboxPlaceholder} />
                <TouchableOpacity>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} activeOpacity={0.8}>
              <Text style={styles.loginBtnText}>CONTINUE</Text>
            </TouchableOpacity>

            <View style={styles.createAccountContainer}>
              <Text style={styles.noAccountText}>New to PakiSHIP? </Text>
              <TouchableOpacity onPress={handleCreateAccount}>
                <Text style={styles.createAccountLink}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#E8F7F6' },
  flex: { flex: 1 },
  scrollContent: { padding: 24, flexGrow: 1, justifyContent: 'center' },
  pageHeader: { marginBottom: 16 },
  backButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2, marginBottom: 18 },
  titleWrapper: { borderRadius: 24, paddingVertical: 12, paddingHorizontal: 14, backgroundColor: '#E9F7F6', alignItems: 'center' },
  mainTitle: { fontSize: 34, fontWeight: '900', color: '#041614', lineHeight: 42 },
  mainTitleAccent: { fontSize: 34, fontWeight: '900', color: '#13918F', lineHeight: 42 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 34, padding: 24, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 24, elevation: 5 },
  cardTitle: { fontSize: 24, fontWeight: '900', color: '#041614', marginBottom: 6, textAlign: 'center' },
  cardSubtitle: { color: '#6B7280', fontSize: 14, textAlign: 'center', marginBottom: 20 },
  tabContainer: { flexDirection: 'row', backgroundColor: '#EBF5F2', borderRadius: 18, padding: 4, marginBottom: 24 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 14 },
  activeTab: { backgroundColor: '#FFFFFF' },
  tabText: { fontSize: 14, fontWeight: '700', color: '#6B7280' },
  activeTabText: { color: '#13918F' },
  formContainer: { marginBottom: 16 },
  inputWrapper: { marginBottom: 16 },
  inputLabel: { fontSize: 10, fontWeight: 'bold', color: '#13918F', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginLeft: 4 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F4FBFA', borderRadius: 20, height: 56, paddingHorizontal: 8, borderWidth: 1, borderColor: '#E5F1EF' },
  prefixBox: { width: 60, height: 40, backgroundColor: '#E7F6F3', borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  prefixText: { color: '#13918F', fontWeight: '700' },
  inputIcon: { paddingHorizontal: 16 },
  textInput: { flex: 1, height: '100%', fontSize: 14, color: '#041614', fontWeight: '500', paddingRight: 16 },
  eyeIcon: { paddingHorizontal: 16, height: '100%', justifyContent: 'center' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  checkboxPlaceholder: { width: 24, height: 24 },
  forgotPasswordText: { color: '#13918F', fontSize: 13, fontWeight: '600' },
  loginBtn: { backgroundColor: '#041614', paddingVertical: 18, borderRadius: 20, alignItems: 'center', marginTop: 8, marginBottom: 18 },
  loginBtnText: { color: '#FFF', fontSize: 14, fontWeight: 'bold', letterSpacing: 2 },
  createAccountContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  noAccountText: { color: '#6B7280', fontSize: 13 },
  createAccountLink: { color: '#13918F', fontSize: 13, fontWeight: 'bold' },
});
