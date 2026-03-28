import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  TextInput,
  TextInputProps
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  ChevronLeft, User, Mail, Truck, Calendar, 
  MapPin, Lock, FileText, CheckCircle2, Eye, EyeOff 
} from 'lucide-react-native';

// --- Types ---
type UserRole = "customer" | "driver" | "operator" | null;
type Step = "role" | "reminder" | "operator_reminder" | "info" | "address" | "documents";

interface FigmaInputProps extends TextInputProps {
  label: string;
  icon?: React.ReactNode;
  prefix?: string;
  error?: string;
  showEye?: boolean;
  eyeOpen?: boolean;
  onEyeClick?: () => void;
}

// --- Helpers ---
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASS_REGEX = /^(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

const calculateAge = (dobString: string): number => {
  if (!dobString) return 0;
  const birthDate = new Date(dobString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const isBeforeBirthday = 
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());
  
  return isBeforeBirthday ? age - 1 : age;
};

const getDobError = (dob: string, role: UserRole): string => {
  if (!dob) return "";
  const age = calculateAge(dob);
  if (role === "customer" && age < 16) return "Must be at least 16.";
  if (role !== "customer" && (age < 18 || age > 65)) return "Age must be 18-65.";
  return "";
};

// --- Custom Components ---
const FigmaInput = ({ label, icon, prefix, error, showEye, eyeOpen, onEyeClick, ...props }: FigmaInputProps) => (
  <View style={styles.inputWrapper}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={[styles.inputContainer, error ? styles.inputErrorBorder : null]}>
      {prefix ? (
        <View style={styles.prefixBox}>
          <Text style={styles.prefixText}>{prefix}</Text>
        </View>
      ) : (
        <View style={styles.inputIcon}>{icon}</View>
      )}
      <TextInput
        style={styles.textInput}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {showEye && (
        <TouchableOpacity onPress={onEyeClick} style={styles.eyeIcon} activeOpacity={0.7}>
          {eyeOpen ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#9CA3AF" />}
        </TouchableOpacity>
      )}
    </View>
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

export default function SignUpPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("role");
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  
  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    bdayDay: "",
    bdayMonth: "",
    bdayYear: "",
    password: "",
    confirmPassword: "",
    address: "",
    city: "",
    province: "",
  });

  // Validation
  const validation = useMemo(() => {
    const errors: Record<string, string> = {};
    
    if (formData.email && !EMAIL_REGEX.test(formData.email)) errors.email = "Valid email is required.";
    if (formData.password && !PASS_REGEX.test(formData.password)) errors.passErr = "8+ chars, 1 number, & 1 symbol required.";
    if (formData.confirmPassword && formData.password !== formData.confirmPassword) errors.confirmErr = "Passwords do not match.";

    let dobString = "";
    if (formData.bdayYear.length === 4 && formData.bdayMonth && formData.bdayDay) {
      dobString = `${formData.bdayYear}-${formData.bdayMonth.padStart(2, '0')}-${formData.bdayDay.padStart(2, '0')}`;
    }

    const dobErrorMsg = getDobError(dobString, selectedRole);
    if (dobErrorMsg) errors.dob = dobErrorMsg;

    const isInfoValid =
      formData.fullName.length >= 3 &&
      EMAIL_REGEX.test(formData.email) &&
      formData.phone.length === 10 &&
      !dobErrorMsg &&
      dobString !== "";

    const isAddressValid =
      formData.address.length > 5 &&
      formData.city.length > 2 &&
      PASS_REGEX.test(formData.password) &&
      formData.password === formData.confirmPassword;

    return { errors, isInfoValid, isAddressValid };
  }, [formData, selectedRole]);

  // Handlers
  const handlePhoneChange = (value: string) => {
    setFormData({ ...formData, phone: value.replace(/\D/g, "").slice(0, 10) });
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === "driver") setCurrentStep("reminder");
    else if (role === "operator") setCurrentStep("operator_reminder");
    else setCurrentStep("info");
  };

  const handleNext = () => {
    if (currentStep === "info") setCurrentStep("address");
    else if (currentStep === "address") {
      if (selectedRole === "customer") router.replace("/customer/home");
      else setCurrentStep("documents");
    }
  };

  const handleFinalSubmit = () => {
    if (!agreedToTerms) return;
    if (selectedRole === "driver") router.replace("/driver/home");
    else if (selectedRole === "operator") router.replace("/operator/home");
  };

  const handleBack = () => {
    if (currentStep === "documents") setCurrentStep("address");
    else if (currentStep === "address") setCurrentStep("info");
    else if (currentStep === "info") {
      if (selectedRole === "customer") setCurrentStep("role");
      else setCurrentStep(selectedRole === "driver" ? "reminder" : "operator_reminder");
    } else if (currentStep === "reminder" || currentStep === "operator_reminder") {
      setCurrentStep("role");
    } else {
      if (router.canGoBack()) router.back();
    }
  };

  // Dynamic UI Data
  const stepTitle = {
    role: "Join PakiSHIP",
    reminder: "Registration Requirements",
    operator_reminder: "Registration Requirements",
    info: "Personal Details",
    address: "Secure Account",
    documents: "Verification",
  }[currentStep];

  const getProgressWidth = () => {
    if (currentStep === "info") return "33.3%";
    if (currentStep === "address") return "66.6%";
    if (currentStep === "documents") return "100%";
    return "0%";
  };

  const renderFooterButton = () => {
    if (currentStep === "reminder" || currentStep === "operator_reminder") {
      return (
        <TouchableOpacity style={styles.primaryBtn} onPress={() => setCurrentStep("info")}>
          <Text style={styles.primaryBtnText}>PROCEED TO SIGN UP</Text>
        </TouchableOpacity>
      );
    }
    if (currentStep === "info") {
      return (
        <TouchableOpacity 
          style={[styles.primaryBtn, !validation.isInfoValid && styles.disabledBtn]} 
          disabled={!validation.isInfoValid} 
          onPress={handleNext}
        >
          <Text style={styles.primaryBtnText}>CONTINUE</Text>
        </TouchableOpacity>
      );
    }
    if (currentStep === "address") {
      return (
        <TouchableOpacity 
          style={[styles.primaryBtn, !validation.isAddressValid && styles.disabledBtn]} 
          disabled={!validation.isAddressValid} 
          onPress={handleNext}
        >
          <Text style={styles.primaryBtnText}>CONTINUE</Text>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity 
        style={[styles.primaryBtn, { backgroundColor: '#39B5A8' }, !agreedToTerms && styles.disabledBtn]} 
        disabled={!agreedToTerms} 
        onPress={handleFinalSubmit}
      >
        <Text style={styles.primaryBtnText}>SUBMIT APPLICATION</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ChevronLeft size={28} color="#39B5A8" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>{stepTitle}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Progress Bar */}
      {!["role", "reminder", "operator_reminder"].includes(currentStep) && (
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: getProgressWidth() as any }]} />
        </View>
      )}

      {/* Main Content Area */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={styles.flex}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          
          {currentStep === "role" && (
            <View style={styles.stepContainer}>
              <Text style={styles.createAccountText}>CREATE ACCOUNT</Text>
              <Text style={styles.mainTitle}>Join the PakiSHIP{'\n'}community.</Text>

              <TouchableOpacity style={styles.roleCard} onPress={() => handleRoleSelect("customer")} activeOpacity={0.8}>
                <View style={styles.iconBox}><User size={24} color="#39B5A8" /></View>
                <View style={styles.roleTextContainer}>
                  <Text style={styles.roleTitle}>Parcel Sender</Text>
                  <Text style={styles.roleSubtitle}>I need to send and track parcels quickly.</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.roleCard} onPress={() => handleRoleSelect("driver")} activeOpacity={0.8}>
                <View style={styles.iconBox}><Truck size={24} color="#39B5A8" /></View>
                <View style={styles.roleTextContainer}>
                  <Text style={styles.roleTitle}>Driver</Text>
                  <Text style={styles.roleSubtitle}>I want to deliver and earn money.</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.roleCard} onPress={() => handleRoleSelect("operator")} activeOpacity={0.8}>
                <View style={styles.iconBox}><MapPin size={24} color="#39B5A8" /></View>
                <View style={styles.roleTextContainer}>
                  <Text style={styles.roleTitle}>Operator</Text>
                  <Text style={styles.roleSubtitle}>I want to manage a drop-off point.</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {(currentStep === "reminder" || currentStep === "operator_reminder") && (
            <View style={styles.stepContainer}>
              <View style={styles.reminderBox}>
                <FileText size={40} color="#39B5A8" style={{ marginBottom: 16 }} />
                <Text style={styles.reminderTitle}>Prepare Your Documents</Text>
                <Text style={styles.reminderText}>
                  Make sure you have your valid ID, vehicle registration (if applicable), and necessary permits ready before proceeding.
                </Text>
              </View>
            </View>
          )}

          {currentStep === "info" && (
            <View style={styles.stepContainer}>
              <View style={styles.stepHeader}>
                <Text style={styles.stepIndicator}>STEP 1</Text>
                <Text style={styles.stepMainTitle}>Tell us about yourself</Text>
              </View>

              <FigmaInput
                label="Full Name"
                icon={<User size={20} color="#39B5A8" />}
                value={formData.fullName}
                onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                placeholder="Juan Dela Cruz"
                autoCapitalize="words"
              />
              
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>DATE OF BIRTH</Text>
                <View style={[styles.inputContainer, validation.errors.dob ? styles.inputErrorBorder : null]}>
                  <View style={styles.inputIcon}><Calendar size={20} color="#39B5A8" /></View>
                  <TextInput
                    style={styles.datePartInput}
                    placeholder="DD"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="number-pad"
                    maxLength={2}
                    value={formData.bdayDay}
                    onChangeText={(text) => setFormData({ ...formData, bdayDay: text.replace(/[^0-9]/g, '') })}
                  />
                  <Text style={styles.dateSlash}>/</Text>
                  <TextInput
                    style={styles.datePartInput}
                    placeholder="MM"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="number-pad"
                    maxLength={2}
                    value={formData.bdayMonth}
                    onChangeText={(text) => setFormData({ ...formData, bdayMonth: text.replace(/[^0-9]/g, '') })}
                  />
                  <Text style={styles.dateSlash}>/</Text>
                  <TextInput
                    style={[styles.datePartInput, { minWidth: 50 }]}
                    placeholder="YYYY"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="number-pad"
                    maxLength={4}
                    value={formData.bdayYear}
                    onChangeText={(text) => setFormData({ ...formData, bdayYear: text.replace(/[^0-9]/g, '') })}
                  />
                </View>
                {validation.errors.dob ? <Text style={styles.errorText}>{validation.errors.dob}</Text> : null}
              </View>

              <FigmaInput
                label="Mobile Number"
                prefix="+63" 
                value={formData.phone}
                onChangeText={handlePhoneChange}
                placeholder="912 345 6789"
                keyboardType="number-pad"
                maxLength={10}
              />

              <FigmaInput
                label="Email Address"
                icon={<Mail size={20} color="#39B5A8" />}
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                placeholder="name@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                error={validation.errors.email}
              />
            </View>
          )}

          {currentStep === "address" && (
            <View style={styles.stepContainer}>
              <View style={styles.stepHeader}>
                <Text style={styles.stepIndicator}>STEP 2</Text>
                <Text style={styles.stepMainTitle}>Secure your account</Text>
              </View>

              <FigmaInput
                label="Street Address"
                icon={<MapPin size={20} color="#39B5A8" />}
                value={formData.address}
                onChangeText={(text) => setFormData({ ...formData, address: text })}
                placeholder="123 Rizal St."
              />
              <FigmaInput
                label="City"
                icon={<MapPin size={20} color="#39B5A8" />}
                value={formData.city}
                onChangeText={(text) => setFormData({ ...formData, city: text })}
                placeholder="Manila"
              />
              <FigmaInput
                label="Province"
                icon={<MapPin size={20} color="#39B5A8" />}
                value={formData.province}
                onChangeText={(text) => setFormData({ ...formData, province: text })}
                placeholder="Metro Manila"
              />
              <FigmaInput
                label="Password"
                icon={<Lock size={20} color="#39B5A8" />}
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                showEye
                eyeOpen={showPassword}
                onEyeClick={() => setShowPassword(!showPassword)}
                error={validation.errors.passErr}
              />
              <FigmaInput
                label="Confirm Password"
                icon={<Lock size={20} color="#39B5A8" />}
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                placeholder="••••••••"
                secureTextEntry={!showConfirmPassword}
                showEye
                eyeOpen={showConfirmPassword}
                onEyeClick={() => setShowConfirmPassword(!showConfirmPassword)}
                error={validation.errors.confirmErr}
              />
            </View>
          )}

          {currentStep === "documents" && (
            <View style={styles.stepContainer}>
              <Text style={styles.reminderTitle}>Upload Documents</Text>
              <Text style={styles.reminderText}>Document uploading will be implemented in the next phase using Expo Document Picker.</Text>
              
              <TouchableOpacity 
                style={styles.checkboxRow} 
                onPress={() => setAgreedToTerms(!agreedToTerms)}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, agreedToTerms && styles.checkboxActive]}>
                  {agreedToTerms && <CheckCircle2 size={16} color="#FFF" />}
                </View>
                <Text style={styles.checkboxText}>I agree to the Terms & Conditions</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        {/* Footer positioned inside KeyboardAvoidingView to push up smoothly */}
        {currentStep !== "role" && (
          <View style={styles.footer}>
            {renderFooterButton()}
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF' },
  flex: { flex: 1 },
  
  // Navigation
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, height: 60, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', backgroundColor: '#FFF' },
  backButton: { padding: 8, marginLeft: -8 },
  navTitle: { fontSize: 18, fontWeight: 'bold', color: '#041614' },
  placeholder: { width: 40 },
  
  // Progress Bar
  progressBarBg: { height: 6, backgroundColor: '#F0F9F8', width: '100%' },
  progressBarFill: { height: '100%', backgroundColor: '#39B5A8' },
  
  // Layout
  scrollContent: { padding: 24, paddingBottom: 40, flexGrow: 1 },
  stepContainer: { flex: 1 },
  
  // Typography
  createAccountText: { textAlign: 'center', color: '#39B5A8', fontWeight: 'bold', letterSpacing: 1.5, fontSize: 13, marginBottom: 8 },
  mainTitle: { textAlign: 'center', fontSize: 26, fontWeight: '900', color: '#041614', marginBottom: 32 },
  
  // Role Selection Cards
  roleCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 20, marginBottom: 16, borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  iconBox: { width: 60, height: 60, backgroundColor: '#F4F9F8', borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  roleTextContainer: { flex: 1 },
  roleTitle: { fontSize: 16, fontWeight: 'bold', color: '#041614', marginBottom: 4 },
  roleSubtitle: { fontSize: 13, color: '#9CA3AF', lineHeight: 18 },

  // Reminders & Document Verification
  reminderBox: { backgroundColor: '#F4F9F8', padding: 24, borderRadius: 20, alignItems: 'center' },
  reminderTitle: { fontSize: 20, fontWeight: 'bold', color: '#041614', marginBottom: 8 },
  reminderText: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 22, marginBottom: 16 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginTop: 24, gap: 12 },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: '#39B5A8', borderColor: '#39B5A8' },
  checkboxText: { fontSize: 14, color: '#374151', fontWeight: '500' },
  
  // Form Steps Info
  stepHeader: { marginBottom: 24 },
  stepIndicator: { fontSize: 10, fontWeight: 'bold', color: '#39B5A8', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 },
  stepMainTitle: { fontSize: 26, fontWeight: '900', color: '#041614' },
  
  // Input Component
  inputWrapper: { marginBottom: 16 },
  inputLabel: { fontSize: 10, fontWeight: 'bold', color: '#39B5A8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginLeft: 4 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F4F9F8', borderRadius: 20, height: 56, overflow: 'hidden', borderWidth: 1, borderColor: 'transparent' },
  inputErrorBorder: { borderColor: '#EF4444' },
  inputIcon: { paddingHorizontal: 16 },
  prefixBox: { backgroundColor: '#E8F3F1', paddingHorizontal: 16, height: '100%', justifyContent: 'center', alignItems: 'center' },
  prefixText: { fontSize: 14, fontWeight: '900', color: '#041614' },
  textInput: { flex: 1, height: '100%', fontSize: 14, color: '#041614', fontWeight: '500', paddingRight: 16 },
  eyeIcon: { paddingHorizontal: 16, height: '100%', justifyContent: 'center' },
  errorText: { color: '#EF4444', fontSize: 12, marginTop: 4, marginLeft: 12 },
  
  // Date Input Specifics
  datePartInput: { fontSize: 14, color: '#041614', fontWeight: '500', textAlign: 'center', minWidth: 32, height: '100%' },
  dateSlash: { fontSize: 16, color: '#9CA3AF', marginHorizontal: 4, fontWeight: '300' },

  // Footer Actions
  footer: { backgroundColor: '#FFF', paddingHorizontal: 24, paddingTop: 16, paddingBottom: Platform.OS === 'ios' ? 24 : 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  primaryBtn: { backgroundColor: '#041614', paddingVertical: 18, borderRadius: 20, alignItems: 'center' },
  disabledBtn: { opacity: 0.3 },
  primaryBtnText: { color: '#FFF', fontSize: 14, fontWeight: 'bold', letterSpacing: 2 },
});