import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Enable smooth animation for accordion on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function FAQScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'faq' | 'ask'>('faq');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const [faqList] = useState([
    { question: 'How can I reset my password?', answer: 'Go to Profile → Change Password → Enter your new password and confirm.' },
    { question: 'How do I update my profile photo?', answer: 'Tap on your profile photo in the Profile screen and choose a new image from your gallery or camera.' },
    { question: 'Can I change my registered email address?', answer: 'Currently, you can’t change your email address. Please contact support if you need help.' },
    { question: 'How do I delete my account?', answer: 'You can request account deletion from the Privacy & Security settings page.' },
    { question: 'Why am I not receiving notifications?', answer: 'Check your app notification settings and make sure permissions are enabled in your phone settings.' },
    { question: 'How can I report a bug or issue?', answer: 'Go to Help & Support → Submit a Complaint and describe the issue in detail.' },
    { question: 'Is my data safe on this app?', answer: 'Yes. We follow strict privacy and security protocols to keep your data secure.' },
    { question: 'How can I contact customer support?', answer: 'Go to Help & Support from Settings and submit your query or complaint.' },
    { question: 'Can I use this app offline?', answer: 'Some features require an internet connection, but basic functions may work offline.' },
    { question: 'How do I update the app?', answer: 'Visit the App Store or Google Play Store and check for updates under this app’s page.' },
    { question: 'Why is my location not updating?', answer: 'Ensure location permissions are granted and GPS is turned on in your device settings.' },
    { question: 'Can I use the app on multiple devices?', answer: 'Yes, you can log in using the same account on multiple devices.' },
    { question: 'What should I do if I forget my password?', answer: 'Tap “Forgot Password” on the login screen and follow the on-screen steps to reset it.' },
    { question: 'How can I change my phone number?', answer: 'Go to Profile → Edit Profile → Update your phone number and save changes.' },
    { question: 'What happens when I log out?', answer: 'You will be signed out of the app, and you’ll need to log in again to access your data.' },
  ]);

  const [newSubject, setNewSubject] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [userQuestions, setUserQuestions] = useState([]);

  const handleAskQuestion = async () => {
    if (!newSubject.trim() || !newQuestion.trim()) {
      Alert.alert('Error', 'Please fill in both the subject and question.');
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

      console.log(' Submitting FAQ question...');

      // Send to backend
      const response = await axios.post('http://localhost:5004/api/submit-faq-question', {
        email: userEmail,
        subject: newSubject.trim(),
        question: newQuestion.trim()
      });

      console.log(' Response:', response.data);

      if (response.data.success) {
        // Add to local list
        const newEntry = { subject: newSubject, question: newQuestion };
        setUserQuestions([...userQuestions, newEntry]);
        
        // Clear fields
        setNewSubject('');
        setNewQuestion('');
        setLoading(false);

        Alert.alert(
          ' Question Submitted Successfully',
          `Your question "${newSubject}" has been submitted.\n\nOur team will review and answer your question soon.`,
          [{ text: 'OK' }]
        );
      } else {
        setLoading(false);
        Alert.alert('Error', response.data.message || 'Failed to submit question.');
      }
    } catch (err) {
      setLoading(false);
      console.error(' Error submitting FAQ question:', err);
      Alert.alert('Error', err.response?.data?.message || err.message || 'Failed to submit question. Please try again.');
    }
  };

  const toggleExpand = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FAQ & Support</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'faq' && styles.activeTab]}
          onPress={() => setActiveTab('faq')}
        >
          <Text style={[styles.tabText, activeTab === 'faq' && styles.activeTabText]}>FAQs</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'ask' && styles.activeTab]}
          onPress={() => setActiveTab('ask')}
        >
          <Text style={[styles.tabText, activeTab === 'ask' && styles.activeTabText]}>Ask a Question</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'faq' ? (
          <>
            {faqList.map((faq, index) => (
              <View key={index} style={styles.faqItem}>
                <TouchableOpacity onPress={() => toggleExpand(index)}>
                  <Text style={styles.faqQuestion}>Q: {faq.question}</Text>
                </TouchableOpacity>
                {expandedIndex === index && (
                  <Text style={styles.faqAnswer}>A: {faq.answer}</Text>
                )}
              </View>
            ))}
          </>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Ask a Question</Text>
            <TextInput
              style={styles.input}
              placeholder="Subject"
              value={newSubject}
              onChangeText={setNewSubject}
              placeholderTextColor="#999"
            />
            <TextInput
              style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
              placeholder="Type your question..."
              value={newQuestion}
              onChangeText={setNewQuestion}
              placeholderTextColor="#999"
              multiline
            />
            <TouchableOpacity 
              style={[styles.saveButton, loading && styles.saveButtonDisabled]} 
              onPress={handleAskQuestion}
              disabled={loading}
            >
              <Text style={styles.saveButtonText}>{loading ? 'Submitting...' : 'Submit Question'}</Text>
            </TouchableOpacity>

            {userQuestions.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Your Questions</Text>
                {userQuestions.map((q, index) => (
                  <View key={index} style={styles.userQuestionItem}>
                    <Text style={styles.userQuestionSubject}>📌 {q.subject}</Text>
                    <Text style={styles.userQuestionText}>{q.question}</Text>
                  </View>
                ))}
              </>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#19034d',
  },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#fff' },

  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabText: { fontSize: 16, color: '#555' },
  activeTab: { backgroundColor: '#05f51d' },
  activeTabText: { color: '#19034d', fontWeight: '600' },

  content: { paddingHorizontal: 24, paddingBottom: 40 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#19034d', marginVertical: 12 },
  faqItem: {
    backgroundColor: '#f8f9fa',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  faqQuestion: { fontWeight: '600', color: '#19034d', fontSize: 15 },
  faqAnswer: { color: '#555', fontSize: 14, marginTop: 6 },

  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    fontSize: 15,
    marginBottom: 10,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#05f51d',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 25,
  },
  saveButtonDisabled: {
    backgroundColor: '#999',
    opacity: 0.6,
  },
  saveButtonText: { fontSize: 16, fontWeight: '600', color: '#19034d' },

  userQuestionItem: { backgroundColor: '#eef7ff', padding: 12, borderRadius: 10, marginVertical: 6 },
  userQuestionSubject: { fontWeight: '700', color: '#19034d' },
  userQuestionText: { color: '#333', marginTop: 4 },
});
