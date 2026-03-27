import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface RoleCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
}

export function RoleCard({ icon, title, desc, onClick }: RoleCardProps) {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onClick} 
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        {icon}
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.desc}>{desc}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: 'rgba(57, 181, 168, 0.1)',
    borderRadius: 28,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2, // For Android shadow
  },
  iconContainer: {
    width: 64,
    height: 64,
    backgroundColor: '#F0F9F8',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#041614',
  },
  desc: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  }
});