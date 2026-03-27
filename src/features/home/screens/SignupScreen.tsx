import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { ChevronLeft } from 'lucide-react-native';

// Import all the building blocks we just made!
// (Adjust these paths if your screen is in a different folder than your components)
import { RoleSelection } from './components/RoleSelection';
import { InfoForm } from './components/InfoForm';
import { AddressForm } from './components/AddressForm';
import { DocumentsForm } from './components/DocumentsForm';
import { UserRole, FormData, ValidationResult, initialFormData } from './components/SignUpShared';
import { UploadedFile } from './components/UploadBox';

export default function SignUpScreen() {
  // --- STATE ---
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadedFile | null>>({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // We are skipping complex validation for now so you can test the UI
  const validation: ValidationResult = { isValid: true, errors: {}, isSenior: false };

  // --- HANDLERS ---
  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    console.log("Form Submitted!", { selectedRole, formData, uploadedFiles });
    alert("Sign Up Complete! Check console for data.");
  };

  // --- RENDER CURRENT STEP ---
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <RoleSelection 
            onRoleSelect={(role) => {
              setSelectedRole(role);
              handleNext();
            }} 
          />
        );
      case 2:
        return (
          <InfoForm 
            formData={formData} 
            setFormData={setFormData} 
            validation={validation}
            onSubmit={handleNext}
            handlePhoneChange={(text) => setFormData({ ...formData, phone: text })}
          />
        );
      case 3:
        return (
          <AddressForm 
            formData={formData} 
            setFormData={setFormData} 
            validation={validation}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            onSubmit={handleNext}
          />
        );
      case 4:
        return (
          <DocumentsForm 
            selectedRole={selectedRole}
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
            validation={validation}
            agreedToTerms={agreedToTerms}
            setAgreedToTerms={setAgreedToTerms}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          
          {/* Header with Back Button */}
          <View style={styles.header}>
            {currentStep > 1 ? (
              <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <ChevronLeft size={24} color="#041614" />
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ height: 24 }} /> // Spacer to keep layout balanced
            )}
          </View>

          {/* The Actual Form */}
          <View style={styles.formContainer}>
            {renderStep()}
          </View>

          {/* Bottom Navigation Buttons */}
          {currentStep > 1 && (
            <View style={styles.footer}>
              <TouchableOpacity 
                style={styles.primaryButton} 
                onPress={currentStep === 4 ? handleSubmit : handleNext}
              >
                <Text style={styles.primaryButtonText}>
                  {currentStep === 4 ? "Complete Sign Up" : "Continue"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>