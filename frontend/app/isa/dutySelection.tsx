import { useAuth } from '@/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Icon } from '@rneui/themed';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../api/axiosInstance';
import { useSchedule } from '../../isa/context/ScheduleContext';

const BackIcon = () => (
  <Pressable onPress={() => router.back()} style={styles.backButton}>
    <Text style={styles.backIcon}>←</Text>
  </Pressable>
);

const dutyLabelToType: Record<
  string,
  'HNST' | 'EXAM' | 'DEV' | 'EVAL' | 'HOLI'
> = {
  'HNST Visit': 'HNST',
  'Dev. Meeting': 'DEV',
  'In. Evaluation': 'EVAL',
  'Exam Duty': 'EXAM',
  Holiday: 'HOLI',
};

const DutySelection = () => {
  const params = useLocalSearchParams();
  //console.log(params.date);
  const date = params.date ?? '';

  const { id } = useAuth();

  const edit = params.edit === 'true'; // now edit is a proper boolean

  // console.log('edit:', edit);

  //console.log('params: duty : ', params);

  const { addEvent } = useSchedule();

  const duties = [
    { label: 'HNST Visit', color: '#1976D2', textColor: '#FFFFFF' },
    { label: 'Dev. Meeting', color: '#FFC107', textColor: '#000000' },
    { label: 'In. Evaluation', color: '#4CAF50', textColor: '#FFFFFF' },
    { label: 'Exam Duty', color: '#8E24AA', textColor: '#FFFFFF' },
    { label: 'Holiday', color: '#e00303ff', textColor: '#FFFFFF' },
  ];

  const handleDeletePress = async () => {
    //console.log('Holiday');

    const date = params.date ?? '';
    console.log(date);

    const today = new Date();
    const nextMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate()
    );
    const month = nextMonth.toLocaleString('default', { month: 'long' });

    const payload = {
      visit_date: date,
      month,
      isa_id: 5,
    };
    console.log('Payload for delete:', payload);

    const res = await api.post('visits/delete', payload);
    //console.log();
    // console.log('✅ Event added:', { date, dutyType, location: 'none' });
    //console.log(res.data.message.message);

    if (
      res.data.message.message ==
      'Cannot delete or update a parent row: a foreign key constraint fails (`isa_school_visit_management`.`approval_logs`, CONSTRAINT `approval_logs_ibfk_1` FOREIGN KEY (`visit_id`) REFERENCES `visits` (`id`))'
    ) {
      alert('Cannot delete a schedule that was submitted');
    }
    return router.navigate('/isa/advancedProgram');
  };

  const handleDutyPress = async (dutyLabel: string) => {
    const dutyType = dutyLabelToType[dutyLabel] || 'HNST';

    const month = new Date().toLocaleString('default', { month: 'long' });

    if (dutyType == 'HOLI') {
      //console.log('Holiday');
      const searchParams = params;
      const date = searchParams.date ?? '';
      console.log('srgserehtshtsh', date);

      const today = new Date();
      const nextMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        today.getDate()
      );
      const month = nextMonth.toLocaleString('default', { month: 'long' });

      const payload = [
        {
          visit_date: date,
          month,
          isa_id: id,
          location_id: null,
          duty: 'HOLI',
          report_text: null,
        },
      ];
      console.log('Payload for edit:', payload);
      await api.post('visits', payload);
      //console.log();
      // console.log('✅ Event added:', { date, dutyType, location: 'none' });
      return router.navigate('/isa/advancedProgram');
    }
    // console.log('Selected duty:', dutyType);
    // console.log('isEdit dutySelection:', edit);

    router.push({
      pathname: '/isa/locationSelection',
      params: { date, duty: dutyType, isEdit: edit ? 'true' : 'false' },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Icon
          name="arrow-back"
          type="material"
          color="#E0E0E0"
          size={28}
          onPress={() => router.back()}
        />
        <Text style={styles.headerTitle}>Select Duty</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.buttonContainer}>
        {duties.map((duty, index) => (
          <Pressable
            key={index}
            style={({ pressed }) => [
              styles.dutyButton,
              { backgroundColor: duty.color },
              pressed && styles.dutyButtonPressed,
            ]}
            onPress={() => handleDutyPress(duty.label)}
          >
            <Text style={[styles.dutyButtonText, { color: duty.textColor }]}>
              {duty.label}
            </Text>
          </Pressable>
        ))}
        <Pressable
          style={styles.deleteButton}
          onPress={() => handleDeletePress()}
        >
          <MaterialCommunityIcons name={'delete'} size={40} color="#fd6e00" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1976D2',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#ffffffff',
    textAlign: 'center',
    flex: 1,
  },
  backButton: {
    paddingRight: 15,
  },
  backIcon: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    transform: [{ scaleX: -1 }],
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    gap: 20,
  },
  dutyButton: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  deleteButton: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dutyButtonPressed: {
    opacity: 0.8,
  },
  dutyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  footerText: {
    fontSize: 12,
    color: '#555',
  },
});

export default DutySelection;
