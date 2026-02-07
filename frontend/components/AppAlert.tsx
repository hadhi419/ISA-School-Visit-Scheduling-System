import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type AppAlertProps = {
  visible: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  confirmText?: string;
};

export default function AppAlert({
  visible,
  title = 'Alert',
  message,
  onClose,
  confirmText = 'OK',
}: AppAlertProps) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.alertBox}>
        <Text style={styles.title}>{title}</Text>

        <Text style={styles.message}>{message}</Text>

        <Pressable style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>{confirmText}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  alertBox: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 10,
  },
  message: {
    fontSize: 15,
    color: '#444',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1976D2',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});
