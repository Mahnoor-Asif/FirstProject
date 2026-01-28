import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, 
  Image, Alert, StyleSheet, Platform, ActivityIndicator 
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Upload, ArrowLeft, CheckCircle2 } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function Registration() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    profilePhoto: '', name: '', email: '', contactNumber: '', cnicNumber: '',
    cnicFront: '', cnicBack: '', criminalClearance: ''
  });

  // Request permissions on mount
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') Alert.alert('Permission required', 'Camera roll access needed.');
      }
    })();
  }, []);

  const pickImage = async (field) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: field === 'profilePhoto' ? [1, 1] : [4, 3],
        quality: 0.5,
      });

      if (!result.canceled && result.assets.length > 0) {
        setFormData({ ...formData, [field]: result.assets[0].uri });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image.');
    }
  };

  const handleNext = async () => {
    const { profilePhoto, name, email, contactNumber, cnicNumber, cnicFront, cnicBack } = formData;

    // Validation
    if (!profilePhoto || !name || !email || !contactNumber || !cnicNumber || !cnicFront || !cnicBack) {
      Alert.alert('Missing Information', 'Please fill all required fields and upload images.');
      return;
    }

    setLoading(true);

    try {
      console.log(' Starting registration...');
      const data = new FormData();

      // Add text fields - ensure they're strings
      data.append('name', String(name));
      data.append('email', String(email.toLowerCase().trim()));
      data.append('password', String('DefaultPass@123'));
      data.append('contactNumber', String(contactNumber));
      data.append('cnicNumber', String(cnicNumber));

      // Add files
      const appendFile = async (key: string, uri: string) => {
        if (!uri) return;
        try {
          console.log(` Adding ${key}...`);
          const response = await fetch(uri);
          if (!response.ok) throw new Error(`Failed to fetch file: ${response.status}`);
          const blob = await response.blob();
          data.append(key, blob, `${key}.jpg`);
          console.log(` ${key} added (${blob.size} bytes, type: ${blob.type})`);
        } catch (err) {
          console.error(`Error adding ${key}:`, err);
          throw err;
        }
      };

      await appendFile('profilePhoto', profilePhoto);
      await appendFile('cnicFront', cnicFront);
      await appendFile('cnicBack', cnicBack);
      if (formData.criminalClearance) {
        await appendFile('criminalClearance', formData.criminalClearance);
      }

      console.log(' Sending registration...');
      const res = await axios.post('http://localhost:5004/api/signup', data);

      console.log(' Response:', res.data);

      if (res.data?.success) {
        const saved = { 
          ...formData, 
          email: formData.email.toLowerCase().trim(), 
          providerId: res.data.providerId || null 
        };
        
        await AsyncStorage.setItem('registrationData', JSON.stringify(saved));
        await AsyncStorage.setItem('registrationPassword', 'DefaultPass@123');
        
        console.log(' Registration successful!');
        console.log(' Navigating to skills-selection...');
        setLoading(false);
        
        // Show success message and navigate
        Alert.alert('Success', 'Profile created successfully!', [
          {
            text: 'OK',
            onPress: () => {
              console.log(' Navigating now...');
              router.replace('/skills-selection');
            }
          }
        ], { cancelable: false });
        
        // Fallback navigation in case Alert doesn't work in web
        setTimeout(() => {
          console.log(' Fallback navigation triggered');
          router.replace('/skills-selection');
        }, 1500);
      } else {
        throw new Error(res.data?.message || 'Registration failed');
      }
    } catch (err: any) {
      console.error(' Registration error:', err.message);
      if (err.response?.data) {
        console.error('Backend error:', err.response.data);
      }
      setLoading(false);
      Alert.alert('Error', err.response?.data?.message || err.message || 'Unable to register');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ArrowLeft size={24} color="#19034d" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>Provider Registration</Text>
        <Text style={styles.subtitle}>Complete your profile to get started</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Photo Upload */}
        <TouchableOpacity style={styles.photoUpload} onPress={() => pickImage('profilePhoto')}>
          {formData.profilePhoto ? (
            <Image source={{ uri: formData.profilePhoto }} style={styles.photoPreview} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Camera size={32} color="#666" />
              <Text style={styles.photoUploadText}>Upload Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Form Inputs */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput style={styles.input} placeholder="John Doe" onChangeText={t => setFormData({ ...formData, name: t })} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address *</Text>
          <TextInput style={styles.input} placeholder="email@example.com" keyboardType="email-address" autoCapitalize="none" onChangeText={t => setFormData({ ...formData, email: t })} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contact Number *</Text>
          <TextInput style={styles.input} placeholder="03XXXXXXXXX" keyboardType="phone-pad" onChangeText={t => setFormData({ ...formData, contactNumber: t })} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>CNIC Number *</Text>
          <TextInput style={styles.input} placeholder="42XXXXXXXXXXX" keyboardType="numeric" onChangeText={t => setFormData({ ...formData, cnicNumber: t })} />
        </View>

        <Text style={styles.sectionTitle}>Required Documents</Text>

        {/* Document Buttons */}
        {['cnicFront', 'cnicBack', 'criminalClearance'].map((f) => (
          <TouchableOpacity 
            key={f} 
            style={[styles.uploadButton, formData[f] && styles.uploadButtonActive]} 
            onPress={() => pickImage(f)}
          >
            <View style={styles.uploadButtonLeft}>
              <Upload size={18} color={formData[f] ? "#05f51d" : "#19034d"} />
              <Text style={[styles.uploadButtonText, formData[f] && styles.uploadButtonTextActive]}>
                {f === 'cnicFront' ? 'CNIC Front Side' : f === 'cnicBack' ? 'CNIC Back Side' : 'Criminal Clearance (Opt)'}
              </Text>
            </View>
            {formData[f] && <CheckCircle2 size={18} color="#05f51d" />}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.nextButton, loading && styles.nextButtonDisabled]} 
          onPress={handleNext} 
          disabled={loading}
          activeOpacity={loading ? 1 : 0.7}
        >
          {loading ? (
            <>
              <ActivityIndicator color="#19034d" />
              <Text style={[styles.nextButtonText, { marginTop: 8 }]}>Processing...</Text>
            </>
          ) : (
            <Text style={styles.nextButtonText}>Create Account & Next</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 24, paddingTop: 50 },
  backButton: { width: 40, height: 40, justifyContent: 'center', marginBottom: 10 },
  header: { marginBottom: 25 },
  title: { fontSize: 26, fontWeight: '800', color: '#19034d' },
  subtitle: { fontSize: 15, color: '#666', marginTop: 4 },
  scrollView: { flex: 1 },
  photoUpload: { width: 110, height: 110, borderRadius: 55, backgroundColor: '#f7f7f7', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 25, overflow: 'hidden', borderWidth: 1, borderColor: '#eee' },
  photoPlaceholder: { alignItems: 'center' },
  photoPreview: { width: '100%', height: '100%' },
  photoUploadText: { fontSize: 11, color: '#888', marginTop: 4, fontWeight: '600' },
  inputGroup: { marginBottom: 18 },
  label: { fontSize: 13, fontWeight: '700', color: '#19034d', marginBottom: 6, marginLeft: 2 },
  input: { backgroundColor: '#f9f9f9', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, borderWidth: 1, borderColor: '#efefef' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#19034d', marginTop: 10, marginBottom: 15 },
  uploadButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#19034d', borderRadius: 10, paddingVertical: 14, paddingHorizontal: 16, marginBottom: 12, borderStyle: 'dashed' },
  uploadButtonActive: { borderColor: '#05f51d', backgroundColor: '#f0fff4', borderStyle: 'solid' },
  uploadButtonLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  uploadButtonText: { fontSize: 14, color: '#19034d', fontWeight: '600' },
  uploadButtonTextActive: { color: '#2d6a4f' },
  footer: { paddingVertical: 20, backgroundColor: '#fff' },
  nextButton: { backgroundColor: '#05f51d', paddingVertical: 16, borderRadius: 14, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  nextButtonDisabled: { backgroundColor: '#ccc', opacity: 0.6 },
  nextButtonText: { fontSize: 17, fontWeight: '800', color: '#19034d' },
});