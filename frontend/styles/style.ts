import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85; // 85% of screen width

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212', // Dark background
    },

    // --- Header ---
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
    
    // --- Section Title ---
    sectionTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#E0E0E0',
        marginTop: 20,
        marginBottom: 15,
        paddingHorizontal: 16,
    },

    // --- Visits Carousel ---
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
        backgroundColor: '#333', // Placeholder
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

    // --- Program Buttons ---
    programActions: {
        paddingHorizontal: 16,
        marginTop: 30,
        gap: 15, // Use 'gap' for spacing between buttons
    },
    programBtn: {
        width: '100%',
        paddingVertical: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
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
    // The text in these buttons should be dark, as they are light backgrounds
    darkText: {
        color: '#333',
    },

    // --- Footer ---
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