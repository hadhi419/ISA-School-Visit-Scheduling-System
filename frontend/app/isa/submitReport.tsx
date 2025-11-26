import React, { useState, FC } from 'react'; // Import FC for functional component typing
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/themed'; 
import { router } from 'expo-router';   

// 1. Define the Interface for the File Object
interface UploadedFile {
    id: number;
    name: string;
    type: 'photo' | 'document';
}

// 2. Define the Props for the FileItem Component
interface FileItemProps {
    file: UploadedFile;
    onRemove: (id: number) => void; // Explicitly type onRemove function
}

// --- Component Definition ---

const MonitoringReportForm: FC = () => { // Add FC type to main component
    const [observations, setObservations] = useState('');
    const [assessments, setAssessments] = useState('');
    // Use the defined interface for the state array
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([ 
        // { id: 1, name: 'classroom_photo_1.jpg', type: 'photo' },
        // { id: 2, name: 'attendance_scan.pdf', type: 'document' },
    ]);

    // 3. Explicitly type the 'id' parameter in handleRemoveFile
    const handleRemoveFile = (id: number) => { 
        setUploadedFiles(files => files.filter(file => file.id !== id));
    };

    // 4. Use the defined interface for FileItem props
    const FileItem: FC<FileItemProps> = ({ file, onRemove }) => (
        <View style={styles.fileItem}>
            <Icon 
                name={file.type === 'document' ? 'file-document-outline' : 'image-outline'} 
                type="material-community" 
                color="#555" 
                size={20} 
                // Removed 'style={styles.fileIcon}' as it's not defined in the original styles
            />
            <Text style={styles.fileName}>{file.name}</Text>
            <Pressable onPress={() => onRemove(file.id)}>
                <Icon name="delete-outline" type="material" color="#CC3333" size={24} />
            </Pressable>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Icon name="arrow-back" type="material" color="#fff" size={28} style={styles.backIcon} onPress={() => router.back()} />
                <Text style={styles.headerTitle}>Submit Monitoring Report</Text>
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                
                {/* --- Report Details --- */}
                <View style={styles.detailCard}>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>School Name:</Text>
                        <Text style={styles.detailValue}>Parannaddakal</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Date of Visit:</Text>
                        <Text style={styles.detailValue}>2025-12-07</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>ISA's Name:</Text>
                        <Text style={styles.detailValue}>Alex</Text>
                    </View>
                </View>

                {/* --- Observations --- */}
                <Text style={styles.sectionTitle}>Observations</Text>
                <TextInput
                    style={[styles.textArea, { height: 100 }]}
                    placeholder="Enter your observations here..."
                    value={observations}
                    onChangeText={setObservations}
                    multiline
                />

                {/* --- Assessments --- */}
                <Text style={styles.sectionTitle}>Assessments</Text>
                <TextInput
                    style={[styles.textArea, { height: 100 }]}
                    placeholder="Enter your assessment notes here..."
                    value={assessments}
                    onChangeText={setAssessments}
                    multiline
                />

                {/* --- Supporting Evidence --- */}
                <Text style={styles.sectionTitle}>Supporting Evidence</Text>
                
                <Pressable style={[styles.uploadButton, { backgroundColor: '#B3E5FC' }]}>
                    <Icon name="camera-outline" type="material-community" color="#1565C0" size={24} />
                    <Text style={[styles.uploadButtonText, { color: '#1565C0' }]}>Upload Photos</Text>
                </Pressable>

                <Pressable style={[styles.uploadButton, { backgroundColor: '#B3E5FC' }]}>
                    <Icon name="file-document-outline" type="material-community" color="#1565C0" size={24} />
                    <Text style={[styles.uploadButtonText, { color: '#1565C0' }]}>Upload Documents</Text>
                </Pressable>

                {/* --- Uploaded File List ---
                <View style={styles.fileList}>
                    {uploadedFiles.map(file => (
                        <FileItem key={file.id} file={file} onRemove={handleRemoveFile} />
                    ))}
                </View> */}

                {/* --- Action Buttons --- */}
                <View style={styles.buttonGroup}>
                    <Pressable 
                        style={[styles.actionButton, styles.draftButton]} 
                        onPress={() => console.log('Save as Draft')}
                    >
                        <Text style={styles.draftButtonText}>Save as Draft</Text>
                    </Pressable>
                    <Pressable 
                        style={[styles.actionButton, styles.submitButton]} 
                        onPress={() => console.log('Submit Report')}
                    >
                        <Text style={styles.submitButtonText}>Submit Report</Text>
                    </Pressable>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

// --- Stylesheet (Unchanged) ---
const PRIMARY_COLOR = '#1976D2'; 

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: PRIMARY_COLOR,
        paddingHorizontal: 16,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#0d47a1',
    },
    backIcon: {
        marginRight: 10,
        paddingHorizontal: 5, 
        paddingVertical: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    container: {
        padding: 15,
    },
    detailCard: {
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 2,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    detailLabel: {
        fontSize: 14,
        color: '#555',
        fontWeight: '500',
        width: '40%',
    },
    detailValue: {
        fontSize: 14,
        color: '#333',
        fontWeight: 'bold',
        width: '60%',
        textAlign: 'right',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginTop: 15,
        marginBottom: 8,
    },
    textArea: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        textAlignVertical: 'top',
        fontSize: 14,
        backgroundColor: '#fff',
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    uploadButtonText: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 10,
    },
    fileList: {
        marginTop: 5,
        marginBottom: 20,
    },
    fileItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    // fileIcon style was causing an issue as it wasn't defined. Removed it from JSX.
    fileName: {
        flex: 1,
        fontSize: 14,
        color: '#555',
        paddingLeft: 5,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    actionButton: {
        flex: 1,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    draftButton: {
        backgroundColor: '#eee',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    draftButtonText: {
        color: '#555',
        fontWeight: '600',
        fontSize: 16,
    },
    submitButton: {
        backgroundColor: '#4CAF50', 
        marginLeft: 10,
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});

export default MonitoringReportForm;