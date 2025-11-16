import { Icon } from '@rneui/themed';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSchedule, ScheduleType, ScheduledEvent } from '../isa/context/ScheduleContext'; 


const dutyLabelToType: Record<string, "HNST" | "EXAM" | "DEV" | "EVAL" | "NONE" | "HOLIDAY"> = {
    'HNST Visit': 'HNST',
    'Dev. Meeting': 'DEV',
    'In. Evaluation': 'EVAL',
    'Exam Duty': 'EXAM',
    'Holiday':'HOLIDAY',
};

const DutySelection = () => {
    const { addScheduleEvent } = useSchedule(); 
    
    const params = useLocalSearchParams();
    const { date: dateParam, month: monthParam } = params;
    const date = dateParam?.toString() ?? '';
    const month = monthParam?.toString() ?? '';

    const duties = [
        { label: 'HNST Visit', color: '#1976D2', textColor: '#FFFFFF' },
        { label: 'Dev. Meeting', color: '#FFC107', textColor: '#000000' },
        { label: 'In. Evaluation', color: '#4CAF50', textColor: '#FFFFFF' },
        { label: 'Exam Duty', color: '#8E24AA', textColor: '#FFFFFF' },
        { label: 'Holiday', color: '#e00303ff', textColor: '#FFFFFF' }, 
    ];

    const handleDutyPress = (dutyLabel: string) => {
        
        if (dutyLabel === 'Holiday') {
            const dutyType: ScheduleType = 'HOLIDAY'; 

            const holidayEvent: ScheduledEvent = {
                date: date,
                duty: dutyType,
            };
            
            // 💡 Key Action: Update the global state
            addScheduleEvent(holidayEvent);
            
            // Navigate back to AdvancedProgram
            router.back(); 
            return;
        }

        const dutyType = dutyLabelToType[dutyLabel] || 'HNST'; 

        router.push({
            pathname: '/isa/locationSelection',
            params: { date, month, duty: dutyType }
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Icon name="arrow-back" type="material" color="#E0E0E0" size={28} onPress={() => router.back()} />
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
            </View>
        </SafeAreaView>
    );
};

// ... (styles remain the same)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: { flexDirection: 'row', alignItems: 'center', backgroundColor: "#1976D2", justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 15, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#333' },
    headerTitle: { fontSize: 18, fontWeight: '500', color: '#ffffffff', textAlign: 'center', flex: 1 },
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