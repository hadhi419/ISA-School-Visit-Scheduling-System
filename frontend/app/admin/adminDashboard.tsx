import { Button, Icon } from "@rneui/themed";
import { router } from "expo-router";
import React, { FC } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.9; // slightly wider for nicer look

const AdminDashboard: FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Icon name="menu" type="material" color="#fff" size={28} />
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Icon name="person" type="material" color="#fff" size={28} />
        </View>

        {/* Section: Management */}
        <Text style={styles.sectionTitle}>Management</Text>

        <View style={styles.cardContainer}>
          {/* Manage Users */}
          <View style={styles.card}>
            <Icon name="people" type="material" color="#42A5F5" size={40} />
            <Text style={styles.cardTitle}>Manage Users</Text>
            <Text style={styles.cardDescription}>
              Add, edit, or remove registered users in the system.
            </Text>
            <View style={styles.cardActions}>
              <Button
                title="Add User"
                onPress={() => router.push("/admin/addUser")}
                buttonStyle={[styles.actionButton, { backgroundColor: "#42A5F5" }]}
                containerStyle={styles.buttonContainer}
              />
              <Button
                title="View Users"
                onPress={() => router.push("/admin/usersList")}
                buttonStyle={[styles.actionButton, { backgroundColor: "#1E88E5" }]}
                containerStyle={styles.buttonContainer}
              />
            </View>
          </View>

          {/* Manage Locations */}
          <View style={styles.card}>
            <Icon name="place" type="material" color="#66BB6A" size={40} />
            <Text style={styles.cardTitle}>Manage Locations</Text>
            <Text style={styles.cardDescription}>
              Add or update available school and visit locations.
            </Text>
            <View style={styles.cardActions}>
              <Button
                title="Add Location"
                onPress={() => router.push("/admin/addLocation")}
                buttonStyle={[styles.actionButton, { backgroundColor: "#66BB6A" }]}
                containerStyle={styles.buttonContainer}
              />
              <Button
                title="View Locations"
                onPress={() => router.push("/admin/locationsList")}
                buttonStyle={[styles.actionButton, { backgroundColor: "#43A047" }]}
                containerStyle={styles.buttonContainer}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  scrollContent: { paddingBottom: 30 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1976D2",
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  headerTitle: { fontSize: 18, fontWeight: "500", color: "#fff", flex: 1, textAlign: "center" },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#333",
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 16,
  },

  cardContainer: { paddingHorizontal: 16, gap: 20 },

  card: {
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 20,
  },

  cardTitle: { fontSize: 18, fontWeight: "600", color: "#333", marginTop: 12 },
  cardDescription: { fontSize: 14, color: "#666", marginVertical: 12 },

  cardActions: { flexDirection: "row", justifyContent: "space-between" },
  actionButton: { borderRadius: 12, paddingVertical: 12, height:70 },
  buttonContainer: { flex: 1, marginHorizontal: 5 },

  footer: { color: "#777", textAlign: "center", marginTop: 30, fontSize: 13 },
});

export default AdminDashboard;
