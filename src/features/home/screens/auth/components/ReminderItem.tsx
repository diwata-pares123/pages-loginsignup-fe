import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface ReminderItemProps {
  icon: React.ReactNode;
  title: string;
  text: string;
}

export function ReminderItem({ icon, title, text }: ReminderItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>{icon}</View>
      <View style={styles.textWrapper}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 24,
    marginTop: 8,
    backgroundColor: "rgba(240, 249, 248, 0.7)", // #F0F9F8 with opacity
    borderWidth: 2,
    borderColor: "rgba(57, 181, 168, 0.05)", // #39B5A8 at 5% opacity
    borderRadius: 20, // 1.25rem
    gap: 16,
  },
  iconWrapper: {
    marginTop: 2,
  },
  textWrapper: {
    flex: 1,
  },
  title: {
    fontFamily: "System",
    fontWeight: "bold",
    fontSize: 13,
    color: "#041614",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  text: {
    fontSize: 12,
    color: "#6B7280", // gray-500
    fontWeight: "500",
    lineHeight: 18,
  },
});