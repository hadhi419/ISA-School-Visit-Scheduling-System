import React from "react";
import { StyleSheet, Text, View } from "react-native";

const AdminDashboard = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome ZDE!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold" },
});

export default AdminDashboard;
