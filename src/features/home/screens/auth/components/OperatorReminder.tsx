import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Building2, Store, FileText, MapPin } from "lucide-react-native";
import { ReminderItem } from "./ReminderItem";

export function OperatorReminder() {
  return (
    <View style={styles.container}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.headerIconWrapper}>
          <Building2 size={28} color="#4f46e5" /> {/* indigo-600 */}
        </View>
        <View style={styles.headerTextWrapper}>
          <Text style={styles.headerTitle}>
            Paalala para sa mga{"\n"}Partner Business
          </Text>
          <Text style={styles.headerSubtitle}>Basahin maigi bago magpatuloy.</Text>
        </View>
      </View>

      {/* Items Area */}
      <View style={styles.itemsArea}>
        <ReminderItem
          icon={<Store size={20} color="#10b981" />} // emerald-500
          title="Physical Location"
          text="Dapat ay mayroong physical space o establishment para sa parcel drop-off at pickup."
        />
        <ReminderItem
          icon={<FileText size={20} color="#0ea5e9" />} // sky-500
          title="Business Compliance"
          text="Siguraduhing updated ang DTI/SEC at Mayor's Permit ng inyong lokasyon."
        />
        <ReminderItem
          icon={<MapPin size={20} color="#f97316" />} // orange-500
          title="Accessible Area"
          text="Ang lokasyon ay dapat madaling mapuntahan ng mga riders at customers."
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
    backgroundColor: "rgba(99, 102, 241, 0.05)", // Light indigo tint
    padding: 20,
    borderRadius: 24, // 1.5rem
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.15)", // indigo-100
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
    gap: 8, // space-y-2
  },
});