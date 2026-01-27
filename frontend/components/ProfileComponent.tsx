import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type ProfileScreenProp = StackNavigationProp<RootStackParamList, "Profile">;

type Props = {
  navigation: ProfileScreenProp;
};

export default function ProfileComponent({ navigation }: Props) {
  const [user] = useState({
    username: "isa.sarah",
    email: "isa.sarah@gmail.com",
    avatar: "https://i.pravatar.cc/150?img=3", // sample avatar
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>

      <View style={styles.card}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={styles.label}>Username:</Text>
        <Text style={styles.value}>{user.username}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user.email}</Text>
      </View>

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => navigation.replace("Dashboard")}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#f2f2f2" },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
  label: { fontSize: 14, color: "#555", marginTop: 10 },
  value: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  logoutBtn: { backgroundColor: "#e74c3c", padding: 12, borderRadius: 8, alignItems: "center" },
  logoutText: { color: "#fff", fontWeight: "bold" },
});
