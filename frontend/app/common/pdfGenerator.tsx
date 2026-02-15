import api from '@/api/axiosInstance';
import { useAuth } from '@/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

import axios from 'axios';
import { router } from 'expo-router';
import React, { FC, useEffect, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppAlert from '@/components/AppAlert';

interface ISA {
  id: number;
  full_name: string;
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const YEARS = ['2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030'];

import { ActivityIndicator } from 'react-native';
import { useLoading } from '../../LoadingContext';

const CURRENT_YEAR = new Date().getFullYear();

const GenerateISAPdf: FC = () => {
  const [isas, setIsas] = useState<ISA[]>([]);
  const [selectedIsa, setSelectedIsa] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(CURRENT_YEAR);

  const [loading, setLoading] = useState(false);

  const [showIsaPicker, setShowIsaPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const { isLoggedIn, email } = useAuth();
  const { setLoading: setGlobalLoading } = useLoading();

  const [alert, setAlert] = useState({
    visible: false,
    title: 'Alert',
    message: '',
  });

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/');
    }
    fetchIsas();
  }, []);

  const fetchIsas = async () => {
    const minTime = 500;
    const start = Date.now();
    setGlobalLoading(true);

    try {
      const res = await api.get('/visits/isaDetails');
      setIsas(res.data);
    } catch (err) {
      //console.error('Error loading ISAs', err);
    } finally {
      const elapsed = Date.now() - start;
      if (elapsed < minTime) {
        await new Promise((resolve) => setTimeout(resolve, minTime - elapsed));
      }
      setGlobalLoading(false);
    }
  };

  const generatePdf = async () => {
    if (!selectedIsa || !selectedMonth || !selectedYear) {
      setAlert({
        visible: true,
        title: 'Error',
        message: 'Please select ISA, month, and year',
      });
      return;
    }
    setLoading(true);

    const minTime = 500;
    const start = Date.now();
    setGlobalLoading(true);

    try {
      //console.log(selectedIsa);
      //console.log(selectedMonth);
      const url = `/visits/pdf?isa_id=${selectedIsa}&month=${selectedMonth}&year=${selectedYear}`;

      const payload = {
        officer_email: email,
      };
      const response = await api.post(url, payload);

      // // 🌐 WEB
      // if (Platform.OS === 'web') {
      //   const blob = new Blob([response.data], {
      //     type: 'application/pdf',
      //   });

      //   const fileUrl = window.URL.createObjectURL(blob);
      //   const link = document.createElement('a');

      //   link.href = fileUrl;
      //   link.download = `ISA_${selectedMonth}_${selectedYear}.pdf`;
      //   link.click();

      //   window.URL.revokeObjectURL(fileUrl);
      //   return;
      // }

      // // 📱 ANDROID + IOS
      // const fileUri =
      //   FileSystem.cacheDirectory + `ISA_${selectedMonth}_${selectedYear}.pdf`;

      // const base64 = Buffer.from(response.data).toString('base64');

      // await FileSystem.writeAsStringAsync(fileUri, base64, {
      //   encoding: 'base64',
      // });

      // await Sharing.shareAsync(fileUri);
      //console.log(response.data.message);
      setAlert({
        visible: true,
        title: 'Success',
        message: response.data.message,
      });
    } catch (error) {
      //console.error('PDF generation failed', error);
      ///alert('Failed to generate PDF');
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          setAlert({
            visible: true,
            title: 'Permission Denied',
            message:
              'You are not allowed to generate the document for this month/ISA',
          });
          return;
        }

        setAlert({
          visible: true,
          title: 'Server Error',
          message: 'Server error occurred',
        });
      } else {
        setAlert({
          visible: true,
          title: 'Error',
          message: 'Unexpected error occurred',
        });
      }
    } finally {
      setLoading(false);
      const elapsed = Date.now() - start;
      if (elapsed < minTime) {
        await new Promise((resolve) => setTimeout(resolve, minTime - elapsed));
      }
      setGlobalLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppAlert
        visible={alert.visible}
        title={alert.title}
        message={alert.message}
        onClose={() =>
          setAlert({ visible: false, title: 'Alert', message: '' })
        }
      />

      {/* Header */}
      <View style={styles.header}>
        <MaterialIcons
          name="arrow-back"
          size={28}
          color="#fff"
          onPress={() => router.back()}
        />

        <Text style={styles.headerTitle}>Generate ISA PDF</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.pickersContainer}>
        {/* ISA Picker */}
        {Platform.OS === 'android' || Platform.OS === 'web' ? (
          <View style={styles.customPicker}>
            <Text style={styles.pickerLabel}>Select ISA</Text>
            <Picker
              selectedValue={selectedIsa}
              onValueChange={(value) => setSelectedIsa(value)}
            >
              <Picker.Item
                style={styles.pickerValue}
                label="Select ISA"
                value={null}
              />
              {isas.map((isa) => (
                <Picker.Item
                  key={isa.id}
                  label={isa.full_name}
                  value={isa.id}
                />
              ))}
            </Picker>
          </View>
        ) : (
          <>
            <Pressable
              style={styles.customPicker}
              onPress={() => setShowIsaPicker(true)}
            >
              <Text style={styles.pickerLabel}>Select ISA</Text>
              <View style={styles.pickerRow}>
                <Text style={styles.pickerValue}>
                  {selectedIsa
                    ? isas.find((i) => i.id === selectedIsa)?.full_name
                    : 'Choose ISA'}
                </Text>
                <MaterialIcons
                  name="arrow-drop-down"
                  size={28}
                  color={PRIMARY_COLOR}
                />
              </View>
            </Pressable>

            <Modal visible={showIsaPicker} transparent animationType="slide">
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Picker
                    itemStyle={{ color: 'black' }}
                    selectedValue={selectedIsa ?? -1}
                    onValueChange={(value) => {
                      if (value !== -1) setSelectedIsa(value);
                    }}
                  >
                    <Picker.Item label="-- Select ISA --" value={-1} />
                    {isas.map((isa) => (
                      <Picker.Item
                        key={isa.id}
                        label={isa.full_name}
                        value={isa.id}
                      />
                    ))}
                  </Picker>

                  <Pressable
                    style={styles.doneButton}
                    onPress={() => setShowIsaPicker(false)}
                  >
                    <Text style={styles.doneText}>Done</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
          </>
        )}

        {/* Month Picker */}
        {Platform.OS === 'web' || Platform.OS === 'android' ? (
          <View style={styles.customPicker}>
            <Text style={styles.pickerLabel}>Month</Text>
            <Picker
              selectedValue={selectedMonth}
              onValueChange={(value) => setSelectedMonth(value)}
            >
              <Picker.Item
                style={styles.pickerValue}
                label="Select Month"
                value={null}
              />
              {MONTHS.map((m) => (
                <Picker.Item key={m} label={m} value={m} />
              ))}
            </Picker>
          </View>
        ) : (
          <>
            <Pressable
              style={styles.customPicker}
              onPress={() => setShowMonthPicker(true)}
            >
              <Text style={styles.pickerLabel}>Month</Text>
              <View style={styles.pickerRow}>
                <Text style={styles.pickerValue}>
                  {selectedMonth ?? 'Select Month'}
                </Text>
                <MaterialIcons
                  name="arrow-drop-down"
                  size={28}
                  color={PRIMARY_COLOR}
                />
              </View>
            </Pressable>

            <Modal visible={showMonthPicker} transparent animationType="slide">
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Picker
                    itemStyle={{ color: 'black' }}
                    selectedValue={selectedMonth ?? ''}
                    onValueChange={(value) => setSelectedMonth(value)}
                  >
                    <Picker.Item label="-- Select Month --" value="" />
                    {MONTHS.map((m) => (
                      <Picker.Item key={m} label={m} value={m} />
                    ))}
                  </Picker>

                  <Pressable
                    style={styles.doneButton}
                    onPress={() => setShowMonthPicker(false)}
                  >
                    <Text style={styles.doneText}>Done</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
          </>
        )}

        {/* Year Picker */}
        {Platform.OS === 'web' || Platform.OS === 'android' ? (
          <View style={styles.customPicker}>
            <Text style={styles.pickerLabel}>Year</Text>
            <Picker
              selectedValue={selectedYear?.toString() ?? ''}
              onValueChange={(value) => setSelectedYear(parseInt(value, 10))}
            >
              <Picker.Item
                style={styles.pickerValue}
                label="Select Year"
                value=""
              />
              {YEARS.map((y) => (
                <Picker.Item key={y} label={y} value={y} />
              ))}
            </Picker>
          </View>
        ) : (
          <>
            <Pressable
              style={styles.customPicker}
              onPress={() => setShowYearPicker(true)}
            >
              <Text style={styles.pickerLabel}>Year</Text>
              <View style={styles.pickerRow}>
                <Text style={styles.pickerValue}>
                  {selectedYear ?? 'Select Year'}
                </Text>
                <MaterialIcons
                  name="arrow-drop-down"
                  size={28}
                  color={PRIMARY_COLOR}
                />
              </View>
            </Pressable>

            <Modal visible={showYearPicker} transparent animationType="slide">
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Picker
                    itemStyle={{ color: 'black' }}
                    selectedValue={selectedYear?.toString() ?? ''}
                    onValueChange={(value) =>
                      setSelectedYear(parseInt(value, 10))
                    }
                  >
                    <Picker.Item label="-- Select Year --" value="" />
                    {YEARS.map((y) => (
                      <Picker.Item key={y} label={y} value={y} />
                    ))}
                  </Picker>

                  <Pressable
                    style={styles.doneButton}
                    onPress={() => setShowYearPicker(false)}
                  >
                    <Text style={styles.doneText}>Done</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
          </>
        )}
      </View>

      {/* Year
      <View style={styles.card}>
        <Text style={styles.label}>Year</Text>
        <View style={styles.yearBox}>
          <Text style={styles.yearText}>{selectedYear}</Text>
          <TextInput
            id="year"
            onChange={() => setSelectedYear(value)}
          ></TextInput>
        </View>
      </View> */}
      {/* Generate Button */}
      <Pressable
        style={[styles.generateButton, loading && { opacity: 0.7 }]}
        onPress={generatePdf}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.generateText}>Generate PDF</Text>
        )}
      </Pressable>
    </SafeAreaView>
  );
};

