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
import { ArrowLeft, User, Mail, Lock, MapPin, Home, Eye, EyeOff, CheckCircle, Circle } from 'lucide-react-native';
import DateInput from 'src/components/DateInput';
import ImageUploadComponent from 'src/components/ImageUploadComponent';

type TabRole = 'sender' | 'driver' | 'operator';
const roleOptions: Set<TabRole> = new Set(['sender', 'driver', 'operator']);

export default function SignUpPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ role?: string }>();
  const [activeTab, setActiveTab] = useState<TabRole>('sender');
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Driver verification documents
  const [driverDocs, setDriverDocs] = useState<{ [key: string]: string | null }>({});

  // Operator verification documents
  const [operatorDocs, setOperatorDocs] = useState<{ [key: string]: string | null }>({});

  useEffect(() => {
    const role = Array.isArray(params.role) ? params.role[0] : params.role;
    if (role && roleOptions.has(role as TabRole)) {
      setActiveTab(role as TabRole);
      setStep(2); // Skip role selection step and go directly to personal info
    }
  }, [params.role]);

  const handleBack = () => {
    if (step === 1) {
      router.back();
      return;
    }
    setStep((current) => Math.max(current - 1, 1));
  };

  const buildBaseFormData = (): FormData => {
    const formData = new FormData();
    formData.append('role', String(activeTab));
    if (fullName.trim()) formData.append('fullName', fullName);
    if (dob.trim()) formData.append('dob', dob);
    if (mobile.trim()) formData.append('mobile', mobile);
    if (email.trim()) formData.append('email', email);
    if (address.trim()) formData.append('address', address);
    if (city.trim()) formData.append('city', city);
    if (province.trim()) formData.append('province', province);
    if (password.trim()) formData.append('password', password);
    formData.append('agreedToTerms', String(agreedToTerms));
    return formData;
  };

  const submitSenderData = (): void => {
    console.log('Submit sender sign up data');
    // TODO: wire authentication flow here
  };

  const submitVerificationData = (): void => {
    const formData = buildBaseFormData();

    if (activeTab === 'driver') {
      Object.keys(driverDocs).forEach((key) => {
        const docValue = driverDocs[key];
        if (docValue) formData.append(`document_${key}`, docValue);
      });
    } else if (activeTab === 'operator') {
      Object.keys(operatorDocs).forEach((key) => {
        const docValue = operatorDocs[key];
        if (docValue) formData.append(`document_${key}`, docValue);
      });
    }

    console.log('Submit', activeTab, 'sign up data with documents');
    // TODO: wire authentication flow here
  };

  const handleNext = (): void => {
    if (activeTab === 'sender') {
      if (step < 3) {
        setStep((current) => current + 1);
        return;
      }
      submitSenderData();
      return;
    }

    if (step < 4) {
      setStep((current) => current + 1);
      return;
    }

    submitVerificationData();
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

  const getStepTitle = (): string => {
    switch (step) {
      case 1:
        return 'Join the PakiSHIP community.';
      case 2:
        return 'Tell us about yourself';
      case 3:
        return 'Address & Security';
      case 4:
        return (activeTab === 'driver' ? 'Driver Verification' : 'Operator Verification');
      default:
        return '';
    }
  };

  const getStepLabel = (): string => {
    switch (step) {
      case 1:
        return 'CREATE ACCOUNT';
      case 2:
        return 'STEP 1';
      case 3:
        return 'STEP 2';
      case 4:
        return 'FINAL STEP';
      default:
        return '';
    }
  };

  const stepTitle = getStepTitle();
  const stepLabel = getStepLabel();
  let buttonLabel = 'CONTINUE';

  if ((step === 3 && activeTab === 'sender') || step === 4) {
    buttonLabel = 'SUBMIT APPLICATION';
  }

  const renderRoleSelection = () => (
    <>
      {cardData.map((card) => (
        <TouchableOpacity
          key={card.role}
          style={[styles.selectionCard, activeTab === card.role && styles.selectionCardActive]}
          onPress={() => {
            setActiveTab(card.role);
            setStep(2); // Auto-navigate to next step
          }}
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
  );

  const renderPersonalInfo = () => (
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
      <DateInput
        value={dob}
        onChangeText={setDob}
        placeholder="dd/mm/yyyy"
      />

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
  );

  const renderAddressAndSecurity = () => (
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

      <TouchableOpacity
        style={styles.termsCheckboxContainer}
        onPress={() => setAgreedToTerms(!agreedToTerms)}
        activeOpacity={0.8}
      >
        {agreedToTerms ? (
          <CheckCircle size={20} color="#13918F" />
        ) : (
          <Circle size={20} color="#D1D5DB" />
        )}
        <Text style={styles.termsText}>
          I accept the <Text style={styles.termsLink}>Terms & Conditions</Text> and{' '}
          <Text style={styles.termsLink}>Privacy Policy</Text>. I confirm all uploaded documents are authentic.
        </Text>
      </TouchableOpacity>
    </>
  );

  const getDriverDocuments = () => [
    {
      id: 'dti_certificate',
      title: 'DTI / SEC Certificate',
      description: 'Please upload a clear photo of your DTI or SEC certificate. Signaduhing ito ay orhinal at malinaw.',
      required: true,
    },
    {
      id: 'business_permit',
      title: 'Business Permit',
      description: 'Ensure the business permit is valid and current. Dapat malinaw ang lahat ng information.',
      required: true,
    },
    {
      id: 'proof_of_location',
      title: 'Proof of Location',
      description: 'Ang lokasyon ay dapat madaling mapuntahan ng mga riders at customers.',
      required: true,
    },
    {
      id: 'selfie_with_id',
      title: 'Selfie with ID',
      description: 'Take a selfie while holding your valid ID. Dapat malinaw ang iyong mukha at ID.',
      required: true,
    },
  ];

  const getOperatorDocuments = () => [
    {
      id: 'dti_certificate',
      title: 'DTI / SEC Certificate',
      description: 'Signaduhing ito ay orhinal at malinaw na mababasa ang lahat ng information.',
      required: true,
    },
    {
      id: 'business_permit',
      title: 'Business Permit',
      description: 'Siguruduhing ang permiso ay up-to-date at may stamp mula sa Mayor\'s office.',
      required: true,
    },
    {
      id: 'proof_of_location',
      title: 'Proof of Location',
      description: 'Ihandog ang patunay na ang lokasyon ay accessible sa lahat ng oras.',
      required: true,
    },
    {
      id: 'selfie_with_id',
      title: 'Selfie with ID',
      description: 'Kunin ang selfie na kasama ang iyong valid ID document.',
      required: true,
    },
  ];

  const renderVerification = () => (
    <>
      <View style={styles.requirementsSection}>
        <Text style={styles.requirementsTitle}>Registration Requirements</Text>

        {activeTab === 'driver' ? (
          <>
            <View style={styles.requirementItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.requirementText}>
                <Text style={styles.requirementBold}>Edad requirement: </Text>
                Kailangan mong maging 18 taong gulang o mas matanda.
              </Text>
            </View>

            <View style={styles.requirementItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.requirementText}>
                <Text style={styles.requirementBold}>Driver requirements: </Text>
                May valid driver's license na recognized ng LTO.
              </Text>
            </View>

            <View style={styles.requirementItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.requirementText}>
                <Text style={styles.requirementBold}>Documents: </Text>
                Kailangan mo ng DTI/SEC certification at proof ng business establishment.
              </Text>
            </View>

            <View style={styles.requirementItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.requirementText}>
                <Text style={styles.requirementBold}>Accessibility: </Text>
                Ang lokasyon ay dapat accessible sa lahat ng oras para sa mga customers.
              </Text>
            </View>
          </>
        ) : (
          <>
            <View style={styles.requirementItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.requirementText}>
                <Text style={styles.requirementBold}>Business location: </Text>
                Dapat ay may physical space o establishment para sa drop-off point.
              </Text>
            </View>

            <View style={styles.requirementItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.requirementText}>
                <Text style={styles.requirementBold}>Business Compliance: </Text>
                Siguraduhing updated ang DTI/SEC at Mayor's Permit ng iyong lokasyon.
              </Text>
            </View>

            <View style={styles.requirementItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.requirementText}>
                <Text style={styles.requirementBold}>Accessible Area: </Text>
                Ang lokasyon ay dapat madaling maabot ng mga riders at customers.
              </Text>
            </View>

            <View style={styles.requirementItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.requirementText}>
                <Text style={styles.requirementBold}>Professionalism: </Text>
                Inaasahan naming mapanatili ang professional na serbisyo sa mga customers.
              </Text>
            </View>
          </>
        )}
      </View>

      <Text style={styles.uploadSectionTitle}>Upload Your Documents</Text>
      <ImageUploadComponent
        documents={activeTab === 'driver' ? getDriverDocuments() : getOperatorDocuments()}
        onDocumentsSelected={
          activeTab === 'driver' ? setDriverDocs : setOperatorDocs
        }
      />

      <TouchableOpacity
        style={styles.termsCheckboxContainer}
        onPress={() => setAgreedToTerms(!agreedToTerms)}
        activeOpacity={0.8}
      >
        {agreedToTerms ? (
          <CheckCircle size={20} color="#13918F" />
        ) : (
          <Circle size={20} color="#D1D5DB" />
        )}
        <Text style={styles.termsText}>
          I accept the <Text style={styles.termsLink}>Terms & Conditions</Text> and{' '}
          <Text style={styles.termsLink}>Privacy Policy</Text>. I confirm all uploaded documents are authentic.
        </Text>
      </TouchableOpacity>
    </>
  );

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
                step === 1 && { width: '25%' },
                step === 2 && { width: '50%' },
                step === 3 && { width: '75%' },
                step === 4 && { width: '100%' },
                activeTab === 'sender' && step === 3 && { width: '100%' },
              ]}
            />
          </View>

          <View style={styles.card}>
            {step === 1 && renderRoleSelection()}
            {step === 2 && renderPersonalInfo()}
            {step === 3 && renderAddressAndSecurity()}
            {step === 4 && renderVerification()}
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
  progressBar: { height: 6, borderRadius: 99, backgroundColor: '#39B5A8' },
  progressOne: { width: '33%' },
  progressTwo: { width: '66%' },
  progressThree: { width: '100%' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 34, padding: 24, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 24, shadowOffset: { width: 0, height: 16 }, elevation: 6 },
  requirementsSection: { marginBottom: 20 },
  requirementsTitle: { fontSize: 16, fontWeight: '700', color: '#041614', marginBottom: 14 },
  requirementItem: { flexDirection: 'row', marginBottom: 12 },
  bulletPoint: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#13918F', marginRight: 12, marginTop: 6 },
  requirementText: { flex: 1, fontSize: 13, color: '#6B7280', lineHeight: 20 },
  requirementBold: { fontWeight: '700', color: '#041614' },
  uploadSectionTitle: { fontSize: 14, fontWeight: '700', color: '#041614', marginBottom: 12, marginTop: 8 },
  termsCheckboxContainer: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginTop: 16, paddingBottom: 16 },
  termsText: { flex: 1, fontSize: 12, color: '#6B7280', lineHeight: 18, fontWeight: '500' },
  termsLink: { color: '#13918F', fontWeight: '700', textDecorationLine: 'underline' },
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
