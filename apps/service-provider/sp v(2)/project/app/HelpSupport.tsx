import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Send } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function HelpSupport() {
  const router = useRouter();
  const [subject, setSubject] = useState('');
  const [reason, setReason] = useState('');
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);

  const reasons = ['App Issue', 'Payment Problem', 'Account Concern', 'Feature Request', 'Other'];

  const handleSubmit = async () => {
    if (!subject.trim() || !reason || !explanation.trim()) {
      Alert.alert('Error', 'Please fill in all fields before submitting.');
      return;
    }

    setLoading(true);
    try {
      // Get user email from AsyncStorage
      const regData = await AsyncStorage.getItem('registrationData');
      if (!regData) {
        Alert.alert('Error', 'User session not found. Please login again.');
        setLoading(false);
        return;
      }

      const parsed = JSON.parse(regData);
      const userEmail = parsed.email;

      console.log('Submitting help request...');

      // Send to backend
      const response = await axios.post('http://localhost:5004/api/submit-help-request', {
        email: userEmail,
        subject: subject.trim(),
        reason: reason,
        explanation: explanation.trim(),
        timestamp: new Date().toISOString()
      });

      console.log(' Response:', response.data);

      if (response.data.success) {
        // Clear fields IMMEDIATELY after successful save
        console.log(' Clearing form fields...');
        setSubject('');
        setReason('');
        setExplanation('');
        setLoading(false);

        Alert.alert(
          ' Complaint Submitted Successfully',
          `Your complaint regarding "${subject}" has been submitted successfully.\n\nReason: ${reason}\n\nOur support team will review your complaint and get back to you soon.`,
          [{ text: 'OK', onPress: () => {
            router.back();
          }}]
        );
      } else {
        setLoading(false);
        Alert.alert('Error', response.data.message || 'Failed to submit complaint.');
      }
    } catch (err) {
      setLoading(false);
      console.error(' Error submitting complaint:', err);
      Alert.alert('Error', err.response?.data?.message || err.message || 'Failed to submit complaint. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Keyboard Avoiding Wrapper */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Submit a Complaint</Text>
          <Text style={styles.subtitle}>Let us know what issue you’re facing</Text>

          {/* Subject */}
          <Text style={styles.label}>Subject</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter subject"
            value={subject}
            onChangeText={setSubject}
          />

          {/* Reason */}
          <Text style={styles.label}>Reason</Text>
          <View style={styles.reasonContainer}>
            {reasons.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.reasonButton,
                  reason === item && styles.reasonButtonActive,
                ]}
                onPress={() => setReason(item)}
              >
                <Text
                  style={[
                    styles.reasonText,
                    reason === item && styles.reasonTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Explanation */}
          <Text style={styles.label}>Explanation</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Please describe your issue in detail..."
            value={explanation}
            onChangeText={setExplanation}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />

          <TouchableOpacity 
            style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            <Send size={18} color="#19034d" />
            <Text style={styles.submitText}>{loading ? 'Submitting...' : 'Submit Complaint'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#19034d',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#fff' },
  content: { padding: 24 },
  title: { fontSize: 22, fontWeight: '700', color: '#19034d', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
  label: { fontSize: 14, color: '#19034d', marginBottom: 6, fontWeight: '500' },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    padding: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  textArea: { height: 120 },
  reasonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  reasonButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  reasonButtonActive: {
    backgroundColor: '#05f51d',
    borderColor: '#05f51d',
  },
  reasonText: { color: '#333', fontSize: 14 },
  reasonTextActive: { color: '#19034d', fontWeight: '600' },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#05f51d',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
    marginBottom: 30,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#19034d',
  },
});
