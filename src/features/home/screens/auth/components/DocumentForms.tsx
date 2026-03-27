import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HeartPulse, MapPin, Camera } from 'lucide-react-native';
import Checkbox from 'expo-checkbox';
import { UploadBox, UploadedFile } from './UploadBox';
import { UserRole, ValidationResult } from './SignUpShared';

interface DocumentsFormProps {
  readonly selectedRole: UserRole;
  readonly uploadedFiles: Record<string, UploadedFile | null>;
  readonly setUploadedFiles: (files: Record<string, UploadedFile | null>) => void;
  readonly validation: ValidationResult;
  readonly agreedToTerms: boolean;
  readonly setAgreedToTerms: (agreed: boolean) => void;
}

export function DocumentsForm({
  selectedRole,
  uploadedFiles,
  setUploadedFiles,
  validation,
  agreedToTerms,
  setAgreedToTerms,
}: DocumentsFormProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepText}>Final Step</Text>
        <Text style={styles.title}>Verify your identity</Text>
        <Text style={styles.subtitle}>Please upload clear photos of your documents.</Text>
      </View>

      <View style={styles.formContainer}>
        {selectedRole === "driver" ? (
          <>
            <UploadBox
              label="Driver's License"
              value={uploadedFiles["DL"] || null}
              onChange={(f) => setUploadedFiles({ ...uploadedFiles, DL: f })}
            />
            <UploadBox
              label="Vehicle OR/CR"
              value={uploadedFiles["ORCR"] || null}
              onChange={(f) => setUploadedFiles({ ...uploadedFiles, ORCR: f })}
            />
            {validation.isSenior && (
              <UploadBox
                label="Medical Certificate"
                icon={<HeartPulse size={22} color="#F43F5E" />}
                value={uploadedFiles["Medical"] || null}
                onChange={(f) => setUploadedFiles({ ...uploadedFiles, Medical: f })}
              />
            )}
          </>
        ) : (
          <>
            <UploadBox
              label="DTI / SEC Certificate"
              value={uploadedFiles["DTI"] || null}
              onChange={(f) => setUploadedFiles({ ...uploadedFiles, DTI: f })}
            />
            <UploadBox
              label="Business Permit"
              value={uploadedFiles["Permit"] || null}
              onChange={(f) => setUploadedFiles({ ...uploadedFiles, Permit: f })}
            />
            <UploadBox
              label="Proof of Location"
              icon={<MapPin size={22} color="#39B5A8" />}
              value={uploadedFiles["Loc"] || null}
              onChange={(f) => setUploadedFiles({ ...uploadedFiles, Loc: f })}
            />
          </>
        )}

        <View style={styles.divider} />

        <UploadBox
          label="Selfie with ID"
          icon={<Camera size={22} color="#39B5A8" />}
          value={uploadedFiles["Selfie"] || null}
          onChange={(f) => setUploadedFiles({ ...uploadedFiles, Selfie: f })}
        />
      </View>

      <View style={styles.termsContainer}>
        <Checkbox
          style={styles.checkbox}
          value={agreedToTerms}
          onValueChange={setAgreedToTerms}
          color={agreedToTerms ? '#39B5A8' : undefined}
        />
        <Text style={styles.termsText}>
          I accept the <Text style={styles.link}>Terms & Conditions</Text> and{' '}
          <Text style={styles.link}>Privacy Policy</Text>. I confirm all uploaded documents are authentic.
        </Text>
      </View>
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
  subtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  formContainer: {
    marginBottom: 16,
  },
  divider: {
    height: 8,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0F9F8',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(57, 181, 168, 0.1)',
    marginTop: 16,
  },
  checkbox: {
    marginRight: 12,
    marginTop: 2,
    width: 24,
    height: 24,
    borderRadius: 8,
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 20,
    fontWeight: '500',
  },
  link: {
    color: '#39B5A8',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  }
});