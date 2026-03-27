import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { AlertCircle, HeartPulse, Smartphone, ShieldCheck, Info } from "lucide-react-native";
import { ReminderItem } from "./ReminderItem";

export function DriverReminder() {
  return (
    <View style={styles.container}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.headerIconWrapper}>
          <AlertCircle size={28} color="#39B5A8" />
        </View>

        <View style={styles.headerTextWrapper}>
          <Text style={styles.headerTitle}>Paalala para sa Rider</Text>
          <Text style={styles.headerSubtitle}>Basahin maigi bago magpatuloy.</Text>
        </View>
      </View>

      {/* Items Area */}
      <View style={styles.itemsArea}>
        <ReminderItem
          icon={<HeartPulse size={18} color="#f43f5e" />} // rose-500
          title="Para sa Edad 51-65"
          text='Siguraduhing may Medical Certificate na "Fit to Drive Motorcycle" bago magpatuloy.'
        />

        <ReminderItem
          icon={<Smartphone size={18} color="#3b82f6" />} // blue-500
          title="Phone Requirements"
          text="Gumamit ng Android (V10 pataas) o Huawei device. Hindi pa suportado ang iOS sa kasalukuyan."
        />

        <ReminderItem
          icon={<ShieldCheck size={18} color="#39B5A8" />} // primary
          title="Dokumentong Kailangan"
          text="Ihanda ang iyong Driver's License at Vehicle OR/CR. Siguraduhing ito ay orihinal at malinaw."
        />

        <ReminderItem
          icon={<Info size={18} color="#f59e0b" />} // amber-500
          title="Professionalism"
          text="Inaasahan ang maayos na pakikitungo sa mga customer at pagsunod sa batas trapiko."
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerCard: {
    backgroundColor: "rgba(57, 181, 168, 0.1)", // #39B5A8 at 10%
    padding: 16,
    borderRadius: 24, // 1.5rem
    borderWidth: 1,
    borderColor: "rgba(57, 181, 168, 0.1)",
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  headerIconWrapper: {
    width: 48,
    height: 48,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTextWrapper: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#041614",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#6B7280", // gray-500
    marginTop: 2,
  },
  itemsArea: {
    gap: 8,
  },
});