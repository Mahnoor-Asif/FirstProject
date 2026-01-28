import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

// Enable smooth animations on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function FAQScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('faq');
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [faqList, setFaqList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newQuestion, setNewQuestion] = useState('');

  // Backend URL
  const FAQ_URL = 'http://192.168.1.7:5000/api/faqs';

  // Fetch FAQs
  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(FAQ_URL);
      setFaqList(response.data || []); // Ensure array
    } catch (error) {
      console.error('Error fetching FAQs:', error.message);
      Alert.alert('Error', 'Unable to fetch FAQs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Submit a new question
  const handleAskQuestion = async () => {
    if (!newSubject.trim() || !newQuestion.trim()) {
      Alert.alert('Error', 'Please fill in both fields.');
      return;
    }

    try {
      setSubmitting(true);
      const response = await axios.post(FAQ_URL, {
        subject: newSubject,
        question: newQuestion,
      });

      if (response.status === 201 || response.status === 200) {
        Alert.alert('✅ Success', 'Your question has been submitted successfully!');
        setFaqList(prev => [response.data, ...prev]);
        setNewSubject('');
        setNewQuestion('');
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Submit error:', error.message);
      Alert.alert('Error', 'Unable to submit your question. Try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  // Expand/collapse FAQ
  const toggleExpand = index => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FAQs & Support</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'faq' && styles.activeTab]}
          onPress={() => setActiveTab('faq')}
        >
          <Text style={[styles.tabText, activeTab === 'faq' && styles.activeTabText]}>
            FAQs
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'ask' && styles.activeTab]}
          onPress={() => setActiveTab('ask')}
        >
          <Text style={[styles.tabText, activeTab === 'ask' && styles.activeTabText]}>
            Ask Question
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'faq' ? (
          loading ? (
            <ActivityIndicator size="large" color="#19034d" style={{ marginTop: 40 }} />
          ) : faqList.length > 0 ? (
            faqList.map((faq, index) => (
              <View key={faq._id ?? index} style={styles.faqCard}>
                <TouchableOpacity onPress={() => toggleExpand(index)}>
                  <Text style={styles.faqQuestion}>Q: {faq.question}</Text>
                </TouchableOpacity>
                {expandedIndex === index && (
                  <Text style={styles.faqAnswer}>
                    A: {faq.answer ?? 'No answer yet (Pending response)'}
                  </Text>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.noFaqsText}>No FAQs available</Text>
          )
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
              style={styles.submitButton}
              onPress={handleAskQuestion}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#19034d" />
              ) : (
                <Text style={styles.submitButtonText}>Submit</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fc' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#19034d',
    paddingTop: 60,
    paddingBottom: 18,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
  tabContainer: { flexDirection: 'row', backgroundColor: '#e8e8e8', borderRadius: 12, marginHorizontal: 20, marginTop: 20 },
  tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 12 },
  activeTab: { backgroundColor: '#05f51d' },
  tabText: { color: '#666', fontWeight: '500' },
  activeTabText: { color: '#19034d', fontWeight: '700' },
  content: { paddingHorizontal: 24, paddingBottom: 50 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#19034d', marginVertical: 14 },
  faqCard: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginVertical: 6, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  faqQuestion: { fontWeight: '600', fontSize: 15, color: '#19034d' },
  faqAnswer: { marginTop: 6, color: '#333', fontSize: 14 },
  noFaqsText: { textAlign: 'center', marginTop: 20, color: '#999' },
  input: { backgroundColor: '#fff', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#ddd', fontSize: 15, marginBottom: 10, color: '#333' },
  submitButton: { backgroundColor: '#05f51d', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 10, marginBottom: 25 },
  submitButtonText: { color: '#19034d', fontWeight: '700', fontSize: 16 },
});
