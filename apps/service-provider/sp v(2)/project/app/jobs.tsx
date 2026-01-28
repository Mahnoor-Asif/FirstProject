import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, X, Bell, CheckCircle } from 'lucide-react-native';
// import axios from 'axios';
// import { io } from 'socket.io-client';
// import { JobCard } from '@/components/JobCard';

// Job interface
interface Job {
  id: string;
  category: string;
  subcategory: string;
  description: string;
  location: string;
  customerName: string;
  price: number;
  photos: string[];
  time?: string;
  date?: string | null;
}

export default function JobsScreen() {
  const router = useRouter();
  const [incomingJobs, setIncomingJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedCancelReason, setSelectedCancelReason] = useState<string | null>(null);

  const cancelReasons = [
    'Change of plan',
    'Found another provider',
    'Provider is late',
    'Wrong location',
    'Emergency came up',
    'Price too high',
    'Other',
  ];

  // 🟡 Dummy data
  const dummyJobs: Job[] = [
    {
      id: '1',
      category: 'Electrician',
      subcategory: 'Fan Installation',
      description: 'Install ceiling fan in bedroom',
      location: 'Main Road Airport society',
      customerName: 'Hajra Rizwan',
      price: 500,
      photos: [],
      date: '2025-11-12',
      time: '2:30 PM',
    },
    {
      id: '2',
      category: 'Plumber',
      subcategory: 'Pipe Leak Fix',
      description: 'Fix water leakage under kitchen sink',
      location: 'House 25, G-9/3, Islamabad',
      customerName: 'Fatima Noor',
      price: 500,
      photos: [],
      date: '2025-11-13',
      time: '11:00 AM',
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setIncomingJobs(dummyJobs);
      setLoading(false);
    }, 1000);
  }, []);

  // Job actions
  const handleJobAction = (action: string, jobId: string) => {
    const job = incomingJobs.find((j) => j.id === jobId);

    switch (action) {
      case 'accept':
        Alert.alert('Job Accepted', `You accepted job: ${job?.subcategory}`);
        router.push({
          pathname: '/job-tracking',
          params: { job: JSON.stringify(job) },
        });
        break;

      case 'reject':
        Alert.alert('Job Rejected', `You rejected job: ${job?.subcategory}`);
        setIncomingJobs((prev) => prev.filter((j) => j.id !== jobId));
        break;

      case 'viewDetails':
        Alert.alert('Job Details', `Viewing details for ${job?.subcategory}`);
        break;

      case 'chat':
        router.push('/chat');
        break;

      default:
        break;
    }
  };

  // Cancel modal
  const handleCancelJob = (job: Job) => {
    setSelectedJob(job);
    setShowCancelModal(true);
  };

  const selectCancelReason = (reason: string) => {
    setSelectedCancelReason((prev) => (prev === reason ? null : reason));
  };

  const handleCancelConfirm = () => {
    if (!selectedCancelReason) {
      Alert.alert('Error', 'Please select a reason for cancellation');
      return;
    }

    setShowCancelModal(false);
    Alert.alert('Booking Cancelled', `Reason: ${selectedCancelReason}`);
    setIncomingJobs((prev) => prev.filter((j) => j.id !== selectedJob?.id));
    setSelectedCancelReason(null);
    setSelectedJob(null);
  };

  // ✅ FIXED: renderJobsList now correctly returns content
  const renderJobsList = () => {
    if (loading)
      return <ActivityIndicator size="large" color="#19034d" style={{ marginTop: 50 }} />;
    if (error)
      return <Text style={styles.errorText}>{error}</Text>;

    if (incomingJobs.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No incoming jobs</Text>
          <Text style={styles.emptySubtitle}>New job requests will appear here</Text>
        </View>
      );
    }

    return (
      <View style={styles.jobsList}>
        {incomingJobs.map((job) => (
          <View key={job.id} style={styles.jobCard}>
            <Text style={styles.jobTitle}>{job.subcategory}</Text>
            <Text style={styles.jobDetail}>{job.description}</Text>
            <Text style={styles.jobDetail}>📍 {job.location}</Text>
            <Text style={styles.jobDetail}>👤 {job.customerName}</Text>
            <Text style={styles.jobPrice}>PKR {job.price}</Text>

            <View style={styles.jobActions}>
              <TouchableOpacity
                style={[styles.jobButton, { backgroundColor: '#05f51d' }]}
                onPress={() => handleJobAction('accept', job.id)}>
                <Text style={styles.jobButtonText}>Accept</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.jobButton, { backgroundColor: '#ef4444' }]}
                onPress={() => handleCancelJob(job)}>
                <Text style={styles.jobButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Incoming Jobs</Text>
        <TouchableOpacity onPress={() => router.push('/notifications')} style={styles.headerIcon}>
          <Bell size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderJobsList()}
      </ScrollView>

      {/* Cancel Modal */}
      <Modal visible={showCancelModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cancel Booking</Text>
              <TouchableOpacity onPress={() => setShowCancelModal(false)}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>Select a reason for cancellation:</Text>

            <ScrollView style={styles.reasonsList}>
              {cancelReasons.map((reason, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.reasonItem,
                    selectedCancelReason === reason && styles.selectedReason,
                  ]}
                  onPress={() => selectCancelReason(reason)}
                >
                  <Text
                    style={[
                      styles.reasonText,
                      selectedCancelReason === reason && styles.selectedReasonText,
                    ]}
                  >
                    {reason}
                  </Text>
                  {selectedCancelReason === reason && <CheckCircle size={16} color="#05f51d" />}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.confirmCancelButton} onPress={handleCancelConfirm}>
              <Text style={styles.confirmCancelText}>Confirm Cancellation</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ✅ Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#19034d',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  headerIcon: { marginTop: 25 },
  title: { color: '#FFFFFF', fontSize: 20, fontWeight: '700', marginTop: 25 },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
  jobsList: { paddingBottom: 20 },

  jobCard: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  jobTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  jobDetail: { fontSize: 14, color: '#4b5563', marginTop: 4 },
  jobPrice: { fontSize: 15, fontWeight: '700', color: '#19034d', marginTop: 8 },
  jobActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  jobButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  jobButtonText: { color: '#fff', fontWeight: '600' },

  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#4B5563', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#9CA3AF', textAlign: 'center' },

  errorText: { textAlign: 'center', marginTop: 50, color: 'red' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 20, padding: 24, width: '90%', maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#19034d' },
  modalSubtitle: { fontSize: 14, color: '#666', marginVertical: 16 },
  reasonsList: { marginBottom: 16 },
  reasonItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedReason: { backgroundColor: '#f0fff1', borderColor: '#2ecb3eff' },
  reasonText: { fontSize: 14, color: '#333' },
  selectedReasonText: { color: '#05f51d', fontWeight: '600' },
  confirmCancelButton: { backgroundColor: '#dc2626', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  confirmCancelText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});
