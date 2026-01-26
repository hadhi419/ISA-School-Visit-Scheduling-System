import api from '@/api/axiosInstance';
import { useAuth } from '@/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { Icon } from '@rneui/themed';
import { router } from 'expo-router';
import React, { FC, useEffect, useState } from 'react';
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { DatePickerModal } from 'react-native-paper-dates';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ISA {
  id: number;
  full_name: string;
}

interface DutyItem {
  id: number;
  date: string;
  month: string;
  location: string;
  duty: string;
  status: string;
  isa_id: number;
  full_name: string;
}

const ISAMonitoring: FC = () => {
  const [isas, setIsas] = useState<ISA[]>([]);
  const [selectedIsa, setSelectedIsa] = useState<number | null>(null);
  const [duties, setDuties] = useState<DutyItem[]>([]);
  const [showPicker, setShowPicker] = useState(false);

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/');
    }
    setSelectedDate(new Date());
    fetchData();
  }, []);

  const formatDateToYMD = (date: Date | null): string | null => {
    if (!date) return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const fetchData = async () => {
    const date = formatDateToYMD(selectedDate);

    if (!selectedIsa || selectedIsa == -1 || selectedIsa == 0) {
      const response = await api.get(`/visits/isa?isa_id=${null}&date=${date}`);
      setDuties(response.data.data);
      console.log('daaaaaaaata', response.data.data);
      console.log('Duties', duties);
    } else {
      const response = await api.get(
        `/visits/isa?isa_id=${selectedIsa}&date=${date}`
      );
      setDuties(response.data.data);
      console.log(response.data.data);
    }

    const isaResponse = await api.get(`/visits/isaDetails`);

    setIsas(isaResponse.data);
  };

  useEffect(() => {
    if (!selectedIsa || selectedIsa === -1) {
      fetchData();
      setDuties([]);
      return;
    }
    fetchData();
  }, [selectedIsa, selectedDate]);

  const renderHeader = () => (
    <>
      {/* Header */}
      <View style={styles.header}>
        <Icon
          name="arrow-back"
          type="material"
          color="#fff"
          onPress={() => router.back()}
        />
        <Text style={styles.headerTitle}>ISA Monitoring</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* ISA Picker */}
      <View style={[styles.filterContainer, { marginTop: 20 }]}>
        <Text style={styles.filterLabel}>Select ISA</Text>

        {Platform.OS === 'ios' ? (
          <>
            <Pressable
              style={styles.iosPickerButton}
              onPress={() => setShowPicker(true)}
            >
              <Text style={styles.iosPickerText}>
                {selectedIsa && selectedIsa !== -1
                  ? isas.find((i) => i.id === selectedIsa)?.full_name
                  : '-- Select ISA --'}
              </Text>
            </Pressable>

            <Modal visible={showPicker} transparent animationType="slide">
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Picker
                    selectedValue={selectedIsa ?? -1}
                    onValueChange={(value) => {
                      const num = Number(value);
                      if (num !== -1) setSelectedIsa(num);
                      setShowPicker(false);
                    }}
                    style={{ height: 150 }}
                    itemStyle={{ color: '#000', fontSize: 16 }}
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
                    onPress={() => setShowPicker(false)}
                  >
                    <Text style={styles.doneText}>Done</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
          </>
        ) : (
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedIsa}
              onValueChange={(value) => setSelectedIsa(Number(value))}
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
          </View>
        )}
      </View>

      {/* Date Filter */}
      <View style={[styles.filterContainer, { marginTop: 10 }]}>
        <Text style={styles.filterLabel}>Filter by Date</Text>

        {Platform.OS === 'web' ? (
          <input
            type="date"
            style={{
              borderWidth: 2,
              borderColor: '#1976D2',
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
              width: '100%',
            }}
            value={selectedDate ? (formatDateToYMD(selectedDate) ?? '') : ''}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
          />
        ) : (
          <>
            <Pressable
              style={styles.iosPickerButton}
              onPress={() => setDatePickerVisible(true)}
            >
              <Text style={styles.iosPickerText}>
                {selectedDate
                  ? selectedDate.toDateString()
                  : '-- Select Date --'}
              </Text>
            </Pressable>

            <DatePickerModal
              locale="en"
              mode="single"
              visible={isDatePickerVisible}
              date={selectedDate ?? new Date()}
              onDismiss={() => setDatePickerVisible(false)}
              onConfirm={({ date }) => {
                if (date) setSelectedDate(date);
                setDatePickerVisible(false);
              }}
            />
          </>
        )}

        {selectedDate && (
          <Pressable
            onPress={() => setSelectedDate(null)}
            style={{ marginTop: 8 }}
          >
            <Text style={{ color: '#1976D2', fontWeight: '600' }}>
              Clear Date Filter
            </Text>
          </Pressable>
        )}
      </View>

      {/* Summary */}
      {selectedIsa && selectedIsa !== -1 && (
        <View style={styles.summaryBar}>
          <Text style={styles.summaryText}>Total Assignments</Text>
          <Text style={styles.summaryValue}>{duties.length}</Text>
        </View>
      )}
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={duties}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardRight}>
              <Text style={styles.cardDate}>{item.date}</Text>
              <Text>{item.month}</Text>
            </View>

            <View style={styles.verticalLine} />

            <View>
              <Text style={styles.cardText}>
                <MaterialIcons name="location-on"></MaterialIcons>{' '}
                {item.location}
              </Text>
              <Text style={styles.cardText}>
                <MaterialIcons name="work"></MaterialIcons> {item.duty}
              </Text>
              <Text style={styles.cardText}>
                <MaterialIcons name="approval"></MaterialIcons> {item.status}
              </Text>
              <Text style={styles.cardText}>
                <MaterialIcons name="person"></MaterialIcons> {item.full_name}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          selectedIsa ? (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>No assignments found</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

export default ISAMonitoring;

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1976D2',
    padding: 16,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },

  filterContainer: { margin: 14 },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },

  pickerWrapper: {
    borderWidth: 2,
    borderColor: '#1976D2',
    borderRadius: 8,
  },

  iosPickerButton: {
    borderWidth: 2,
    borderColor: '#1976D2',
    borderRadius: 8,
    padding: 14,
  },
  iosPickerText: { fontSize: 16, color: '#000' },

  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(60,60,60,0.3)',
  },
  modalContent: { backgroundColor: '#fff' },

  doneButton: {
    alignItems: 'center',
    padding: 14,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  doneText: { fontSize: 16, fontWeight: '600', color: '#1976D2' },

  summaryBar: {
    backgroundColor: '#dae1eb',
    marginHorizontal: 16,
    marginTop: 15,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
  },
  summaryText: { color: '#555' },
  summaryValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1976D2',
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  cardRight: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardDate: {
    fontWeight: '700',
    fontSize: 30,
    color: '#00a708',
    paddingHorizontal: 10,
  },
  verticalLine: {
    width: 1,
    backgroundColor: '#cfcfcf',
    marginHorizontal: 12,
  },
  cardText: { fontSize: 14 },

  warningBox: {
    backgroundColor: '#f0e5a6',
    padding: 12,
    margin: 16,
    borderRadius: 8,
  },
  warningText: { textAlign: 'center', fontWeight: '600' },
});
