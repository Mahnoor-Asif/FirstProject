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
import Constants from 'expo-constants';
import { ArrowLeft, Send } from 'lucide-react-native';

// ✅ Use API_URL from app.json extra, fallback to local IP if undefined
const API_URL = Constants?.expoConfig?.extra?.API_URL || 'http://192.168.1.5:5000';

export default function HelpSupport() {
  const router = useRouter();
  const [subject, setSubject] = useState('');
  const [reason, setReason] = useState('');
  const [explanation, setExplanation] = useState('');

  const reasons = ['App Issue', 'Payment Problem', 'Account Concern', 'Feature Request', 'Other'];

  const handleSubmit = async () => {
    if (!subject.trim() || !reason || !explanation.trim()) {
      Alert.alert('Error', 'Please fill in all fields before submitting.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/help`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, reason, explanation }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Complaint submitted successfully!');
        setSubject('');
        setReason('');
        setExplanation('');
        router.back();
      } else {
        Alert.alert('Error', data.message || 'Failed to submit complaint.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Cannot connect to backend. Please check your server or IP.');
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

      {/* Content */}
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
                style={[styles.reasonButton, reason === item && styles.reasonButtonActive]}
                onPress={() => setReason(item)}
              >
                <Text style={[styles.reasonText, reason === item && styles.reasonTextActive]}>
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

          {/* Submit */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Send size={18} color="#19034d" />
            <Text style={styles.submitText}>Submit Complaint</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

/////////////////////////////////////////////////////
// 💅 Styles
/////////////////////////////////////////////////////
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
  reasonContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
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
  submitText: { fontSize: 16, fontWeight: '600', color: '#19034d' },
});
