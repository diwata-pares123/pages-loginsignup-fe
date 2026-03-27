import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { RegistrationService } from '../../services/RegistrationService';

export default function DriverSignup() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', birthDate: '', password: '',
  });

  const [files, setFiles] = useState<{ [key: string]: any }>({
    driverLicenseFront: null,
    driverLicenseBack: null,
    vehicleFile: null,
    selfieFile: null,
  });

  const pickImage = async (field: string) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images', // Fixed: No longer deprecated
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      const selectedAsset = result.assets[0]; // Fixed: Explicit local variable
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

  const handleFinalSubmit = async () => {
    if (!files.driverLicenseFront || !files.driverLicenseBack || !files.vehicleFile || !files.selfieFile) {
      Alert.alert("Error", "Please upload all required documents.");
      return;
    }

    setLoading(true);
    try {
      await RegistrationService.register('DRIVER', form, files);
      Alert.alert("Success", "Account created!");
      router.replace('/login');
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{ paddingBottom: 40 }}> 
        {step === 1 ? (
          <View>
            <Text style={styles.title}>Step 1: Personal Info</Text>
            <TextInput placeholder="Full Name" style={styles.input} onChangeText={(t) => setForm({...form, fullName: t})} />
            <TextInput placeholder="Email" style={styles.input} onChangeText={(t) => setForm({...form, email: t})} autoCapitalize="none" />
            <TextInput placeholder="Phone" style={styles.input} onChangeText={(t) => setForm({...form, phone: `+63${t}`})} keyboardType="phone-pad" />
            <TextInput placeholder="Birth Date" style={styles.input} onChangeText={(t) => setForm({...form, birthDate: t})} />
            <TextInput placeholder="Password" style={styles.input} onChangeText={(t) => setForm({...form, password: t})} secureTextEntry />
            <TouchableOpacity style={styles.button} onPress={() => setStep(2)}>
              <Text style={styles.buttonText}>NEXT: DOCUMENTS</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Text style={styles.title}>Step 2: Verification</Text>
            <UploadButton title="License Front" file={files.driverLicenseFront} onPress={() => pickImage('driverLicenseFront')} />
            <UploadButton title="License Back" file={files.driverLicenseBack} onPress={() => pickImage('driverLicenseBack')} />
            <UploadButton title="Vehicle Document" file={files.vehicleFile} onPress={() => pickImage('vehicleFile')} />
            <UploadButton title="Selfie" file={files.selfieFile} onPress={() => pickImage('selfieFile')} />

            {loading ? <ActivityIndicator size="large" /> : (
              <TouchableOpacity style={styles.buttonGreen} onPress={handleFinalSubmit}>
                <Text style={styles.buttonText}>SUBMIT APPLICATION</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => setStep(1)} style={{ marginTop: 20 }}>
              <Text style={{ textAlign: 'center', color: '#666' }}>Back to Personal Info</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const UploadButton = ({ title, file, onPress }: any) => (
  <TouchableOpacity onPress={onPress} style={styles.uploadBtn}>
    <Text>{file ? `✅ ${file.name}` : `Upload ${title}`}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: { borderBottomWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15 },
  button: { backgroundColor: '#000', padding: 15, borderRadius: 5, alignItems: 'center' },
  buttonGreen: { backgroundColor: '#28a745', padding: 15, borderRadius: 5, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  uploadBtn: { borderStyle: 'dashed', borderWidth: 1, borderColor: '#999', padding: 20, marginBottom: 10, borderRadius: 5, alignItems: 'center' }
});