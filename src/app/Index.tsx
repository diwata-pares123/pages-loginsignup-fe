import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Package, MapPin } from 'lucide-react-native';

export default function ServiceSelectionScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundCircle} />
      <View style={styles.content}>
        <Text style={styles.title}>Select an active service</Text>
        <Text style={styles.subtitle}>Choose the service you want to continue with.</Text>

        <View style={styles.cardRow}>
          <TouchableOpacity
            style={[styles.card, styles.cardPrimary]}
            onPress={() => router.push('/(auth)/login')}
            activeOpacity={0.9}
          >
            <View style={styles.cardIcon}>
              <Package size={28} color="#13918F" />
            </View>
            <Text style={styles.cardTitle}>PakiSHIP</Text>
            <Text style={styles.cardSubtitle}>Fast delivery</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => router.push('/login')} activeOpacity={0.9}>
            <View style={styles.cardIconSecondary}>
              <MapPin size={28} color="#3B6B85" />
            </View>
            <Text style={styles.cardTitleSecondary}>PakiPARK</Text>
            <Text style={styles.cardSubtitle}>Easy parking</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2026 PAKIAPPS</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9F7F5',
  },
  backgroundCircle: {
    position: 'absolute',
    right: -120,
    top: -100,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#E0F5F1',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#041614',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#50636C',
    textAlign: 'center',
    marginBottom: 32,
  },
  cardRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  cardPrimary: {
    backgroundColor: '#EFFBF8',
  },
  cardIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#DDF5F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  cardIconSecondary: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#E7F0F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#13918F',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardTitleSecondary: {
    fontSize: 16,
    fontWeight: '900',
    color: '#2A4B56',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  footer: {
    paddingBottom: 24,
    alignItems: 'center',
  },
  footerText: {
    color: '#7A8B8F',
    fontSize: 12,
  },
});
