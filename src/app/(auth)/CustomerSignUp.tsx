import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { RegistrationService } from '../../services/RegistrationService';

export default function CustomerSignup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', birthDate: '', password: '' });

  const handleSignup = async () => {
    setLoading(true);
    try {
      // Pass 'CUSTOMER' and empty {} for files
      await RegistrationService.register('CUSTOMER', form, {});
      Alert.alert("Success", "Account created! Please verify your email.");
      router.replace('/login');
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput placeholder="Full Name" style={styles.input} onChangeText={(t) => setForm({...form, fullName: t})} />
      <TextInput placeholder="Email" style={styles.input} onChangeText={(t) => setForm({...form, email: t})} />
      <TextInput placeholder="Phone" style={styles.input} onChangeText={(t) => setForm({...form, phone: `+63${t}`})} />
      <TextInput placeholder="Password" secureTextEntry style={styles.input} onChangeText={(t) => setForm({...form, password: t})} />
      
      {loading ? <ActivityIndicator size="large" /> : (
        <TouchableOpacity style={styles.submitBtn} onPress={handleSignup}>
          <Text style={styles.btnText}>REGISTER NOW</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30 },
  input: { borderBottomWidth: 1, padding: 12, marginBottom: 20, fontSize: 16 },
  submitBtn: { backgroundColor: '#000', padding: 18, borderRadius: 10, marginTop: 10 },
  btnText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 }
});