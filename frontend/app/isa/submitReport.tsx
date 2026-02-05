import { Icon } from '@rneui/themed';
import { router } from 'expo-router';
import { useSearchParams } from 'expo-router/build/hooks';
import React, { FC, useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useAuth } from '@/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../api/axiosInstance';

import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useLoading } from '../../LoadingContext';

/* ---------- Types ---------- */
interface UploadedFile {
  id: number;
  name: string;
  type: 'photo' | 'document';
  uri: string;
}

interface FileItemProps {
  file: UploadedFile;
  onRemove: (id: number) => void;
}

/* ---------- Component ---------- */
const MonitoringReportForm: FC = () => {
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [observations, setObservations] = useState('');
  const [assessments, setAssessments] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const [locationChanged, setLocationChanged] = useState(false);
  const [actualLocationId, setActualLocationId] = useState<number | null>(null);
  const [locations, setLocations] = useState<{ id: number; name: string }[]>(
    []
  );

  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showDutyPicker, setShowDutyPicker] = useState(false);

  const [actualDuty, setActualDuty] = useState<
    | 'HNST'
    | 'ADVO'
    | 'ExEv'
    | 'Office'
    | 'Parti'
    | 'Faci'
    | 'HOLI'
    | 'PL'
    | 'Other'
    | 'NONE'
    | null
  >(null);

  const [locationChangeReason, setLocationChangeReason] = useState('');

  const [visitId, setVisitId] = useState<number | null>(null);

  const params = useSearchParams();
  const year = Number(params.get('year'));
  const month = params.get('month');
  const day = Number(params.get('date'));
  const locationParam = params.get('location');
  const id = Number(params.get('id'));
  const duty = params.get('duty');

  const { isLoggedIn } = useAuth();
  const { setLoading } = useLoading();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/');
    }
    setDate(`${year}-${month}-${day}`);
    setLocation(locationParam || '');
    setVisitId(id || null);
    //console.log('Visit ID:', id);
    const fetchLocations = async () => {
      const minTime = 300;
      const start = Date.now();
      setLoading(true);
      try {
        const res = await api.get('/locations'); // adjust your endpoint
        setLocations(res.data.locations);
      } catch (err) {
        //console.error('Failed to fetch locations', err);
      } finally {
        const elapsed = Date.now() - start; // ADDED
        if (elapsed < minTime) {
          await new Promise((resolve) =>
            setTimeout(resolve, minTime - elapsed)
          );
        }
        setLoading(false); // ADDED
      }
    };

    fetchLocations();
  }, [year, month, day, locationParam]);

  /* ---------- File Pickers ---------- */
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setUploadedFiles((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: asset.fileName || 'photo.jpg',
          type: 'photo',
          uri: asset.uri,
        },
      ]);
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ],
        copyToCacheDirectory: true,
      });

      //console.log('Document picker result:', result);

      if (result.canceled === false) {
        const file: UploadedFile = {
          id: Date.now(),
          name: result.assets[0].name,
          type: 'document',
          uri: result.assets[0].uri,
        };
        ////console.log('Fileee ', file);

        setUploadedFiles((prev) => [...prev, file]);
      } else {
        //console.log('User canceled document picker');
      }
    } catch (err) {
      //console.error('pickDocument error:', err);
    }
  };

  const handleRemoveFile = (id: number) => {
    setUploadedFiles((files) => files.filter((file) => file.id !== id));
  };

  /* ---------- Submit Form ---------- */
  const submitReport = async () => {
    if (!observations) {
      Alert.alert('Error', 'Observations are required.');
      return;
    }

    const minTime = 300;
    const start = Date.now();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('visit_id', visitId?.toString() || '');
      formData.append('report_text', observations);
      //formData.append('reason', locationChangeReason);
      formData.append('status', 'VISITED');
      formData.append(
        'actual_location_id',
        actualLocationId
          ? actualLocationId.toString()
          : locationParam
            ? locationParam.toString()
            : ' '
      );
      formData.append('location_change_reason', locationChangeReason);
      formData.append(
        'actual_duty',
        actualDuty ? actualDuty : duty ? duty : ' '
      );

      // Append files
      for (const file of uploadedFiles) {
        if (Platform.OS === 'web') {
          const blob = await fetch(file.uri).then((r) => r.blob());
          formData.append(
            'files',
            new File([blob], file.name, {
              type: file.type === 'photo' ? 'image/jpeg' : 'application/pdf',
            })
          );
        } else {
          // Mobile: fetch the file and convert to blob

          formData.append('files', {
            uri: file.uri,
            name: file.name,
            type: file.type === 'photo' ? 'image/jpeg' : 'application/pdf',
          } as any);

          //console.log('URIII', file.uri);
        }
      }

      const response = await api.post('/reports/submit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const data = response.data;
      //console.log('Submit Response:', response);

      if (response.data.message == 'Monitoring report submitted successfully') {
        Alert.alert('Success', data.message);
        setObservations('');
        setAssessments('');
        setUploadedFiles([]);
      } else {
        Alert.alert('Error', data.error || 'Something went wrong.');
      }

      router.back();
    } catch (err) {
      //console.error('Submit Error:', err);
      Alert.alert('Error', 'Network or server error.');
    } finally {
      const elapsed = Date.now() - start;
      if (elapsed < minTime) {
        await new Promise((resolve) => setTimeout(resolve, minTime - elapsed));
      }
      setLoading(false);
    }
  };

  /* ---------- File Item ---------- */
  const FileItem: FC<FileItemProps> = ({ file, onRemove }) => (
    <View style={styles.fileItem}>
      <Icon
        name={
          file.type === 'document' ? 'file-document-outline' : 'image-outline'
        }
        type="material-community"
        color="#555"
        size={20}
      />
      <Text style={styles.fileName}>{file.name}</Text>
      <Pressable onPress={() => onRemove(file.id)}>
        <Icon name="delete-outline" type="material" color="#CC3333" size={24} />
      </Pressable>
    </View>
  );

  /* ---------- UI ---------- */
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Icon
          name="arrow-back"
          type="material"
          color="#fff"
          size={28}
          style={styles.backIcon}
          onPress={() => router.back()}
        />
        <Text style={styles.headerTitle}>Submit Monitoring Report</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Details */}
        <View style={styles.detailCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              {/* <MaterialIcons name="location-on"></MaterialIcons> */}
              Location :
            </Text>
            <Text style={styles.detailValue}>{location}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date of Visit:</Text>
            <Text style={styles.detailValue}>{date}</Text>
          </View>
        </View>
        {/* Location Change Checkbox */}
        <Pressable
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 10,
          }}
          onPress={() => {
            //console.log(location);
            setLocationChanged((prev) => !prev);
          }}
        >
          <Icon
            name={
              locationChanged ? 'checkbox-marked' : 'checkbox-blank-outline'
            }
            type="material-community"
            size={24}
            color={PRIMARY_COLOR}
          />
          <Text style={{ marginLeft: 10, fontSize: 16 }}>Any Amendments?</Text>
        </Pressable>
        {/* Show dropdown if changed */}
        {/* ---------- Show dropdown if changed ---------- */}
        {locationChanged && (
          <View style={{ marginVertical: 10 }}>
            <Text style={styles.filterLabel}>Reason:</Text>
            <TextInput
              style={styles.iosPickerButton}
              onChangeText={(value) => setLocationChangeReason(value)}
              value={locationChangeReason} // optional, if you're controlling the input
            />

            {/* Select New Location */}
            <Text style={styles.filterLabel}>Select New Location:</Text>

            {Platform.OS === 'ios' ? (
              <>
                <Pressable
                  style={styles.iosPickerButton}
                  onPress={() => setShowLocationPicker(true)}
                >
                  <Text style={styles.iosPickerText}>
                    {actualLocationId
                      ? locations.find((l) => l.id === actualLocationId)?.name
                      : '-- Select Location --'}
                  </Text>
                </Pressable>

                <Modal
                  visible={showLocationPicker}
                  transparent
                  animationType="slide"
                >
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                      <Picker
                        itemStyle={{
                          color: '#000',
                          fontSize: 16,
                        }}
                        selectedValue={actualLocationId ?? -1}
                        onValueChange={(value) => {
                          if (value !== -1) setActualLocationId(value);
                        }}
                      >
                        <Picker.Item label="-- Select Location --" value={-1} />
                        {locations.map((loc) => (
                          <Picker.Item
                            key={loc.id}
                            label={loc.name}
                            value={loc.id}
                          />
                        ))}
                      </Picker>

                      <Pressable
                        style={styles.doneButton}
                        onPress={() => setShowLocationPicker(false)}
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
                  selectedValue={actualLocationId}
                  onValueChange={(value) => setActualLocationId(value)}
                >
                  <Picker.Item label="-- Select Location --" value={null} />
                  {locations.map((loc) => (
                    <Picker.Item key={loc.id} label={loc.name} value={loc.id} />
                  ))}
                </Picker>
              </View>
            )}

            {/* Select New Duty */}
            <Text style={styles.filterLabel}>Select New Duty:</Text>

            {Platform.OS === 'ios' ? (
              <>
                <Pressable
                  style={styles.iosPickerButton}
                  onPress={() => setShowDutyPicker(true)}
                >
                  <Text style={styles.iosPickerText}>
                    {actualDuty || '-- Select Duty --'}
                  </Text>
                </Pressable>

                <Modal
                  visible={showDutyPicker}
                  transparent
                  animationType="slide"
                >
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                      <Picker
                        itemStyle={{
                          color: '#000',
                          fontSize: 16,
                        }}
                        selectedValue={actualDuty ?? ''}
                        onValueChange={(value) =>
                          setActualDuty(
                            value as
                              | 'HNST'
                              | 'ADVO'
                              | 'ExEv'
                              | 'Office'
                              | 'Parti'
                              | 'Faci'
                              | 'HOLI'
                              | 'PL'
                              | 'Other'
                              | 'NONE'
                              | null
                          )
                        }
                      >
                        {/* | 'HNST'
                        | 'ADVO'
                        | 'ExEv'
                        | 'Office'
                        | 'Parti'
                        | 'Faci'
                        | 'HOLI'
                        | 'PL'
                        | 'Other'
                        > = {
                        'HNST Visit': 'HNST',
                        Advocation: 'ADVO',
                        'External Evaluation': 'ExEv',
                        'Zone/Division Office': 'Office',
                        Participate: 'Parti',
                        Facilitation: 'Faci',
                        Holiday: 'HOLI',
                        'Personal Leave': 'PL',
                        Others: 'Other',*/}
                        <Picker.Item label="-- Select Duty --" value="" />
                        <Picker.Item label="HNST Visit" value="HNST" />
                        <Picker.Item label="Advocation" value="ADVO" />
                        <Picker.Item label="External Evaluatio" value="ExEv" />
                        <Picker.Item
                          label="one/Division Office"
                          value="Office"
                        />
                        <Picker.Item label="Participate" value="Parti" />
                        <Picker.Item label="Facilitation" value="Faci" />
                        <Picker.Item label="Holiday" value="HOLI" />
                        <Picker.Item label="personal Leave" value="PL" />
                        <Picker.Item label="Others" value="Other" />
                      </Picker>

                      <Pressable
                        style={styles.doneButton}
                        onPress={() => setShowDutyPicker(false)}
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
                  selectedValue={actualDuty}
                  onValueChange={(value) =>
                    setActualDuty(
                      value as
                        | 'HNST'
                        | 'ADVO'
                        | 'ExEv'
                        | 'Office'
                        | 'Parti'
                        | 'Faci'
                        | 'HOLI'
                        | 'PL'
                        | 'Other'
                        | 'NONE'
                        | null
                    )
                  }
                >
                  <Picker.Item label="-- Select Duty --" value="" />
                  <Picker.Item label="HNST Visit" value="HNST" />
                  <Picker.Item label="Advocation" value="ADVO" />
                  <Picker.Item label="External Evaluatio" value="ExEv" />
                  <Picker.Item label="one/Division Office" value="Office" />
                  <Picker.Item label="Participate" value="Parti" />
                  <Picker.Item label="Facilitation" value="Faci" />
                  <Picker.Item label="Holiday" value="HOLI" />
                  <Picker.Item label="personal Leave" value="PL" />
                  <Picker.Item label="Others" value="Other" />
                </Picker>
              </View>
            )}
          </View>
        )}
        {/* Observations */}
        <Text style={styles.sectionTitle}>Observations</Text>
        <TextInput
          style={[styles.textArea, { height: 100 }]}
          placeholder="Enter your observations..."
          value={observations}
          onChangeText={setObservations}
          multiline
        />
        {/* Assessments
        <Text style={styles.sectionTitle}>Assessments</Text>
        <TextInput
          style={[styles.textArea, { height: 100 }]}
          placeholder="Enter your assessments..."
          value={assessments}
          onChangeText={setAssessments}
          multiline
        /> */}
        {/* Upload */}
        <Text style={styles.sectionTitle}>Supporting Evidence</Text>
        <Pressable
          style={[styles.uploadButton, { backgroundColor: '#B3E5FC' }]}
          onPress={pickImage}
        >
          <Icon
            name="camera-outline"
            type="material-community"
            color="#1565C0"
            size={24}
          />
          <Text style={[styles.uploadButtonText, { color: '#1565C0' }]}>
            Upload Photos
          </Text>
        </Pressable>
        <Pressable
          style={[styles.uploadButton, { backgroundColor: '#B3E5FC' }]}
          onPress={pickDocument}
        >
          <Icon
            name="file-document-outline"
            type="material-community"
            color="#1565C0"
            size={24}
          />
          <Text style={[styles.uploadButtonText, { color: '#1565C0' }]}>
            Upload Documents
          </Text>
        </Pressable>
        {/* File List */}
        <View style={styles.fileList}>
          {uploadedFiles.map((file) => (
            <FileItem key={file.id} file={file} onRemove={handleRemoveFile} />
          ))}
        </View>
        {/* Buttons */}
        <View style={styles.buttonGroup}>
          <Pressable
            style={[styles.actionButton, styles.submitButton]}
            onPress={submitReport}
          >
            <Text style={styles.submitButtonText}>Submit Report</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

