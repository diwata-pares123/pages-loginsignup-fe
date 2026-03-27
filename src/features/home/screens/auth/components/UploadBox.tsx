import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Upload, CheckCircle2 } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';

// Mobile phones don't use the web 'File' object, so we create our own
export interface UploadedFile {
  uri: string;
  name: string;
  size?: number;
  mimeType?: string;
}

interface UploadBoxProps {
  label: string;
  icon?: React.ReactNode;
  value: UploadedFile | null;
  onChange: (file: UploadedFile | null) => void;
}

export function UploadBox({ label, icon, value, onChange }: UploadBoxProps) {
  
  const handlePress = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', 
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        
        // ADD THIS SAFETY CHECK: If asset is somehow undefined, stop here.
        if (!asset) return;

        onChange({
          uri: asset.uri,
          name: asset.name,
          size: asset.size,
          mimeType: asset.mimeType,
        });
      }
    } catch (err) {
      console.log('Error picking document:', err);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7} style={styles.wrapper}>
      <View style={[styles.container, value ? styles.containerActive : styles.containerInactive]}>
        
        <View style={styles.leftSection}>
          <View style={styles.iconWrapper}>
            {value ? (
              <CheckCircle2 size={28} color="#10B981" />
            ) : (
              icon || <Upload size={28} color="#0EA5E9" />
            )}
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.nameText} numberOfLines={1}>
              {value ? value.name : label}
            </Text>
            <Text style={styles.subText}>TAP TO SELECT</Text>
          </View>
        </View>

        {/* Safety check ensures TypeScript knows size is a valid number before dividing */}
        {value && value.size !== undefined && (
          <View style={styles.sizeBadge}>
            <Text style={styles.sizeText}>
              {(value.size / 1024).toFixed(0)} KB
            </Text>
          </View>
        )}

      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginBottom: 16,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 24,
  },
  containerActive: {
    borderColor: '#39B5A8',
    backgroundColor: '#F0F9F8',
  },
  containerInactive: {
    borderColor: 'rgba(57, 181, 168, 0.2)',
    backgroundColor: '#FFFFFF',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(57, 181, 168, 0.1)',
    marginRight: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  textContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#041614',
    marginBottom: 4,
  },
  subText: {
    fontSize: 10,
    color: '#39B5A8',
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  sizeBadge: {
    backgroundColor: '#39B5A8',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  sizeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  }
});