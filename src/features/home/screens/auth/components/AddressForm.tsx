import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Lock, Map, Building2, MapPin } from 'lucide-react-native';
import { InputField } from './InputField';
import { FormData, ValidationResult } from './SignUpShared';

interface AddressFormProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  validation: ValidationResult;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  onSubmit: () => void;
}

export function AddressForm({
  formData,
  setFormData,
  validation,
  showPassword,
  setShowPassword,
  onSubmit,
}: AddressFormProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepText}>Step 2</Text>
        <Text style={styles.title}>Address & Security</Text>
      </View>

      <InputField
        label="Street Address"
        icon={<Map size={22} color="#39B5A8" />}
        placeholder="123 Mabini St. Brgy. 4"
        value={formData.address}
        onChangeText={(text) => setFormData({ ...formData, address: text })}
      />

      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <InputField
            label="City"
            icon={<Building2 size={22} color="#39B5A8" />}
            placeholder="Quezon City"
            value={formData.city}
            onChangeText={(text) => setFormData({ ...formData, city: text })}
          />
        </View>
        <View style={styles.halfWidth}>
          <InputField
            label="Province"
            icon={<MapPin size={22} color="#39B5A8" />}
            placeholder="Metro Manila"
            value={formData.province}
            onChangeText={(text) => setFormData({ ...formData, province: text })}
          />
        </View>
      </View>

      <View style={styles.divider} />

      <InputField
        label="Set Password"
        type="password"
        icon={<Lock size={22} color="#39B5A8" />}
        placeholder="8+ chars, number, symbol"
        value={formData.password}
        error={validation.errors.password}
        showEye
        onEyeClick={() => setShowPassword(!showPassword)}
        eyeOpen={showPassword}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
      />

      <InputField
        label="Confirm Password"
        type="password"
        icon={<Lock size={22} color="#39B5A8" />}
        placeholder="Repeat password"
        value={formData.confirmPassword}
        error={validation.errors.confirmPassword}
        showEye
        onEyeClick={() => setShowPassword(!showPassword)}
        eyeOpen={showPassword}
        onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
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
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(57, 181, 168, 0.1)',
    width: '100%',
    marginVertical: 24,
  }
});