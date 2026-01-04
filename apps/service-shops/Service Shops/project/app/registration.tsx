import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Upload, ArrowLeft } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Registration() {
  const [formData, setFormData] = useState({
    profilePhoto: '',
    name: '',
    email: '',
    contactNumber: '',
    cnicNumber: '',
    cnicFront: '',
    cnicBack: '',
    criminalClearance: '',
  });

  const pickImage = async (field: string) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: field === 'profilePhoto' ? [1, 1] : [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setFormData({ ...formData, [field]: result.assets[0].uri });
    }
  };

  const handleNext = async () => {
    if (
      !formData.profilePhoto ||
      !formData.name ||
      !formData.email ||
      !formData.contactNumber ||
      !formData.cnicNumber ||
      !formData.cnicFront ||
      !formData.cnicBack
    ) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    await AsyncStorage.setItem('registrationData', JSON.stringify(formData));
    router.push('/skills-selection');
  };

  return (
    <View style={styles.container}>
      {/* ✅ Same header style as Login */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          if (router.canGoBack()) router.back();
          else router.replace('/'); // fallback
        }}
      >
        <ArrowLeft size={24} color="#19034d" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>Service Shops Registration</Text>
        <Text style={styles.subtitle}>Complete your profile to get started</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <TouchableOpacity style={styles.photoUpload} onPress={() => pickImage('profilePhoto')}>
            {formData.profilePhoto ? (
              <Image source={{ uri: formData.profilePhoto }} style={styles.photoPreview} />
            ) : (
              <>
                <Camera size={40} color="#666" />
                <Text style={styles.photoUploadText}> Profile Photo</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Enter your full name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contact Number *</Text>
            <TextInput
              style={styles.input}
              value={formData.contactNumber}
              onChangeText={(text) => setFormData({ ...formData, contactNumber: text })}
              placeholder="Enter your contact number"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>CNIC Number *</Text>
            <TextInput
              style={styles.input}
              value={formData.cnicNumber}
              onChangeText={(text) => setFormData({ ...formData, cnicNumber: text })}
              placeholder="XXXXX-XXXXXXX-X"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>CNIC Front Image *</Text>
            <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage('cnicFront')}>
              <Upload size={20} color="#19034d" />
              <Text style={styles.uploadButtonText}>
                {formData.cnicFront ? 'Image Selected ✓' : 'Upload CNIC Front'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>CNIC Back Image *</Text>
            <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage('cnicBack')}>
              <Upload size={20} color="#19034d" />
              <Text style={styles.uploadButtonText}>
                {formData.cnicBack ? 'Image Selected ✓' : 'Upload CNIC Back'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Criminal Clearance Certificate (Optional)</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => pickImage('criminalClearance')}
            >
              <Upload size={20} color="#19034d" />
              <Text style={styles.uploadButtonText}>
                {formData.criminalClearance ? 'Certificate Selected ✓' : 'Upload Certificate'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#19034d',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  form: {
    paddingBottom: 20,
  },
  photoUpload: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 30,
    overflow: 'hidden',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
  },
  photoUploadText: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#19034d',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#19034d',
    borderRadius: 8,
    paddingVertical: 12,
    gap: 8,
  },
  uploadButtonText: {
    fontSize: 14,
    color: '#19034d',
    fontWeight: '600',
  },
  footer: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  nextButton: {
    backgroundColor: '#05f51d',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#19034d',
  },
});