/* ---------- Styles ---------- */
const PRIMARY_COLOR = '#1976D2';

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  backIcon: { marginRight: 10 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#fff' },
  container: { padding: 15 },
  detailCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  detailLabel: { color: '#555' },
  detailValue: { fontWeight: 'bold' },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 8,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  uploadButtonText: { fontSize: 16, fontWeight: '600', marginLeft: 10 },
  fileList: { marginVertical: 10 },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  fileName: { flex: 1, paddingLeft: 8 },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionButton: { flex: 1, padding: 15, borderRadius: 8, alignItems: 'center' },
  submitButton: { backgroundColor: '#4CAF50' },
  submitButtonText: { color: '#fff', fontWeight: '600' },
  filterContainer: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    padding: 1,
    //borderRadius: 12,
    //backgroundColor: '#fefefe',
    //shadowColor: '#000',
    //shadowOffset: { width: 0, height: 2 },
    //shadowOpacity: 0.1,
    //shadowRadius: 4,
    //elevation: 3,
  },

  filterLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
    color: '#333',
  },

  pickerWrapper: {
    backgroundColor: '#f5f5f5',
    borderRadius: 7,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#1976d2',
    marginBottom: 8,
  },

  pickerStyle: {
    height: 30,
    color: '#020304',
    fontSize: 15,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },

  iosPickerButton: {
    borderWidth: 2,
    borderColor: '#1976D2',
    borderRadius: 8,
    padding: 14,
  },
  iosPickerText: {
    fontSize: 16,
    color: '#000000',
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(60, 60, 60, 0.3)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
  },
  doneButton: {
    alignItems: 'center',
    padding: 14,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  doneText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
  },
});

export default MonitoringReportForm;
