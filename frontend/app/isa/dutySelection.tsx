import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

// Mock back arrow
const BackIcon = () => (
    <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backIcon}>←</Text>
    </Pressable>
);

// Map user-facing labels to ScheduleType
const dutyLabelToType: Record<string, 'HNST' | 'EXAM' | 'DEV' | 'EVAL'> = {
    'HNST Visit': 'HNST',
    'Dev. Meeting': 'DEV',
    'In. Evaluation': 'EVAL',
    'Exam Duty': 'EXAM',
};

const DutySelection = () => {
    const params = useLocalSearchParams();
    const date = params.date ?? '21';
    console.log("Date from params:", date);

    const duties = [
        { label: 'HNST Visit', color: '#1976D2', textColor: '#FFFFFF' },
        { label: 'Dev. Meeting', color: '#FFC107', textColor: '#000000' },
        { label: 'In. Evaluation', color: '#4CAF50', textColor: '#FFFFFF' },
        { label: 'Exam Duty', color: '#8E24AA', textColor: '#FFFFFF' },
    ];

    const handleDutyPress = (dutyLabel: string) => {
        const dutyType = dutyLabelToType[dutyLabel] || 'HNST'; // fallback if undefined
        console.log("Selected duty:", dutyType);

        router.push({
            pathname: '/isa/locationSelection',
            params: { date, duty: dutyType } // pass ScheduleType directly
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <BackIcon />
                <Text style={styles.headerTitle}>Select Duty</Text>
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

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Made with <Text style={styles.vLogo}>V</Text>
                </Text>
            </View>
        </View>
    );
};

// --- Stylesheet ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        backgroundColor: '#1976D2',
        paddingTop: 50,
        paddingHorizontal: 15,
        paddingBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
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
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
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
    vLogo: {
        color: '#8E24AA',
        fontWeight: '900',
        fontSize: 14,
    }
});

export default DutySelection;
