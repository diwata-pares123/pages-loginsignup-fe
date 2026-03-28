// path: components/InputField.tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

interface InputFieldProps extends TextInputProps {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  showEye?: boolean;
  eyeOpen?: boolean;
  onEyeClick?: () => void;
  isPhone?: boolean;
}

export function InputField({
  label,
  icon,
  error,
  showEye,
  eyeOpen,
  onEyeClick,
  isPhone,
  ...props
}: Readonly<InputFieldProps>) {    // <--- Notice the Readonly<> wrapper here
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {error ? (
          <View style={styles.errorBadge}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}
      </View>

      <View style={[styles.inputWrapper, error && styles.inputWrapperError]}>
        {isPhone && (
          <View style={styles.phonePrefix}>
            <Text style={styles.phonePrefixText}>+63</Text>
          </View>
        )}

        <View style={styles.inputFlex}>
          {!isPhone && icon && <View style={styles.iconContainer}>{icon}</View>}
          
         <TextInput
            style={[styles.input, (!isPhone && icon) ? { paddingLeft: 45 } : undefined]}
            placeholderTextColor="#D1D5DB"
            {...props}
          />

          {showEye && (
            <TouchableOpacity onPress={onEyeClick} style={styles.eyeButton}>
              {eyeOpen ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#9CA3AF" />}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  labelContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, paddingHorizontal: 4 },
  label: { fontSize: 11, fontWeight: 'bold', color: '#39B5A8', textTransform: 'uppercase', letterSpacing: 1 },
  errorBadge: { backgroundColor: '#FEF2F2', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  errorText: { fontSize: 10, color: '#EF4444', fontWeight: 'bold' },
  inputWrapper: { flexDirection: 'row', backgroundColor: '#F0F9F8', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(57, 181, 168, 0.1)' },
  inputWrapperError: { borderColor: 'rgba(239, 68, 68, 0.3)' },
  phonePrefix: { backgroundColor: '#F0F9F8', borderRightWidth: 1, borderRightColor: 'rgba(57, 181, 168, 0.1)', paddingHorizontal: 16, justifyContent: 'center', borderTopLeftRadius: 20, borderBottomLeftRadius: 20 },
  phonePrefixText: { fontSize: 16, fontWeight: 'bold', color: '#1A5D56' },
  inputFlex: { flex: 1, position: 'relative', justifyContent: 'center' },
  iconContainer: { position: 'absolute', left: 16, zIndex: 1 },
  input: { height: 60, fontSize: 15, fontWeight: '600', color: '#041614', paddingHorizontal: 16 },
  eyeButton: { position: 'absolute', right: 16, padding: 4 },
});