export default GenerateISAPdf;

const PRIMARY_COLOR = '#1976D2';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PRIMARY_COLOR,
    padding: 16,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },

  card: {
    backgroundColor: '#f5f5f5',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },

  label: {
    fontWeight: '600',
    marginBottom: 8,
    fontSize: 14,
  },

  pickerWrapper: {
    borderWidth: 2,
    borderColor: PRIMARY_COLOR,
    borderRadius: 8,
  },

  iosPickerButton: {
    borderWidth: 2,
    borderColor: PRIMARY_COLOR,
    borderRadius: 8,
    padding: 14,
  },
  iosPickerText: { fontSize: 16, color: '#000' },

  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContent: { backgroundColor: '#fff' },

  doneButton: {
    padding: 14,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  doneText: {
    color: PRIMARY_COLOR,
    fontWeight: '600',
    fontSize: 16,
  },

  yearBox: {
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#e3f2fd',
  },
  yearText: {
    fontSize: 16,
    fontWeight: '700',
    color: PRIMARY_COLOR,
  },

  generateButton: {
    backgroundColor: '#4CAF50',
    margin: 16,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  generateText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  pickersContainer: {
    margin: 16,
  },

  customPicker: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },

  pickerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 6,
  },

  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  pickerValue: {
    fontSize: 16,
    fontWeight: '700',
    color: PRIMARY_COLOR,
  },
});
