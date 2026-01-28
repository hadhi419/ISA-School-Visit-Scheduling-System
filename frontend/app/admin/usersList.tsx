import api from '@/api/axiosInstance';
import { Icon } from '@rneui/themed';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface User {
  id: number;
  full_name: string;
  email: string;
  role: 'ADMIN' | 'STAFF' | 'USER';
  phone: string;
}

const UsersList = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editPhone, seteditPhone] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/auth/allUsers');
      setUsers(res.data.users);
    } catch (err) {
      console.log(err);
      alert('Error fetching users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditName(user.full_name);
    setEditEmail(user.email);
    setEditRole(user.role);
    seteditPhone(user.phone);
    setShowModal(true);
  };

  const saveEdit = async () => {
    if (!selectedUser || !editName || !editEmail || !editRole) {
      alert('All fields must be filled');
      return;
    }

    try {
      const payload = {
        userId: selectedUser.id,
        name: editName,
        email: editEmail,
        role: editRole,
        phone: editPhone,
      };
      await api.post('/auth/editUser', payload);
      alert('User updated successfully!');
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      console.log(err);
      alert('Error updating user.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Icon
          name="arrow-back"
          type="material"
          color="#fff"
          size={28}
          onPress={() => router.back()}
        />
        <Text style={styles.headerTitle}>All Users</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 16 }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchUsers} />
        }
      >
        {users.map((user) => (
          <View key={user.id} style={styles.card}>
            {/* Left: user icon */}
            <View style={styles.iconArea}>
              <Icon
                name="account"
                type="material-community"
                color="#1976D2"
                size={28}
              />
            </View>

            {/* Middle: user info */}
            <View style={styles.infoArea}>
              <Text style={styles.name}>{user.full_name}</Text>
              <Text style={styles.email}>{user.email}</Text>
              <Text style={styles.role}>{user.role}</Text>
            </View>

            {/* Right: edit button */}
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEditClick(user)}
            >
              <Icon
                name="pencil"
                type="material-community"
                color="#fff"
                size={24}
              />
            </TouchableOpacity>
          </View>
        ))}

        {users.length === 0 && !loading && (
          <Text style={styles.emptyText}>No users found.</Text>
        )}
      </ScrollView>

      {/* Edit Modal */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={modalStyles.overlay}>
          <View style={modalStyles.popup}>
            <Text style={modalStyles.title}>Edit User</Text>

            <Text style={modalStyles.label}>Name</Text>
            <TextInput
              style={modalStyles.input}
              value={editName}
              onChangeText={setEditName}
            />

            <Text style={modalStyles.label}>Email</Text>
            <TextInput
              style={modalStyles.input}
              value={editEmail}
              onChangeText={setEditEmail}
            />

            <Text style={modalStyles.label}>Role</Text>
            <TextInput
              style={modalStyles.input}
              value={editRole}
              onChangeText={setEditRole}
            />

            <Text style={modalStyles.label}>Phone</Text>
            <TextInput
              style={modalStyles.input}
              value={editPhone}
              onChangeText={seteditPhone}
            />

            <View style={modalStyles.actions}>
              <View style={{ width: '45%' }}>
                <Pressable
                  onPress={saveEdit}
                  style={[modalStyles.modalBtn, modalStyles.sendBtn]}
                >
                  <Text style={modalStyles.modalBtnText}>Save</Text>
                </Pressable>
              </View>
              <View style={{ width: '45%' }}>
                <Pressable
                  onPress={() => setShowModal(false)}
                  style={[modalStyles.modalBtn, modalStyles.cancelBtn]}
                >
                  <Text style={modalStyles.modalBtnText}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8f9fb' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1976D2',
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginVertical: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  iconArea: {
    width: '10%',
    alignItems: 'center',
  },
  infoArea: {
    width: '75%',
    paddingLeft: 12,
  },
  editButton: {
    width: '15%',
    backgroundColor: '#1976D2',
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  name: { fontSize: 16, fontWeight: '700', color: '#333' },
  email: { fontSize: 14, color: '#555', marginTop: 4 },
  role: { fontSize: 13, color: '#1976D2', marginTop: 2 },
  emptyText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 50,
  },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1976D2',
    marginBottom: 15,
    textAlign: 'center',
  },
  label: { fontSize: 14, fontWeight: '600', color: '#555', marginTop: 12 },
  input: {
    backgroundColor: '#f2f2f2',
    color: '#333',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 6,
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  modalBtn: {
    height: 48,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },

  sendBtn: { backgroundColor: '#38c172' },
  cancelBtn: { backgroundColor: '#9e9e9e' },
  modalBtnText: { color: '#fff', fontWeight: '700', textAlign: 'center' },
});

export default UsersList;
