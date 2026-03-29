import React, { useEffect, useState } from 'react';
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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, User, Mail, Lock, Calendar, MapPin, Home, Eye, EyeOff } from 'lucide-react-native';

type TabRole = 'sender' | 'driver' | 'operator';
const roleOptions: TabRole[] = ['sender', 'driver', 'operator'];

export default function SignUpPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ role?: string }>();
  const [activeTab, setActiveTab] = useState<TabRole>('sender');
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const role = Array.isArray(params.role) ? params.role[0] : params.role;
    if (role && roleOptions.includes(role as TabRole)) {
      setActiveTab(role as TabRole);
    }
  }, [params.role]);

  const handleBack = () => {
    if (step === 1) {
      router.back();
      return;
    }
    setStep((current) => Math.max(current - 1, 1));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep((current) => current + 1);
      return;
    }

    const formData = {
      role: activeTab,
      fullName,
      dob,
      mobile,
      email,
      address,
      city,
      province,
      password,
      confirmPassword,
    };
    console.log('Submit sign up data:', formData);
  };

  const cardData = [
    {
      role: 'sender' as TabRole,
      title: 'Parcel Sender',
      subtitle: 'I need to send and track parcels quickly.',
      icon: <User size={20} color="#13918F" />,
    },
    {
      role: 'driver' as TabRole,
      title: 'Driver',
      subtitle: 'I want to deliver and earn money.',
      icon: <MapPin size={20} color="#13918F" />,
    },
    {
      role: 'operator' as TabRole,
      title: 'Operator',
      subtitle: 'I want to manage a drop-off point.',
      icon: <Home size={20} color="#13918F" />,
    },
  ];

  const stepTitle =
    step === 1
      ? 'Join the PakiSHIP community.'
      : step === 2
      ? 'Tell us about yourself'
      : 'Address & Security';
  const stepLabel = step === 1 ? 'CREATE ACCOUNT' : step === 2 ? 'STEP 1' : 'STEP 2';
  const buttonLabel = step === 3 ? 'SUBMIT APPLICATION' : 'CONTINUE';

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.8}>
              <ArrowLeft size={24} color="#13918F" />
            </TouchableOpacity>
            <View style={styles.headerText}>
              <Text style={styles.headerLabel}>{stepLabel}</Text>
              <Text style={styles.mainTitle}>{stepTitle}</Text>
            </View>
          </View>

          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBar,
                step === 1 && styles.progressOne,
                step === 2 && styles.progressTwo,
                step === 3 && styles.progressThree,
              ]}
            />
          </View>

          <View style={styles.card}>
            {step === 1 ? (
              <>
                {cardData.map((card) => (
                  <TouchableOpacity
                    key={card.role}
                    style={[styles.selectionCard, activeTab === card.role && styles.selectionCardActive]}
                    onPress={() => setActiveTab(card.role)}
                    activeOpacity={0.85}
                  >
                    <View style={styles.selectionIcon}>{card.icon}</View>
                    <View style={styles.selectionText}>
                      <Text style={styles.selectionTitle}>{card.title}</Text>
                      <Text style={styles.selectionSubtitle}>{card.subtitle}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            ) : step === 2 ? (
              <>
                <View style={styles.sectionLabelContainer}>
                  <Text style={styles.sectionLabel}>FULL NAME</Text>
                </View>
                <View style={styles.inputContainer}>
                  <View style={styles.inputIcon}>
                    <User size={20} color="#13918F" />
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Juan Dela Cruz"
                    placeholderTextColor="#9CA3AF"
                    value={fullName}
                    onChangeText={setFullName}
                  />
                </View>

                <View style={styles.sectionLabelContainer}>
                  <Text style={styles.sectionLabel}>DATE OF BIRTH</Text>
                </View>
                <View style={styles.inputContainer}>
                  <View style={styles.inputIcon}>
                    <Calendar size={20} color="#13918F" />
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder="09/08/2004"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="number-pad"
                    value={dob}
                    onChangeText={setDob}
                  />
                </View>

                <View style={styles.sectionLabelContainer}>
                  <Text style={styles.sectionLabel}>MOBILE NUMBER</Text>
                </View>
                <View style={styles.inputContainer}>
                  <View style={styles.prefixBox}>
                    <Text style={styles.prefixText}>+63</Text>
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder="912 345 6789"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="phone-pad"
                    value={mobile}
                    onChangeText={setMobile}
                  />
                </View>

                <View style={styles.sectionLabelContainer}>
                  <Text style={styles.sectionLabel}>EMAIL ADDRESS</Text>
                </View>
                <View style={styles.inputContainer}>
                  <View style={styles.inputIcon}>
                    <Mail size={20} color="#13918F" />
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder="juandelacruz@email.com"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              </>
            ) : (
              <>
                <View style={styles.sectionLabelContainer}>
                  <Text style={styles.sectionLabel}>STREET ADDRESS</Text>
                </View>
                <View style={styles.inputContainer}>
                  <View style={styles.inputIcon}>
                    <Home size={20} color="#13918F" />
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder="123 Mabini St. Brgy. 4"
                    placeholderTextColor="#9CA3AF"
                    value={address}
                    onChangeText={setAddress}
                  />
                </View>

                <View style={styles.twoColumnRow}>
                  <View style={styles.halfInputWrapper}>
                    <Text style={styles.sectionLabel}>CITY</Text>
                    <View style={styles.inputContainer}>
                      <View style={styles.inputIcon}>
                        <MapPin size={20} color="#13918F" />
                      </View>
                      <TextInput
                        style={styles.textInput}
                        placeholder="Quezon City"
                        placeholderTextColor="#9CA3AF"
                        value={city}
                        onChangeText={setCity}
                      />
                    </View>
                  </View>

                  <View style={styles.halfInputWrapper}>
                    <Text style={styles.sectionLabel}>PROVINCE</Text>
                    <View style={styles.inputContainer}>
                      <View style={styles.inputIcon}>
                        <MapPin size={20} color="#13918F" />
                      </View>
                      <TextInput
                        style={styles.textInput}
                        placeholder="Metro Manila"
                        placeholderTextColor="#9CA3AF"
                        value={province}
                        onChangeText={setProvince}
                      />
                    </View>
                  </View>
                </View>

                <View style={styles.sectionLabelContainer}>
                  <Text style={styles.sectionLabel}>SET PASSWORD</Text>
                </View>
                <View style={styles.inputContainer}>
                  <View style={styles.inputIcon}>
                    <Lock size={20} color="#13918F" />
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder="8+ chars, number, symbol"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                    {showPassword ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#9CA3AF" />}
                  </TouchableOpacity>
                </View>

                <View style={styles.sectionLabelContainer}>
                  <Text style={styles.sectionLabel}>CONFIRM PASSWORD</Text>
                </View>
                <View style={styles.inputContainer}>
                  <View style={styles.inputIcon}>
                    <Lock size={20} color="#13918F" />
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Repeat password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                    {showConfirmPassword ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#9CA3AF" />}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.continueButton} onPress={handleNext} activeOpacity={0.85}>
            <Text style={styles.continueButtonText}>{buttonLabel}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#E8F7F6' },
  flex: { flex: 1 },
  scrollContent: { padding: 24, flexGrow: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  backButton: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 12, elevation: 3, marginRight: 10 },
  headerText: { flex: 1 },
  headerLabel: { color: '#39B5A8', fontSize: 12, fontWeight: '700', letterSpacing: 1.5, marginBottom: 8 },
  mainTitle: { fontSize: 30, fontWeight: '900', color: '#041614', lineHeight: 38 },
  progressBarBackground: { width: '100%', height: 6, backgroundColor: '#E9F7F6', borderRadius: 99, marginBottom: 24 },
  progressBar: { height: 6, borderRadius: 99, backgroundColor: '#39B5A8', width: '33%' },
  progressOne: { width: '33%' },
  progressTwo: { width: '66%' },
  progressThree: { width: '100%' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 34, padding: 24, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 24, shadowOffset: { width: 0, height: 16 }, elevation: 6 },
  selectionCard: { backgroundColor: '#F4FBFA', borderRadius: 24, padding: 18, flexDirection: 'row', alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: 'transparent' },
  selectionCardActive: { backgroundColor: '#FFFFFF', borderColor: '#C9EEE9', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 18, shadowOffset: { width: 0, height: 10 }, elevation: 4 },
  selectionIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#DFF6F2', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  selectionText: { flex: 1 },
  selectionTitle: { fontSize: 16, fontWeight: '900', color: '#041614', marginBottom: 4 },
  selectionSubtitle: { fontSize: 13, color: '#6B7280', lineHeight: 20 },
  sectionLabelContainer: { marginBottom: 8 },
  sectionLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1.2, color: '#13918F', textTransform: 'uppercase' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F4FBFA', borderRadius: 20, height: 56, paddingHorizontal: 14, borderWidth: 1, borderColor: '#E5F1EF', marginBottom: 16 },
  prefixBox: { width: 60, height: 40, backgroundColor: '#E7F6F3', borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  prefixText: { color: '#13918F', fontWeight: '700' },
  inputIcon: { paddingHorizontal: 8 },
  textInput: { flex: 1, height: '100%', fontSize: 14, color: '#041614', fontWeight: '500', paddingRight: 8 },
  eyeIcon: { paddingHorizontal: 8, height: '100%', justifyContent: 'center' },
  twoColumnRow: { flexDirection: 'row', justifyContent: 'space-between' },
  halfInputWrapper: { width: '48%' },
  footer: { paddingHorizontal: 24, paddingBottom: Platform.OS === 'ios' ? 24 : 16, paddingTop: 16 },
  continueButton: { backgroundColor: '#041614', borderRadius: 20, alignItems: 'center', justifyContent: 'center', paddingVertical: 18 },
  continueButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', letterSpacing: 1.5 },
});
