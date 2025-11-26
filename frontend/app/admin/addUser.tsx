import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView } from "react-native";
import { Button } from "@rneui/themed";

const AddUser = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState("ISA");

    const createUser = async () => {
        try {
            const response = await fetch("http://YOUR_SERVER_IP/create_user.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    full_name: fullName,
                    email: email,
                    password: password,
                    phone: phone,
                    role: role,
                }),
            });

            const data = await response.json();
            console.log(data);
            alert("User Created Successfully!");

        } catch (error) {
            console.log(error);
            alert("Error creating user.");
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Add New User</Text>

            <Text style={styles.label}>Full Name</Text>
            <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />

            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} />

            <Text style={styles.label}>Password</Text>
            <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <Text style={styles.label}>Phone</Text>
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} />

            <Text style={styles.label}>Role</Text>
            <TextInput
                style={styles.input}
                value={role}
                onChangeText={setRole}
                placeholder="ISA, ADE, DDE, ZDE, ADMIN"
            />

            <Button
                title="Create User"
                onPress={createUser}
                buttonStyle={styles.button}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#121212",
    },
    title: {
        color: "#fff",
        fontSize: 26,
        fontWeight: "700",
        marginBottom: 20,
    },
    label: {
        color: "#aaa",
        fontSize: 16,
        marginTop: 15,
    },
    input: {
        backgroundColor: "#1E1E1E",
        color: "#fff",
        padding: 12,
        borderRadius: 10,
        marginTop: 5,
    },
    button: {
        backgroundColor: "#4C72B0",
        marginTop: 25,
        paddingVertical: 15,
        borderRadius: 12,
    },
});

export default AddUser;
