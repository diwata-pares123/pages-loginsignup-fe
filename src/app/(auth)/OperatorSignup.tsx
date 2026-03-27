import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { RegistrationService } from '../../services/RegistrationService';

export default function OperatorSignup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', birthDate: '', password: '' });
  
  const [files, setFiles] = useState<{ [key: string]: any }>({
    dtiFile: null, permitFile: null, proofFile: null,
  });

  const pickImage = async (field: string) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      const selectedAsset = result.assets[0];
      setFiles((prev) => ({
        ...prev,
        [field]: {
          uri: selectedAsset.uri,
          name: selectedAsset.fileName || `${field}.jpg`,
          mimeType: selectedAsset.mimeType || 'image/jpeg',
        },
      }));
    }
  };

  const handleSubmit = async () => {
    if (!files.dtiFile || !files.permitFile || !files.proofFile) {
      Alert.alert("Required", "Please upload all business documents.");
      return;
    }

    setLoading(true);
    try {
      await RegistrationService.register('OPERATOR', form, files);
      Alert.alert("Success", "Application sent!");
      router.replace('/login');
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{ paddingBottom: 40 }}>
        <Text style={styles.title}>Operator Registration</Text>
        <TextInput placeholder="Full Name" style={styles.input} onChangeText={(t) => setForm({...form, fullName: t})} />
        <TextInput placeholder="Email" style={styles.input} onChangeText={(t) => setForm({...form, email: t})} autoCapitalize="none" />
        <TextInput placeholder="Phone" style={styles.input} onChangeText={(t) => setForm({...form, phone: `+63${t}`})} keyboardType="phone-pad" />
        <TextInput placeholder="Birth Date" style={styles.input} onChangeText={(t) => setForm({...form, birthDate: t})} />
        <TextInput placeholder="Password" style={styles.input} onChangeText={(t) => setForm({...form, password: t})} secureTextEntry />
        
        <Text style={styles.label}>Business Documents</Text>
        <TouchableOpacity style={styles.uploadBtn} onPress={() => pickImage('dtiFile')}>
          <Text>{files.dtiFile ? `✅ DTI Uploaded` : "Upload DTI Registration"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.uploadBtn} onPress={() => pickImage('permitFile')}>
          <Text>{files.permitFile ? `✅ Permit Uploaded` : "Upload Mayor's Permit"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.uploadBtn} onPress={() => pickImage('proofFile')}>
          <Text>{files.proofFile ? `✅ Proof Uploaded` : "Upload Proof of Address"}</Text>
        </TouchableOpacity>

        {loading ? <ActivityIndicator size="large" color="#007AFF" /> : (
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.btnText}>SUBMIT APPLICATION</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderBottomWidth: 1, padding: 10, marginBottom: 15, borderColor: '#ccc' },
  label: { fontWeight: 'bold', marginTop: 15, marginBottom: 10 },
  uploadBtn: { padding: 15, borderWidth: 1, borderStyle: 'dashed', borderRadius: 5, marginBottom: 10, borderColor: '#999', alignItems: 'center' },
  submitBtn: { backgroundColor: '#007AFF', padding: 15, borderRadius: 5, marginTop: 20 },
  btnText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' }
});