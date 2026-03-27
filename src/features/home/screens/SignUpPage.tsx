import React, { useState, useMemo } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  ActivityIndicator
} from "react-native";
import { useRouter } from "expo-router"; 
import { ChevronLeft } from "lucide-react-native";

// Corrected relative paths to the auth/components folder
import { UserRole, Step, FormData as FormDataType, ValidationResult } from "./auth/components/SignUpShared";
import { RoleSelection } from "./auth/components/RoleSelection";
import { InfoForm } from "./auth/components/InfoForm";
import { AddressForm } from "./auth/components/AddressForm";
import { DocumentsForm } from "./auth/components/DocumentForms"; 
import { UploadedFile } from "./auth/components/UploadBox";
import { DriverReminder } from "./auth/components/DriverReminder";
import { OperatorReminder } from "./auth/components/OperatorReminder";

export default function SignUpScreen() {
  const router = useRouter();
  
  // --- STATE ---
  const [currentStep, setCurrentStep] = useState<Step>("role");
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false); // Added loading state
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadedFile | null>>({});
  const [formData, setFormData] = useState<FormDataType>({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    password: "",
    confirmPassword: "",
    address: "",
    city: "",
    province: "",
  });

  // --- VALIDATION ---
  const validation = useMemo((): ValidationResult => {
    const errors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email))
      errors.email = "Valid email is required.";

    const passRegex = /^(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (formData.password && !passRegex.test(formData.password)) {
      errors.password = "8+ chars, 1 number, & 1 symbol required.";
    }

    if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    let age = 0;
    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      age = today.getFullYear() - birthDate.getFullYear();
      if (
        today.getMonth() < birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
      ) age--;

      if (selectedRole === "customer") {
        if (age < 16) errors.dob = "Must be at least 16.";
      } else {
        if (age < 18 || age > 65) errors.dob = "Age must be 18-65.";
      }
    }

    const isSenior = age >= 51 && age <= 65;
    const isInfoValid =
      formData.fullName.length >= 3 &&
      emailRegex.test(formData.email) &&
      formData.phone.length === 10 &&
      !errors.dob &&
      formData.dob !== "";

    const isAddressValid =
      formData.address.length > 5 &&
      formData.city.length > 2 &&
      passRegex.test(formData.password) &&
      formData.password === formData.confirmPassword;

    return { errors, isInfoValid, isAddressValid, isSenior };
  }, [formData, selectedRole]);

  // --- BACKEND LOGIC ---
  const processFinalRegistration = async () => {
    setLoading(true);
    try {
      const data = new FormData();

      // 1. Basic Profile Info (Mapping to your NestJS DTO)
      data.append('user_id', formData.email); // Placeholder for UUID
      data.append('email', formData.email);
      data.append('full_name', formData.fullName);
      data.append('phone_number', formData.phone);
      data.append('role', selectedRole?.toUpperCase() || 'CUSTOMER');
      data.append('date_of_birth', formData.dob);
      
      // 2. Address & Account Info
      data.append('address_line_1', formData.address);
      data.append('city', formData.city);
      data.append('province', formData.province);
      data.append('password', formData.password); 

      // 3. File Upload Logic (Matching NestJS fieldnames exactly)
      if (selectedRole !== "customer") {
        if (uploadedFiles.licenseFront) {
          data.append('driverLicenseFront', {
            uri: uploadedFiles.licenseFront.uri,
            name: 'license_f.jpg',
            type: 'image/jpeg',
          } as any);
        }
        if (uploadedFiles.licenseBack) {
          data.append('driverLicenseBack', {
            uri: uploadedFiles.licenseBack.uri,
            name: 'license_b.jpg',
            type: 'image/jpeg',
          } as any);
        }
        if (uploadedFiles.vehicleFile) {
          data.append('vehicleFile', {
            uri: uploadedFiles.vehicleFile.uri,
            name: 'orcr.jpg',
            type: 'image/jpeg',
          } as any);
        }
        if (uploadedFiles.dtiFile) {
          data.append('dtiFile', {
            uri: uploadedFiles.dtiFile.uri,
            name: 'dti.jpg',
            type: 'image/jpeg',
          } as any);
        }
        if (uploadedFiles.permitFile) {
          data.append('permitFile', {
            uri: uploadedFiles.permitFile.uri,
            name: 'permit.jpg',
            type: 'image/jpeg',
          } as any);
        }
      }

      // 4. API Call - Use your laptop's IP address!
      const response = await fetch('http://192.168.101.248:3000/users/profile', {
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const target = selectedRole === "customer" ? "/customer/home" : 
                       selectedRole === "driver"   ? "/driver/home"   : "/operator/home";
        router.replace(target as any);
      } else {
        const errorRes = await response.json();
        Alert.alert("Registration Failed", errorRes.message || "Something went wrong.");
      }

    } catch (error) {
      console.error(error);
      Alert.alert("Network Error", "Could not connect to server. Is your IP correct and backend running?");
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLERS ---
  const handlePhoneChange = (text: string) =>
    setFormData({
      ...formData,
      phone: text.replace(/\D/g, "").slice(0, 10),
    });

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === "driver") setCurrentStep("reminder");
    else if (role === "operator") setCurrentStep("operator_reminder");
    else setCurrentStep("info");
  };

  const handleNext = async () => {
    if (currentStep === "info") {
      setCurrentStep("address");
    } else if (currentStep === "address") {
      if (selectedRole === "customer") {
        await processFinalRegistration();
      } else {
        setCurrentStep("documents");
      }
    }
  };

  const handleFinalSubmit = async () => {
    if (!agreedToTerms) {
      Alert.alert("Agreement Required", "Please agree to the Terms and Conditions.");
      return;
    }
    await processFinalRegistration();
  };

  const handleBack = () => {
    if (currentStep === "documents") setCurrentStep("address");
    else if (currentStep === "address") setCurrentStep("info");
    else if (currentStep === "info") {
      setCurrentStep(
        selectedRole === "customer"
          ? "role"
          : selectedRole === "driver"
            ? "reminder"
            : "operator_reminder"
      );
    }
    else if (currentStep === "reminder" || currentStep === "operator_reminder") setCurrentStep("role");
    else router.back();
  };

  // --- DYNAMIC UI VALUES ---
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
    return "100%";
  };

  // --- RENDER HELPERS ---
  const renderFooterButton = () => {
    if (loading) {
      return (
        <View style={styles.primaryBtn}>
          <ActivityIndicator color="#FFFFFF" />
        </View>
      );
    }

    if (currentStep === "reminder" || currentStep === "operator_reminder") {
      return (
        <View style={styles.footerStack}>
          <TouchableOpacity onPress={() => setCurrentStep("info")} style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>PROCEED TO SIGN UP</Text>
          </TouchableOpacity>
          <Text style={styles.footerNote}>
            Sa pag-proceed, kinukumpirma mo na ang inyong hub ay sumusunod sa mga requirement.
          </Text>
        </View>
      );
    }

    if (currentStep === "info" || currentStep === "address") {
      const isValid = currentStep === "info" ? validation.isInfoValid : validation.isAddressValid;
      return (
        <TouchableOpacity 
          onPress={handleNext}
          disabled={!isValid} 
          style={[styles.primaryBtn, !isValid && styles.btnDisabled]}
        >
          <Text style={styles.primaryBtnText}>CONTINUE</Text>
        </TouchableOpacity>
      );
    }

    if (currentStep === "documents") {
      return (
        <TouchableOpacity 
          onPress={handleFinalSubmit}
          disabled={!agreedToTerms} 
          style={[styles.submitBtn, !agreedToTerms && styles.btnDisabled]}
        >
          <Text style={styles.primaryBtnText}>SUBMIT APPLICATION</Text>
        </TouchableOpacity>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        
        {/* TOP NAVIGATION */}
        <View style={styles.nav}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ChevronLeft size={28} color="#39B5A8" />
          </TouchableOpacity>
          <Text style={styles.title}>{stepTitle}</Text>
          <View style={{ width: 40 }} /> 
        </View>

        {/* PROGRESS BAR */}
        {!["role", "reminder", "operator_reminder"].includes(currentStep) && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: getProgressWidth() as any }]} />
          </View>
        )}

        {/* MAIN SCROLLABLE CONTENT */}
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {currentStep === "role" && <RoleSelection onRoleSelect={handleRoleSelect} />}
          {currentStep === "reminder" && <DriverReminder />}
          {currentStep === "operator_reminder" && <OperatorReminder />}
          {currentStep === "info" && (
            <InfoForm
              formData={formData}
              setFormData={setFormData}
              validation={validation}
              onSubmit={handleNext}
              handlePhoneChange={handlePhoneChange}
            />
          )}
          {currentStep === "address" && (
            <AddressForm
              formData={formData}
              setFormData={setFormData}
              validation={validation}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              onSubmit={handleNext}
            />
          )}
          {currentStep === "documents" && (
            <DocumentsForm
              selectedRole={selectedRole}
              uploadedFiles={uploadedFiles}
              setUploadedFiles={setUploadedFiles}
              validation={validation}
              agreedToTerms={agreedToTerms}
              setAgreedToTerms={setAgreedToTerms}
            />
          )}
        </ScrollView>

        {/* FIXED BOTTOM FOOTER */}
        {currentStep !== "role" && (
          <View style={styles.footer}>
            {renderFooterButton()}
          </View>
        )}

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  nav: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(57, 181, 168, 0.1)',
    backgroundColor: '#FFFFFF',
    marginTop: Platform.OS === 'android' ? 24 : 0,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#041614',
    letterSpacing: -0.5,
  },
  progressContainer: {
    height: 6,
    backgroundColor: '#F0F9F8',
    width: '100%',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#39B5A8',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 120, 
  },
  footer: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: 'rgba(57, 181, 168, 0.1)',
    paddingBottom: Platform.OS === 'ios' ? 34 : 24, 
  },
  footerStack: {
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: '#041614',
    paddingVertical: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
    minHeight: 60,
  },
  submitBtn: {
    backgroundColor: '#39B5A8',
    paddingVertical: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#39B5A8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
    minHeight: 60,
  },
  btnDisabled: {
    opacity: 0.3,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  footerNote: {
    textAlign: 'center',
    fontSize: 10,
    color: '#9CA3AF',
    paddingHorizontal: 20,
    lineHeight: 14,
  }
});