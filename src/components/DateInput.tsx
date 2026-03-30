import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Calendar } from 'lucide-react-native';

interface DateInputProps {
  readonly value: string;
  readonly onChangeText: (text: string) => void;
  readonly placeholder?: string;
  readonly placeholderTextColor?: string;
}

export default function DateInput({
  value,
  onChangeText,
  placeholder = 'dd/mm/yyyy',
  placeholderTextColor = '#9CA3AF',
}: DateInputProps) {
  const handleChange = (text: string) => {
    // Remove any non-digit characters
    const digitsOnly = text.replaceAll(/\D/g, '');

    // Build formatted string
    let formatted = '';
    for (let i = 0; i < digitsOnly.length; i++) {
      if (i === 2 || i === 4) {
        formatted += '/';
      }
      formatted += digitsOnly[i];
    }

    // Maximum length is DD/MM/YYYY = 10 characters
    if (digitsOnly.length <= 8) {
      onChangeText(formatted);
    }
  };

  return (
    <View style={styles.inputContainer}>
      <View style={styles.inputIcon}>
        <Calendar size={20} color="#13918F" />
      </View>
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        keyboardType="number-pad"
        maxLength={10}
        value={value}
        onChangeText={handleChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4FBFA',
    borderRadius: 20,
    height: 56,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E5F1EF',
    marginBottom: 16,
  },
  inputIcon: {
    paddingHorizontal: 8,
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: '#041614',
    fontWeight: '500',
    paddingRight: 8,
  },
});
