import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { User, Truck, MapPin } from 'lucide-react-native';
import { RoleCard } from './RoleCard';
import { UserRole } from './SignUpShared';

interface RoleSelectionProps {
  onRoleSelect: (role: UserRole) => void;
}

export function RoleSelection({ onRoleSelect }: RoleSelectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepText}>Create Account</Text>
        <Text style={styles.title}>Join the PakiSHIP community.</Text>
      </View>

      <View style={styles.cardContainer}>
        <RoleCard
          icon={<User size={28} color="#39B5A8" />}
          title="Parcel Sender"
          desc="I need to send and track parcels quickly."
          onClick={() => onRoleSelect("customer")}
        />

        <RoleCard
          icon={<Truck size={28} color="#39B5A8" />}
          title="Driver"
          desc="I want to deliver and earn money."
          onClick={() => onRoleSelect("driver")}
        />

        <RoleCard
          icon={<MapPin size={28} color="#39B5A8" />}
          title="Operator"
          desc="I want to manage a drop-off point."
          onClick={() => onRoleSelect("operator")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  stepText: {
    color: '#39B5A8',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontSize: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#041614',
    textAlign: 'center',
    marginTop: 8,
  },
  cardContainer: {
    gap: 16,
  }
});