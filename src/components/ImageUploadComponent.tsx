import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Upload, Trash2 } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

interface DocumentUploadItem {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly required?: boolean;
}

interface ImageUploadComponentProps {
  readonly documents: readonly DocumentUploadItem[];
  readonly onDocumentsSelected: (docs: { [key: string]: string | null }) => void;
}

export default function ImageUploadComponent({
  documents,
  onDocumentsSelected,
}: ImageUploadComponentProps) {
  const [selectedImages, setSelectedImages] = useState<{ [key: string]: string }>({});

  const handleSelectImage = async (documentId: string) => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'You need to allow access to your photo library to upload documents.');
        return;
      }

      // Open image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'], // Updated per Expo ImagePicker v15+ API
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length) {
        const asset = result.assets[0];
        if (asset?.uri) {
          // Use the 'prev' state to ensure we are passing the most up-to-date
          // object back to the parent component, avoiding stale state issues.
          setSelectedImages((prev) => {
            const updated = {
              ...prev,
              [documentId]: asset.uri,
            };
            onDocumentsSelected(updated);
            return updated;
          });
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image. Please try again.');
      console.error('Image picker error:', error);
    }
  };

  const handleRemoveImage = (documentId: string) => {
    setSelectedImages((prev) => {
      const updated = { ...prev };
      delete updated[documentId];
      onDocumentsSelected(updated);
      return updated;
    });
  };

  return (
    <View style={styles.container}>
      {documents.map((doc) => (
        <View key={doc.id} style={styles.uploadCard}>
          <View style={styles.uploadHeader}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.uploadTitle}>{doc.title}</Text>
              <Text style={styles.uploadDescription}>{doc.description}</Text>
            </View>
            
            {/* Badge now only shows IF the document is required AND hasn't been uploaded yet */}
            {doc.required && !selectedImages[doc.id] && (
              <Text style={styles.requiredBadge}>REQUIRED</Text>
            )}
          </View>

          {selectedImages[doc.id] ? (
            <View style={styles.uploadedCard}>
              <View style={styles.uploadedIconContainer}>
                <Text style={styles.checkmark}>✓</Text>
              </View>
              <Text style={styles.uploadedText}>Document uploaded</Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveImage(doc.id)}
              >
                <Trash2 size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleSelectImage(doc.id)}
              activeOpacity={0.8}
            >
              <Upload size={28} color="#13918F" />
              <Text style={styles.uploadButtonText}>TAP TO SELECT</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  uploadCard: {
    backgroundColor: '#F4FBFA',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5F1EF',
  },
  uploadHeader: {
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#041614',
    marginBottom: 4,
  },
  uploadDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  requiredBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#DC2626',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  uploadButton: {
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#39B5A8',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  uploadButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#13918F',
    marginTop: 12,
    letterSpacing: 0.5,
  },
  uploadedCard: {
    backgroundColor: '#D1FAE5',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  uploadedIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkmark: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  uploadedText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#047857',
    flex: 1,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});