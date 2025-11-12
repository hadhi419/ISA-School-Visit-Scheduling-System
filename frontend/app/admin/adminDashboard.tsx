// Dashboard.tsx
import { Button } from '@rneui/themed'; // Requires @rneui/themed and @rneui/base
import { FC } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;

// --- 1. Inline Types ---
interface Visit {
    id: string;
    location: string;
    time: string;
    image: string; // URL of the location image
}

interface VisitCardProps extends Visit {}

interface DashboardProps {}
// -----------------------

// --- 2. Styles (Inline) ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 50, // For notch/status bar clearance
        paddingBottom: 15,
        backgroundColor: '#121212',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '500',
        color: '#E0E0E0',
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#E0E0E0',
        marginTop: 20,
        marginBottom: 15,
        paddingHorizontal: 16,
    },
    visitsCarousel: {
        paddingLeft: 16,
    },
    visitCard: {
        width: CARD_WIDTH,
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        marginRight: 15,
        overflow: 'hidden',
        // Shadow styling for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        // Shadow styling for Android
        elevation: 8,
    },
    cardImage: {
        width: '100%',
        height: 180,
        backgroundColor: '#333',
    },
    cardContent: {
        padding: 15,
    },
    cardLocation: {
        fontSize: 18,
        fontWeight: '600',
        color: '#E0E0E0',
        marginBottom: 5,
    },
    cardTime: {
        fontSize: 14,
        color: '#A0A0A0',
        marginBottom: 15,
    },
    programActions: {
        paddingHorizontal: 16,
        marginTop: 30,
        gap: 15,
    },
    programBtn: {
        width: '100%',
        paddingVertical: 20,
        borderRadius: 12,
        elevation: 5,
    },
    programBtnTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    advancedProgram: {
        backgroundColor: '#FFC107', // Yellow/Gold
    },
    amendedProgram: {
        backgroundColor: '#66BB6A', // Teal/Green
    },
    darkText: {
        color: '#333',
    },
    footerBranding: {
        textAlign: 'center',
        fontSize: 12,
        color: '#555',
        marginTop: 40,
        paddingBottom: 20,
    },
    vLogo: {
        color: '#6A1B9A',
        fontWeight: 'bold',
        fontSize: 14,
    }
});
// ----------------------------------------

// --- 3. Placeholder Data ---
const VISITS_DATA: Visit[] = [
    { id: '1', location: 'Sundharapuram GTMS', time: 'Mon, 10th Nov, 10:00 AM', image: 'https://via.placeholder.com/320x180/4C72B0/FFFFFF?text=Sundharapuram' },
    { id: '2', location: 'Kanagapuram School', time: 'Wed, 12th Nov, 11:30 AM', image: 'https://via.placeholder.com/320x180/66BB6A/FFFFFF?text=Kanagapuram' },
    { id: '3', location: 'New Location Site', time: 'Fri, 14th Nov, 2:00 PM', image: 'https://via.placeholder.com/320x180/FFC107/FFFFFF?text=New+Site' },
];

// --- 4. Visit Card Component ---
const VisitCard: FC<VisitCardProps> = ({ location, time, image }) => (
    <View style={styles.visitCard}>
        <Image source={{ uri: image }} style={styles.cardImage} />
        <View style={styles.cardContent}>
            <Text style={styles.cardLocation}>{location}</Text>
            <Text style={styles.cardTime}>{time}</Text>
            <Button
                title="View Details"
                buttonStyle={{
                    backgroundColor: '#4C72B0',
                    borderRadius: 8,
                }}
                titleStyle={{ fontSize: 16, fontWeight: '600' }}
                onPress={() => console.log(`Viewing details for ${location}`)}
            />
        </View>
    </View>
);

// --- 5. Main Dashboard Component ---
const Dashboard: FC<DashboardProps> = () => {
    return (
        <View>
            <Text>Welcome, Admin</Text>
        </View>
    )
};

export default Dashboard;