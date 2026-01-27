import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  onLogout: () => void;
};

export default function UserProfile({ onLogout }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Username</Text>
        

        <View style={styles.divider} />

        <Text style={styles.label}>Email</Text>
        
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
    elevation: 3,
  },
  label: {
    color: "#888",
    fontSize: 14,
  },
  value: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
  },
  logoutBtn: {
    backgroundColor: "#e53935",
    padding: 15,
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});
