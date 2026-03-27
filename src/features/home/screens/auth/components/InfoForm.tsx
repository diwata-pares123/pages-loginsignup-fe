import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { User, Mail, Smartphone, Calendar } from 'lucide-react-native';
import { InputField } from './InputField';
import { FormData, ValidationResult } from './SignUpShared';

interface InfoFormProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  validation: ValidationResult;
  onSubmit: () => void;
  handlePhoneChange: (text: string) => void;
}

export function InfoForm({
  formData,
  setFormData,
  validation,
  onSubmit, // We will use this later when we build the "Next" button in the main screen
  handlePhoneChange,
}: InfoFormProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepText}>Step 1</Text>
        <Text style={styles.title}>Tell us about yourself</Text>
      </View>

      <InputField
        label="Full Name"
        icon={<User size={22} color="#39B5A8" />}
        placeholder="Juan Dela Cruz"
        value={formData.fullName}
        onChangeText={(text) => setFormData({ ...formData, fullName: text })}
      />

      {/* Note: React Native needs a specific DatePicker component for dates. 
          For now, we will leave this as a text input until we add a DatePicker library */}
      <InputField
        label="Date of Birth (YYYY-MM-DD)"
        icon={<Calendar size={22} color="#39B5A8" />}
        value={formData.dob}
        error={validation.errors.dob}
        onChangeText={(text) => setFormData({ ...formData, dob: text })}
      />

      <InputField
        label="Mobile Number"
        icon={<Smartphone size={22} color="#39B5A8" />}
        placeholder="912 345 6789"
        value={formData.phone}
        error={validation.errors.phone}
        onChangeText={handlePhoneChange}
        isPhone
      />

      <InputField
        label="Email Address"
        type="emailAddress"
        icon={<Mail size={22} color="#39B5A8" />}
        placeholder="juandelacruz@email.com"
        value={formData.email}
        error={validation.errors.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  header: {
    marginBottom: 24,
  },
  stepText: {
    color: '#39B5A8',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontSize: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#041614',
    marginTop: 4,
  }
});