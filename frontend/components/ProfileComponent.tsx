import { useAuth } from '@/AuthContext';
import api from '@/api/axiosInstance'; // make sure this is your axios instance
import React, { useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Props = {
  onClose: () => void;
};

export default function ProfileComponent({ onClose }: Props) {
  const { logout, name, email, id } = useAuth();

  // Change password states
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [appAlert, setAppAlert] = useState<{
    visible: boolean;
    title: string;
    message: string;
  }>({
    visible: false,
    title: '',
    message: '',
  });

  const handleChangePassword = () => setModalVisible(true);

  const submitPasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      if (newPassword !== confirmPassword) {
        setAppAlert({
          visible: true,
          title: 'Error',
          message: 'Passwords do not match!',
        });
        return;
      }

      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/auth/change-password', {
        id,
        currentPassword,
        newPassword,
      });

      setAppAlert({
        visible: true,
        title:
          response.data.result === 'Password has been changed successfully'
            ? 'Success'
            : 'Info',
        message: response.data.result,
      });
      //console.log(response.data);
      if (response.data.result === 'Password has been changed successfully') {
        setModalVisible(false);
      }
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      //console.error(err);
      setAppAlert({
        visible: true,
        title: 'Error',
        message: 'Failed to change password.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      {/* Avatar & User Info */}
      <View style={styles.infoContainer}>
        <Image source={require('@/assets/avatar.png')} style={styles.avatar} />
        <Text style={styles.label}>Username</Text>
        <Text style={styles.value}>{name}</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{email}</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <Pressable style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>

        <Pressable style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeText}>Close</Text>
        </Pressable>
      </View>

      <Pressable
        onPress={() => setModalVisible(true)}
        style={{ justifyContent: 'center', marginLeft: '2%', marginTop: '5%' }}
      >
        <Text style={{ textDecorationLine: 'underline', color: '#1b5cd4' }}>
          Change Password?
        </Text>
      </Pressable>

      {/* Change Password Modal */}
      {modalVisible && (
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Change Password</Text>

            <TextInput
              style={styles.input}
              placeholder="Current Password"
              placeholderTextColor="gray"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              placeholderTextColor="gray"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm New Password"
              placeholderTextColor="gray"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <View style={[{ marginTop: '50%' }, styles.buttonContainer]}>
              <Pressable
                style={[styles.submitBtn, { width: '48%', marginTop: '20%' }]}
                onPress={submitPasswordChange}
                disabled={loading}
              >
                <Text style={styles.logoutText}>
                  {loading ? 'Saving...' : 'Submit'}
                </Text>
              </Pressable>

              <Pressable
                style={[styles.closeBtn, { width: '48%', marginTop: '20%' }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 10,
  },
  modalContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    backgroundColor: '#f2f2f2',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 10,
    fontSize: 14,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 25,
  },
  infoContainer: {
    width: '100%',
    marginBottom: 30,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 5,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '-5%',
  },
  logoutBtn: {
    flex: 1,
    backgroundColor: '#d23519',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  submitBtn: {
    flex: 1,
    backgroundColor: '#309740',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  closeBtn: {
    flex: 1,
    backgroundColor: '#aaabad',
    borderWidth: 2,
    borderColor: '#aaabad',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  closeText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  changePwdBtn: {
    flex: 1,
    backgroundColor: '#ffa500',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  changePwdText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
