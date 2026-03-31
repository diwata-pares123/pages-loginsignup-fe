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
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, User, Mail, Lock, MapPin, Home, Eye, EyeOff, CheckCircle, Circle, AlertCircle } from 'lucide-react-native';
import DateInput from 'src/components/DateInput';
import ImageUploadComponent from 'src/components/ImageUploadComponent';
import { api } from 'src/utils/api';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Documents State
  const [driverDocs, setDriverDocs] = useState<{ [key: string]: string | null }>({});
  const [operatorDocs, setOperatorDocs] = useState<{ [key: string]: string | null }>({});

  useEffect(() => {
    const role = Array.isArray(params.role) ? params.role[0] : params.role;
    if (role && roleOptions.has(role as TabRole)) {
      setActiveTab(role as TabRole);
      setStep(2); 
    }
  }, [params.role]);

  const handleBack = () => {
    if (step === 1) {
      router.back();
      return;
    }
    setStep((current) => Math.max(current - 1, 1));
  };

  const appendFileToForm = (formData: FormData, fieldName: string, uri: string) => {
    const filename = uri.split('/').pop() || 'upload.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image/jpeg`;

    formData.append(fieldName, {
      uri,
      name: filename,
      type,
    } as any);
  };

  const validateDocumentsUploaded = (): boolean => {
    const docsToCheck = activeTab === 'driver' ? getDriverDocuments() : getOperatorDocuments();
    const uploadedDocs = activeTab === 'driver' ? driverDocs : operatorDocs;

    for (const doc of docsToCheck) {
      if (doc.required && !uploadedDocs[doc.id]) {
        Alert.alert('Required', `Please upload your ${doc.title} to proceed.`);
        return false;
      }
    }
    return true;
  };

  const buildBaseFormData = (): FormData => {
    const formData = new FormData();
    
    const roleMapping: Record<TabRole, string> = {
      sender: 'CUSTOMER',
      driver: 'DRIVER',
      operator: 'OPERATOR',
    };
    formData.append('role', roleMapping[activeTab]);

    if (fullName.trim()) formData.append('full_name', fullName);
    if (email.trim()) formData.append('email', email);
    
    if (dob.trim()) {
      formData.append('date_of_birth', new Date(dob).toISOString());
    }

    if (address.trim()) formData.append('street_address', address);
    if (city.trim()) formData.append('city', city);
    if (province.trim()) formData.append('province', province);
    
    if (password.trim()) formData.append('password', password); 
    
    if (mobile.trim()) {
      const cleanMobile = mobile.replace(/[^0-9]/g, ''); 
      const formattedMobile = cleanMobile.startsWith('63') 
        ? `+${cleanMobile}` 
        : `+63${cleanMobile.replace(/^0+/, '')}`; 
      formData.append('phone_number', formattedMobile);
    }

    if (agreedToTerms) {
      formData.append('terms_accepted_at', new Date().toISOString());
    }

    return formData;
  };

  const validateAddressAndSecurity = (): boolean => {
    if (!address.trim()) { Alert.alert('Required', 'Street Address is required.'); return false; }
    if (!city.trim()) { Alert.alert('Required', 'City is required.'); return false; }
    if (!province.trim()) { Alert.alert('Required', 'Province is required.'); return false; }
    
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) { Alert.alert('Error', 'Please enter a valid email address.'); return false; }

    if (password !== confirmPassword) { Alert.alert('Error', 'Passwords do not match.'); return false; }
    if (!agreedToTerms) { Alert.alert('Required', 'Please accept the Terms & Conditions.'); return false; }

    return true;
  };

  const validatePersonalInfo = (): boolean => {
    if (!fullName.trim()) { Alert.alert('Required', 'Full Name is required.'); return false; }
    if (!dob.trim()) { Alert.alert('Required', 'Date of Birth is required.'); return false; }
    if (mobile.trim().length !== 10) { Alert.alert('Error', 'Mobile number must be exactly 10 digits (e.g., 9284457713).'); return false; }
    if (!email.trim()) { Alert.alert('Required', 'Email address is required.'); return false; }
    
    return true;
  };

  const submitSenderData = async (): Promise<void> => {
    if (!validateAddressAndSecurity()) return; 
    
    setIsSubmitting(true);
    try {
      const formData = buildBaseFormData();
      const response = await api.postForm('/users/profile', formData);
      console.log('Success:', response);
      Alert.alert('Success', 'Account created successfully!');
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitVerificationData = async (): Promise<void> => {
    if (!validateDocumentsUploaded()) return;
    if (!validateAddressAndSecurity()) return; 

    setIsSubmitting(true);
    try {
      const formData = buildBaseFormData();

      // Backend mapping
      const driverFileMap: Record<string, string> = {
        drivers_license: 'licenseFile',
        vehicle_orcr: 'orcrFile',
        selfie_with_id: 'selfieFile',
      };

      const operatorFileMap: Record<string, string> = {
        dti_certificate: 'dtiFile',
        business_permit: 'permitFile',
        proof_of_location: 'proofFile',
        selfie_with_id: 'selfieFile',
      };

      if (activeTab === 'driver') {
        Object.keys(driverDocs).forEach((key) => {
          const docValue = driverDocs[key];
          const backendKey = driverFileMap[key];
          if (docValue && backendKey) appendFileToForm(formData, backendKey, docValue);
        });
      } else if (activeTab === 'operator') {
        Object.keys(operatorDocs).forEach((key) => {
          const docValue = operatorDocs[key];
          const backendKey = operatorFileMap[key];
          if (docValue && backendKey) appendFileToForm(formData, backendKey, docValue);
        });
      }

      const response = await api.postForm('/users/profile', formData);
      console.log('Success:', response);
      Alert.alert('Success', 'Application submitted successfully!');
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = (): void => {
    if (step === 1) return; 
    
    // --- SENDER FLOW (Steps 1 to 3) ---
    if (activeTab === 'sender') {
      if (step === 2 && !validatePersonalInfo()) return;
      if (step < 3) {
        setStep((current) => current + 1);
        return;
      }
      submitSenderData();
      return;
    }

    // --- DRIVER & OPERATOR FLOW (Steps 1 to 5) ---
    if (step === 2) { setStep(3); return; } // Requirements screen - just next
    if (step === 3 && !validatePersonalInfo()) return;
    if (step === 4 && !validateAddressAndSecurity()) return;

    if (step < 5) {
      setStep((current) => current + 1);
      return;
    }

    submitVerificationData();
  };

  const cardData = [
    { role: 'sender' as TabRole, title: 'Parcel Sender', subtitle: 'I need to send and track parcels quickly.', icon: <User size={20} color="#13918F" /> },
    { role: 'driver' as TabRole, title: 'Driver', subtitle: 'I want to deliver and earn money.', icon: <MapPin size={20} color="#13918F" /> },
    { role: 'operator' as TabRole, title: 'Operator', subtitle: 'I want to manage a drop-off point.', icon: <Home size={20} color="#13918F" /> },
  ];

  const getStepTitle = (): string => {
    if (step === 1) return 'Join the PakiSHIP community.';
    if (activeTab === 'sender') {
      if (step === 2) return 'Tell us about yourself';
      if (step === 3) return 'Address & Security';
    } else {
      if (step === 2) return 'Before we start';
      if (step === 3) return 'Tell us about yourself';
      if (step === 4) return 'Address & Security';
      if (step === 5) return activeTab === 'driver' ? 'Driver Verification' : 'Operator Verification';
    }
    return '';
  };

  const getStepLabel = (): string => {
    if (step === 1) return 'CREATE ACCOUNT';
    if (activeTab === 'sender') {
      if (step === 2) return 'STEP 1';
      if (step === 3) return 'FINAL STEP';
    } else {
      if (step === 2) return 'REQUIREMENTS';
      if (step === 3) return 'STEP 1';
      if (step === 4) return 'STEP 2';
      if (step === 5) return 'FINAL STEP';
    }
    return '';
  };

  const getProgressBarWidth = () => {
    if (step === 1) return '20%';
    if (activeTab === 'sender') {
      if (step === 2) return '60%';
      if (step === 3) return '100%';
    } else {
      if (step === 2) return '40%';
      if (step === 3) return '60%';
      if (step === 4) return '80%';
      if (step === 5) return '100%';
    }
    return '0%';
  };

  const stepTitle = getStepTitle();
  const stepLabel = getStepLabel();
  let buttonLabel = 'CONTINUE';

  if ((step === 3 && activeTab === 'sender') || step === 5) {
    buttonLabel = 'SUBMIT APPLICATION';
  } else if (step === 2 && activeTab !== 'sender') {
    buttonLabel = 'I UNDERSTAND, CONTINUE';
  }

  const handleMobileChange = (text: string) => {
    const cleanNumber = text.replace(/[^0-9]/g, '');
    if (cleanNumber.length <= 10) {
      setMobile(cleanNumber);
    }
  };

  const renderRoleSelection = () => (
    <>
      {cardData.map((card) => (
        <TouchableOpacity
          key={card.role}
          style={[styles.selectionCard, activeTab === card.role && styles.selectionCardActive]}
          onPress={() => {
            setActiveTab(card.role);
            setStep(2); 
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

  const renderRequirements = () => (
    <View style={styles.paalalaContainer}>
      <View style={styles.paalalaHeader}>
        <AlertCircle size={28} color="#13918F" />
        <Text style={styles.paalalaTitle}>
          {activeTab === 'driver' ? 'Paalala para sa Rider' : 'Paalala sa Partner Business'}
        </Text>
      </View>
      <Text style={styles.paalalaSubtitle}>
        Mangyaring ihanda ang mga sumusunod bago magpatuloy sa aplikasyon:
      </Text>

      {activeTab === 'driver' ? (
        <>
          <View style={styles.reqCard}>
            <Text style={styles.reqCardTitle}>1. Sariling Sasakyan</Text>
            <Text style={styles.reqCardSub}>Motorcycle, Tricycle, o 4-Wheel na rehistrado.</Text>
          </View>
          <View style={styles.reqCard}>
            <Text style={styles.reqCardTitle}>2. Valid Driver's License</Text>
            <Text style={styles.reqCardSub}>Professional o Non-Professional na lisensya.</Text>
          </View>
          <View style={styles.reqCard}>
            <Text style={styles.reqCardTitle}>3. LTO OR/CR</Text>
            <Text style={styles.reqCardSub}>Opisyal na resibo at rehistro ng sasakyan.</Text>
          </View>
          <View style={styles.reqCard}>
            <Text style={styles.reqCardTitle}>4. Smartphone w/ Internet</Text>
            <Text style={styles.reqCardSub}>Kailangan para sa PakiSHIP app at mapa.</Text>
          </View>
        </>
      ) : (
        <>
          <View style={styles.reqCard}>
            <Text style={styles.reqCardTitle}>1. Physical Store / Pwesto</Text>
            <Text style={styles.reqCardSub}>Dapat madaling mapuntahan ng mga riders at customers.</Text>
          </View>
          <View style={styles.reqCard}>
            <Text style={styles.reqCardTitle}>2. Business Registration</Text>
            <Text style={styles.reqCardSub}>Valid Business Permit at DTI / SEC Certificate.</Text>
          </View>
          <View style={styles.reqCard}>
            <Text style={styles.reqCardTitle}>3. Ligtas na Espasyo</Text>
            <Text style={styles.reqCardSub}>Kailangan ng secure na lugar para i-store ang mga parcels.</Text>
          </View>
          <View style={styles.reqCard}>
            <Text style={styles.reqCardTitle}>4. Smartphone / Computer</Text>
            <Text style={styles.reqCardSub}>May internet connection para ma-access ang system.</Text>
          </View>
        </>
      )}
    </View>
  );

  const renderPersonalInfo = () => (
    <>
      <View style={styles.sectionLabelContainer}><Text style={styles.sectionLabel}>FULL NAME</Text></View>
      <View style={styles.inputContainer}>
        <View style={styles.inputIcon}><User size={20} color="#13918F" /></View>
        <TextInput style={styles.textInput} placeholder="Juan Dela Cruz" placeholderTextColor="#9CA3AF" value={fullName} onChangeText={setFullName} />
      </View>

      <View style={styles.sectionLabelContainer}><Text style={styles.sectionLabel}>DATE OF BIRTH</Text></View>
      <DateInput value={dob} onChangeText={setDob} placeholder="mm/dd/yyyy" />

      <View style={styles.sectionLabelContainer}><Text style={styles.sectionLabel}>MOBILE NUMBER</Text></View>
      <View style={styles.inputContainer}>
        <View style={styles.prefixBox}><Text style={styles.prefixText}>+63</Text></View>
        <TextInput style={styles.textInput} placeholder="912 345 6789" placeholderTextColor="#9CA3AF" keyboardType="phone-pad" value={mobile} onChangeText={handleMobileChange} />
      </View>

      <View style={styles.sectionLabelContainer}><Text style={styles.sectionLabel}>EMAIL ADDRESS</Text></View>
      <View style={styles.inputContainer}>
        <View style={styles.inputIcon}><Mail size={20} color="#13918F" /></View>
        <TextInput style={styles.textInput} placeholder="juandelacruz@email.com" placeholderTextColor="#9CA3AF" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
      </View>
    </>
  );

  const renderAddressAndSecurity = () => (
    <>
      <View style={styles.sectionLabelContainer}><Text style={styles.sectionLabel}>STREET ADDRESS</Text></View>
      <View style={styles.inputContainer}>
        <View style={styles.inputIcon}><Home size={20} color="#13918F" /></View>
        <TextInput style={styles.textInput} placeholder="123 Mabini St. Brgy. 4" placeholderTextColor="#9CA3AF" value={address} onChangeText={setAddress} />
      </View>

      <View style={styles.twoColumnRow}>
        <View style={styles.halfInputWrapper}>
          <Text style={styles.sectionLabel}>CITY</Text>
          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}><MapPin size={20} color="#13918F" /></View>
            <TextInput style={styles.textInput} placeholder="Quezon City" placeholderTextColor="#9CA3AF" value={city} onChangeText={setCity} />
          </View>
        </View>
        <View style={styles.halfInputWrapper}>
          <Text style={styles.sectionLabel}>PROVINCE</Text>
          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}><MapPin size={20} color="#13918F" /></View>
            <TextInput style={styles.textInput} placeholder="Metro Manila" placeholderTextColor="#9CA3AF" value={province} onChangeText={setProvince} />
          </View>
        </View>
      </View>

      <View style={styles.sectionLabelContainer}><Text style={styles.sectionLabel}>SET PASSWORD</Text></View>
      <View style={styles.inputContainer}>
        <View style={styles.inputIcon}><Lock size={20} color="#13918F" /></View>
        <TextInput style={styles.textInput} placeholder="8+ chars, number, symbol" placeholderTextColor="#9CA3AF" secureTextEntry={!showPassword} value={password} onChangeText={setPassword} />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
          {showPassword ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#9CA3AF" />}
        </TouchableOpacity>
      </View>

      <View style={styles.sectionLabelContainer}><Text style={styles.sectionLabel}>CONFIRM PASSWORD</Text></View>
      <View style={styles.inputContainer}>
        <View style={styles.inputIcon}><Lock size={20} color="#13918F" /></View>
        <TextInput style={styles.textInput} placeholder="Repeat password" placeholderTextColor="#9CA3AF" secureTextEntry={!showConfirmPassword} value={confirmPassword} onChangeText={setConfirmPassword} />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
          {showConfirmPassword ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#9CA3AF" />}
        </TouchableOpacity>
      </View>

      {/* Only show terms here if Sender. Otherwise show it on the final Verification step */}
      {activeTab === 'sender' && (
        <TouchableOpacity style={styles.termsCheckboxContainer} onPress={() => setAgreedToTerms(!agreedToTerms)} activeOpacity={0.8}>
          {agreedToTerms ? <CheckCircle size={20} color="#13918F" /> : <Circle size={20} color="#D1D5DB" />}
          <Text style={styles.termsText}>
            I accept the <Text style={styles.termsLink}>Terms & Conditions</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>.
          </Text>
        </TouchableOpacity>
      )}
    </>
  );

  const getDriverDocuments = () => [
    { id: 'drivers_license', title: "Driver's License", description: 'Please upload a clear photo of your professional or non-professional driver\'s license.', required: true },
    { id: 'vehicle_orcr', title: 'Vehicle OR/CR', description: 'Upload a clear photo of your official receipt and certificate of registration.', required: true },
    { id: 'selfie_with_id', title: 'Selfie with ID', description: 'Take a selfie while holding your valid ID next to your face.', required: true },
  ];

  const getOperatorDocuments = () => [
    { id: 'dti_certificate', title: 'DTI / SEC Certificate', description: 'Siguraduhing ito ay orihinal at malinaw na mababasa ang lahat ng information.', required: true },
    { id: 'business_permit', title: 'Business Permit', description: 'Siguraduhing ang permiso ay up-to-date at valid.', required: true },
    { id: 'proof_of_location', title: 'Proof of Location', description: 'Ihandog ang patunay na ang lokasyon ay accessible sa lahat.', required: true },
    { id: 'selfie_with_id', title: 'Selfie with ID', description: 'Kunin ang selfie na kasama ang iyong valid ID document.', required: true },
  ];

  const renderVerification = () => (
    <>
      <Text style={styles.uploadSectionTitle}>Upload Required Documents</Text>
      <ImageUploadComponent
        documents={activeTab === 'driver' ? getDriverDocuments() : getOperatorDocuments()}
        onDocumentsSelected={activeTab === 'driver' ? setDriverDocs : setOperatorDocs}
      />

      <TouchableOpacity style={styles.termsCheckboxContainer} onPress={() => setAgreedToTerms(!agreedToTerms)} activeOpacity={0.8}>
        {agreedToTerms ? <CheckCircle size={20} color="#13918F" /> : <Circle size={20} color="#D1D5DB" />}
        <Text style={styles.termsText}>
          I accept the <Text style={styles.termsLink}>Terms & Conditions</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>. I confirm all uploaded documents are authentic.
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
            <View style={[styles.progressBar, { width: getProgressBarWidth() }]} />
          </View>

          <View style={styles.card}>
            {step === 1 && renderRoleSelection()}
            {step === 2 && activeTab !== 'sender' && renderRequirements()}
            {((step === 2 && activeTab === 'sender') || (step === 3 && activeTab !== 'sender')) && renderPersonalInfo()}
            {((step === 3 && activeTab === 'sender') || (step === 4 && activeTab !== 'sender')) && renderAddressAndSecurity()}
            {step === 5 && activeTab !== 'sender' && renderVerification()}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          {step !== 1 && (
            <TouchableOpacity 
              style={[styles.continueButton, isSubmitting && { opacity: 0.7 }]} 
              onPress={handleNext} 
              activeOpacity={0.85}
              disabled={isSubmitting} 
            >
              <Text style={styles.continueButtonText}>
                {isSubmitting ? 'SUBMITTING...' : buttonLabel}
              </Text>
            </TouchableOpacity>
          )}
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
  card: { backgroundColor: '#FFFFFF', borderRadius: 34, padding: 24, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 24, shadowOffset: { width: 0, height: 16 }, elevation: 6 },
  
  // New Styles for the Paalala Screens
  paalalaContainer: { marginBottom: 10 },
  paalalaHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  paalalaTitle: { fontSize: 20, fontWeight: '800', color: '#041614' },
  paalalaSubtitle: { fontSize: 13, color: '#6B7280', marginBottom: 24, lineHeight: 20 },
  reqCard: { backgroundColor: '#F4FBFA', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E5F1EF' },
  reqCardTitle: { fontSize: 14, fontWeight: '800', color: '#13918F', marginBottom: 4 },
  reqCardSub: { fontSize: 12, color: '#4B5563', lineHeight: 18 },

  uploadSectionTitle: { fontSize: 16, fontWeight: '800', color: '#041614', marginBottom: 16 },
  termsCheckboxContainer: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginTop: 16, paddingBottom: 16 },
  termsText: { flex: 1, fontSize: 12, color: '#6B7280', lineHeight: 18, fontWeight: '500' },
  termsLink: { color: '#13918F', fontWeight: '700', textDecorationLine: 'underline' },
  selectionCard: { backgroundColor: '#F4FBFA', borderRadius: 24, padding: 18, flexDirection: 'row', alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: 'transparent' },
  selectionCardActive: { backgroundColor: '#FFFFFF', borderColor: '#C9EEE9', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 18, shadowOffset: { width: 0, height: 10 }, elevation: 4 },
  selectionIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#DFF6F2', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  selectionText: { flex: 1 },
  selectionTitle: { fontSize: 16, fontWeight: '900', color: '#041614', marginBottom: 4 },
  selectionSubtitle: { fontSize: 13, color: '#6B7280', lineHeight: 20 },
  sectionLabelContainer: { marginBottom: 8, marginTop: 4 },
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