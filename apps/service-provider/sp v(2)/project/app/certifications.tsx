import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ArrowLeft, Upload } from 'lucide-react-native';

export default function Certifications() {
  const router = useRouter();
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await AsyncStorage.getItem('registrationData');
        if (!data) {
          Alert.alert('Session expired', 'Please start registration again');
          router.replace('/registration');
          return;
        }
        const parsed = JSON.parse(data);
        setEmail(parsed.email);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  const pickFile = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.6
      });
      if (!res.canceled && res.assets.length > 0) {
        setFiles(prev => [...prev, res.assets[0].uri]);
      }
    } catch (err) {
      console.error('Pick error', err);
      Alert.alert('Error', 'Failed to pick file');
    }
  };

  const handleUploadAndFinish = async () => {
    if (!email) {
      Alert.alert('Error', 'No email found for session');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('email', email);

      for (let i = 0; i < files.length; i++) {
        const uri: string = files[i];
        const filename = uri.split('/').pop() || `file_${i}`;
        const ext = filename.split('.').pop() || 'jpg';
        data.append('certifications', {
          uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
          name: `cert_${Date.now()}_${i}.${ext}`,
          type: `image/${ext === 'jpg' ? 'jpeg' : ext}`
        } as any);
      }      await axios.post('http://localhost:5004/api/update-certifications', data, {
        headers: { Accept: 'application/json' },
        transformRequest: (d) => d
      });

      // Finalize registration
      await axios.post('http://localhost:5004/api/finalize-registration', { email });

      Alert.alert('Success', 'Certifications uploaded successfully. Now let\'s secure your account.');
      // Navigate to password setup screen
      await AsyncStorage.setItem('registrationEmail', email);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Cert upload error', err.response?.data || err.message);
      Alert.alert('Error', err.response?.data?.message || 'Failed to complete registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ArrowLeft size={24} color="#19034d" />
      </TouchableOpacity>

      <Text style={styles.title}>Upload Certifications (optional)</Text>

      <ScrollView style={{ flex: 1 }}>
        <TouchableOpacity style={styles.uploadButton} onPress={pickFile}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Upload size={18} color="#19034d" />
            <Text style={styles.uploadText}>Select Certificate Image</Text>
          </View>
        </TouchableOpacity>
        {files.map((uri: string, idx: number) => (
          <View key={uri + idx} style={styles.previewRow}>
            <Image source={{ uri }} style={styles.previewImage} />
            <Text numberOfLines={1} style={styles.previewName}>{uri.split('/').pop() || `File ${idx}`}</Text>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={[styles.nextButton, loading && { opacity: 0.7 }]} onPress={handleUploadAndFinish} disabled={loading}>
        {loading ? <ActivityIndicator color="#19034d" /> : <Text style={styles.nextButtonText}>Finish Registration</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 24, paddingTop: 50 },
  backButton: { marginBottom: 10, width: 40 },
  title: { fontSize: 22, fontWeight: '800', color: '#19034d', marginBottom: 16 },
  uploadButton: { borderWidth: 1, borderColor: '#19034d', borderRadius: 10, padding: 14, marginBottom: 12, backgroundColor: '#f9f9f9' },
  uploadText: { color: '#19034d', fontWeight: '700' },
  previewRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  previewImage: { width: 60, height: 60, borderRadius: 6 },
  previewName: { flex: 1, color: '#333' },
  nextButton: { backgroundColor: '#05f51d', padding: 16, borderRadius: 12, alignItems: 'center', marginVertical: 20 },
  nextButtonText: { fontSize: 16, fontWeight: '600', color: '#19034d' }
});
