import api from '@/api/axiosInstance';
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
import { SafeAreaView } from 'react-native-safe-area-context';

interface ISA {
  id: number;
  name: string;
}

interface DutyItem {
  id: number;
  date: string;
  location: string;
  duty: string;
  isa_id: number;
}

const ISAMonitoring: FC = () => {
  const [isas, setIsas] = useState<ISA[]>([]);
  const [selectedIsa, setSelectedIsa] = useState<number | null>(5);
  const [duties, setDuties] = useState<DutyItem[]>([]);
  const [showPicker, setShowPicker] = useState(false);

  // Load ISAs
  useEffect(() => {
    // setIsas([
    //   { id: 2, name: 'Mohomed Hadhi' },
    //   { id: 8, name: 'Maleesha Aiya' },
    //   { id: 12, name: 'Fathima Rizni' },
    // ]);

    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await api.get(`/visits/isa?isa_id=5&month=January&day=6`);
    const dutiesData = response.data.data;
    console.log('sdfgwerg:', response.data.data);

    setDuties(dutiesData);
    console.log('Duties : ', duties);
  };
  // Load duties filtered by selected ISA
  useEffect(() => {
    if (!selectedIsa || selectedIsa === -1) {
      setDuties([]);
      return;
    }
    fetchData();
  }, [selectedIsa]);

  // Header with Picker & Summary
  const renderHeader = () => (
    <>
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

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Select ISA</Text>

        {Platform.OS === 'ios' ? (
          <>
            <Pressable
              style={styles.iosPickerButton}
              onPress={() => setShowPicker(true)}
            >
              <Text style={styles.iosPickerText}>
                {selectedIsa && selectedIsa !== -1
                  ? isas.find((i) => i.id === selectedIsa)?.name
                  : '-- Select ISA --'}
              </Text>
            </Pressable>

            <Modal visible={showPicker} transparent animationType="slide">
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Picker
                    selectedValue={selectedIsa ?? -1}
                    onValueChange={(value) => {
                      const numValue = Number(value); // convert to number
                      if (numValue !== -1) setSelectedIsa(numValue);
                    }}
                    style={{ width: '100%', height: 150 }}
                    itemStyle={{ color: '#000', fontSize: 16 }}
                  >
                    <Picker.Item label="-- Select ISA --" value={-1} />
                    {isas.map((isa) => (
                      <Picker.Item
                        key={isa.id}
                        label={isa.name}
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
              onValueChange={(value) => {
                const numValue = Number(value); // <-- convert to number
                setSelectedIsa(numValue);
              }}
            >
              <Picker.Item label="-- Select ISA --" value={-1} />
              {isas.map((isa) => (
                <Picker.Item key={isa.id} label={isa.name} value={isa.id} />
              ))}
            </Picker>
          </View>
        )}
      </View>

      {selectedIsa && selectedIsa !== -1 && (
        <View style={styles.summaryBar}>
          <Text style={styles.summaryText}>
            Total Assignments: {duties.length}
          </Text>
        </View>
      )}
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={duties}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardDate}>{item.date}</Text>
            <Text style={styles.cardText}>Location: {item.location}</Text>
            <Text style={styles.cardText}>Duty: {item.duty}</Text>
          </View>
        )}
        ListEmptyComponent={
          selectedIsa && duties.length === 0 ? (
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

  filterContainer: { marginVertical: 16 },
  filterLabel: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  pickerWrapper: { borderWidth: 2, borderColor: '#1976D2', borderRadius: 8 },

  iosPickerButton: {
    borderWidth: 2,
    borderColor: '#1976D2',
    borderRadius: 8,
    padding: 14,
    backgroundColor: '#fff',
  },
  iosPickerText: { fontSize: 16, color: '#000' },

  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(60,60,60,0.3)',
  },
  modalContent: {
    backgroundColor: '#fff',
    paddingBottom: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  doneButton: {
    alignItems: 'center',
    padding: 14,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  doneText: { fontSize: 16, fontWeight: '600', color: '#1976D2' },

  summaryBar: {
    backgroundColor: '#dae1eb',
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
  },
  summaryText: { fontWeight: '700', fontSize: 16 },

  card: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardDate: { fontWeight: '700', fontSize: 16, marginBottom: 6 },
  cardText: { fontSize: 14 },

  warningBox: {
    backgroundColor: '#f0e5a6',
    padding: 12,
    marginVertical: 16,
    borderRadius: 8,
  },
  warningText: { textAlign: 'center', fontWeight: '600' },
});
