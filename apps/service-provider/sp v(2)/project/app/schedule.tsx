import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
} from 'react-native';
import { X, Eye, CircleCheck as CheckCircle, Bell, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const cancelReasons = [
  'Change of plan',
  'Found another seeker',
  'seeker is late',
  'Wrong location',
  'Emergency came up',
  'Price too high',
  'Other',
];

const scheduledJobs = [
  {
    id: 1,
    service: 'Plumbing',
    subcategory: 'Pipe Repair',
    date: '2025-01-15',
    time: '2:00 PM',
    seeker: 'Mohammad Ali',
    seekerRating: 4.8,
    seekerContact: '0312-5555555',
    location: 'Main-Road Airport Society',
    jobType: 'Scheduled',
    jobDescription: 'Fix water leakage in kitchen pipe.',
    images: ['https://via.placeholder.com/100', 'https://via.placeholder.com/100'],
  },
  // {
  //   id: 2,
  //   service: 'Electrical Work',
  //   subcategory: 'Fan Installation',
  //   date: '2025-01-18',
  //   time: '3:30 PM',
  //   seeker: 'Bilal Khan',
  //   seekerRating: 4.6,
  //   seekerContact: '0300-1111111',
  //   location: '456 Garden Road, Lahore',
  //   jobType: 'Book Now',
  //   jobDescription: 'Install ceiling fan in living room.',
  //   images: [],
  // },
];

export default function ScheduledScreen() {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [selectedCancelReason, setSelectedCancelReason] = useState<string | null>(null);

  const router = useRouter();

  const handleCancelJob = (job: any) => {
    setSelectedJob(job);
    setShowCancelModal(true);
  };

  const openJobDetails = (job: any) => {
    setSelectedJob(job);
    setShowDetailsModal(true);
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
    Alert.alert(
      'Confirm Cancellation',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Booking Cancelled', 'Your booking has been cancelled successfully');
            setSelectedCancelReason(null);
            setSelectedJob(null);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* 🔹 Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scheduled Jobs</Text>
        <TouchableOpacity onPress={() => router.push('/notifications')}>
          <Bell size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {scheduledJobs.map((job) => (
          <View key={job.id} style={styles.jobCard}>
            <View style={styles.jobHeader}>
              <View style={styles.jobTitleSection}>
                <Text style={styles.jobService}>{job.service}</Text>
                <Text style={styles.jobSubcategory}>{job.subcategory}</Text>
              </View>

              <TouchableOpacity onPress={() => openJobDetails(job)}>
                <Eye size={20} color="#19034d" />
              </TouchableOpacity>
            </View>

            <View style={styles.jobDetails}>
              <Text style={styles.detailText}>Date: {job.date}</Text>
              <Text style={styles.detailText}>Time: {job.time}</Text>
              <Text style={styles.detailText}>Location: {job.location}</Text>
              <Text style={styles.detailText}>👤 seeker: {job.seeker}</Text>
            </View>

            <View>
              <Text style={styles.amount}>
                Visit Charges: <Text style={styles.greenText}>PKR 200</Text>
              </Text>

              {/* ✅ Start & Cancel in separate row */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.startButton}
                  onPress={() => router.push('/job-tracking')}
                >
                  <Text style={styles.startButtonText}>Start</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => handleCancelJob(job)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Job Details Modal */}
      <Modal visible={showDetailsModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Booking Details</Text>
              <TouchableOpacity onPress={() => setShowDetailsModal(false)}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {selectedJob && (
              <ScrollView style={{ marginTop: 10 }}>
                <Text style={styles.sectionTitle}>Seeker Information</Text>
                <Text>Name: Hajra Rizwan</Text>
                <Text>Email: Hajrarizwan@gmail.com</Text>
                <Text>Phone: 0301-0000000</Text>
                <Text>Location: {selectedJob.location}</Text>

                <Text style={styles.sectionTitle}>Service Details</Text>
                <Text>Category: {selectedJob.service}</Text>
                <Text>Subcategory: {selectedJob.subcategory}</Text>

                <Text style={styles.sectionTitle}>Booking Type</Text>
                <Text>{selectedJob.jobType}</Text>
                {selectedJob.jobType === 'Scheduled' && (
                  <>
                    <Text>Date: {selectedJob.date}</Text>
                    <Text>Time: {selectedJob.time}</Text>
                  </>
                )}

                <Text style={styles.sectionTitle}>Job Description</Text>
                <Text>{selectedJob.jobDescription}</Text>

                {selectedJob.images?.length > 0 && (
                  <>
                    <Text style={styles.sectionTitle}>Attached Images</Text>
                    <View style={styles.imageContainer}>
                      {selectedJob.images.map((img: string, i: number) => (
                        <Image key={i} source={{ uri: img }} style={styles.image} />
                      ))}
                    </View>
                  </>
                )}

                {/* <Text style={styles.sectionTitle}>Your Information</Text>
                <Text>Name: {selectedJob.seeker}</Text>
                <Text>Contact: {selectedJob.seekerContact}</Text>
                <Text style={styles.ratingText}>Previous Rating: ★ {selectedJob.seekerRating}</Text> */}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

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
            <Text style={styles.modalSubtitle}>Please select a reason for cancellation:</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  // ✅ Header styling
  header: {
    backgroundColor: '#19034d',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingTop: 49, // ✅ margin top added
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },

  content: { flex: 1 },
  jobCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    marginHorizontal: 24,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    marginTop: 20,
  },
  jobHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  jobTitleSection: { flex: 1 },
  jobService: { fontSize: 18, fontWeight: '600', color: '#19034d', marginBottom: 4 },
  jobSubcategory: { fontSize: 14, color: '#666' },
  jobDetails: { gap: 6, marginVertical: 10 },
  detailText: { fontSize: 14, color: '#333' },
  amount: { fontSize: 16, fontWeight: '600', color: '#19034d', marginBottom: 10 },
  greenText: { color: 'green' },

  // ✅ Start & Cancel row
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  startButton: {
    backgroundColor: '#19034d',
    paddingVertical: 10,
    flex: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  startButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  cancelButton: {
    backgroundColor: '#fee2e2',
    paddingVertical: 10,
    flex: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: { fontSize: 14, color: '#dc2626', fontWeight: '600' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#19034d' },
  modalSubtitle: { fontSize: 14, color: '#666', marginVertical: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#19034d', marginTop: 16, marginBottom: 8 },
  imageContainer: { flexDirection: 'row', gap: 8, marginVertical: 8 },
  image: { width: 80, height: 80, borderRadius: 8 },
  ratingText: { color: '#FFD700', fontWeight: '600', marginTop: 4 },

  reasonItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedReason: { backgroundColor: '#f0fff1', borderColor: '#05f51d' },
  reasonText: { fontSize: 14, color: '#333' },
  selectedReasonText: { color: '#05f51d', fontWeight: '600' },
  confirmCancelButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmCancelText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});
