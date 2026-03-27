import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

interface InputFieldProps {
  label: string;
  icon?: React.ReactNode;
  placeholder?: string;
  type?: "text" | "password" | "emailAddress" | "numeric"; 
  value: string;
  onChangeText: (text: string) => void; 
  error?: string;
  showEye?: boolean;
  onEyeClick?: () => void;
  eyeOpen?: boolean;
  isPhone?: boolean;
}

export function InputField({
  label,
  icon,
  placeholder,
  type = "text",
  value,
  onChangeText,
  error,
  showEye,
  onEyeClick,
  eyeOpen,
  isPhone,
}: InputFieldProps) {
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

      <View style={styles.inputWrapper}>
        {isPhone && (
          <View style={styles.phonePrefix}>
            <Text style={styles.phonePrefixText}>+63</Text>
          </View>
        )}

        <View style={styles.inputInnerWrapper}>
          {!isPhone && icon && (
            <View style={styles.iconPosition}>
              {icon}
            </View>
          )}

          <TextInput
            secureTextEntry={type === "password" && !eyeOpen}
            keyboardType={isPhone ? "phone-pad" : "default"}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#D1D5DB"
            style={[
              styles.input,
              error ? styles.inputError : styles.inputNormal,
              isPhone ? styles.inputPhone : styles.inputStandard
            ]}
          />

          {showEye && (
            <TouchableOpacity onPress={onEyeClick} style={styles.eyeButton}>
              {eyeOpen ? <EyeOff size={22} color="#9CA3AF" /> : <Eye size={22} color="#9CA3AF" />}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#39B5A8',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  errorBadge: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  errorText: {
    fontSize: 10,
    color: '#EF4444',
    fontWeight: 'bold',
  },
  inputWrapper: {
    flexDirection: 'row',
  },
  phonePrefix: {
    backgroundColor: '#F0F9F8',
    borderWidth: 2,
    borderRightWidth: 0,
    borderColor: 'rgba(57, 181, 168, 0.1)',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phonePrefixText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A5D56',
  },
  inputInnerWrapper: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
  },
  iconPosition: {
    position: 'absolute',
    left: 20,
    zIndex: 1,
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(240, 249, 248, 0.4)',
    borderWidth: 2,
    paddingVertical: 16,
    fontSize: 15,
    fontWeight: '600',
    color: '#041614',
  },
  inputNormal: {
    borderColor: 'rgba(57, 181, 168, 0.05)',
  },
  inputError: {
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  inputStandard: {
    borderRadius: 20,
    paddingLeft: 56, // Room for the icon
    paddingRight: 16,
  },
  inputPhone: {
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    paddingLeft: 16,
  },
  eyeButton: {
    position: 'absolute',
    right: 20,
    padding: 4,
  }
});