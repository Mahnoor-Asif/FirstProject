import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Image,
} from 'react-native';
import { ArrowLeft, Bell, CheckCircle2, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Sidebar from '@/components/Sidebar'; 

interface Job {
  id: string;
  visitCharges: number;
  customerName: string;
  customerPhone: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  category: string;
  subcategory: string;
  bookingType: 'bookNow' | 'scheduled';
  scheduledDateTime?: string;
  description: string;
  images: string[];
  status: 'completed' | 'pending' | 'in-progress';
  acceptedAt: string;
  startedAt: string;
  completedAt: string;
}

export default function History() {
  const router = useRouter();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [completedJobs] = useState<Job[]>([
    {
      id: '2',
      visitCharges: 800,
      customerName: 'Fatima Noor',
      customerPhone: '+92 345 2345678',
      location: {
        address: 'House 25, G-9/3',
        latitude: 33.5651,
        longitude: 73.0169,
      },
      category: 'Plumber',
      subcategory: 'Pipe Leakage',
      bookingType: 'scheduled',
      scheduledDateTime: '2025-10-11 02:00 PM',
      description: 'Bathroom fixtures installation completed successfully.',
      images: [],
      status: 'completed',
      acceptedAt: '2025-10-10 03:00 PM',
      startedAt: '2025-10-11 02:00 PM',
      completedAt: '2025-10-11 05:00 PM',
    },
  ]);

  const handleViewJob = (job: Job) => {
    setSelectedJob(job);
    setShowDetailsModal(true);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>History</Text>
        <TouchableOpacity onPress={() => router.push('/notifications')}>
          <Bell size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CheckCircle2 size={24} color="#05f51d" />
            <Text style={styles.sectionTitle}>Completed Jobs</Text>
          </View>

          {completedJobs.length > 0 ? (
            completedJobs.map((job) => (
              <TouchableOpacity
                key={job.id}
                style={styles.jobCard}
                onPress={() => handleViewJob(job)}
              >
                <View style={styles.jobHeader}>
                  <View>
                    <Text style={styles.jobCategory}>{job.category}</Text>
                    <Text style={styles.jobSubcategory}>{job.subcategory}</Text>
                  </View>
                  <View style={styles.chargesContainer}>
                    <Text style={styles.jobCharges}>PKR {job.visitCharges}</Text>
                    <CheckCircle2 size={16} color="#05f51d" />
                  </View>
                </View>

                <Text style={styles.jobCustomer}>{job.customerName}</Text>
                <Text style={styles.jobLocation} numberOfLines={1}>
                  {job.location.address}
                </Text>

                <View style={styles.dateRow}>
                  <Text style={styles.dateLabel}>Completed:</Text>
                  <Text style={styles.dateValue}>{job.completedAt}</Text>
                </View>

                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() => handleViewJob(job)}
                >
                  <Text style={styles.viewButtonText}>View Details</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <CheckCircle2 size={64} color="#ddd" />
              <Text style={styles.emptyStateText}>No completed jobs yet</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Sidebar */}
      <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />

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
                <Text style={styles.modalSectionTitle}>Customer Information</Text>
                <Text style={styles.modalText}>Name: {selectedJob.customerName}</Text>
                <Text style={styles.modalText}>Phone: {selectedJob.customerPhone}</Text>
                <Text style={styles.modalText}>
                  Location: {selectedJob.location.address}
                </Text>

                <Text style={styles.modalSectionTitle}>Service Details</Text>
                <Text style={styles.modalText}>Category: {selectedJob.category}</Text>
                <Text style={styles.modalText}>Subcategory: {selectedJob.subcategory}</Text>

                <Text style={styles.modalSectionTitle}>Booking Type</Text>
                <Text style={styles.modalText}>
                  {selectedJob.bookingType === 'scheduled' ? 'Scheduled' : 'Book Now'}
                </Text>
                {selectedJob.bookingType === 'scheduled' && (
                  <Text style={styles.modalText}>
                    Date & Time: {selectedJob.scheduledDateTime}
                  </Text>
                )}

                <Text style={styles.modalSectionTitle}>Job Description</Text>
                <Text style={styles.modalText}>{selectedJob.description}</Text>

                {selectedJob.images?.length > 0 && (
                  <>
                    <Text style={styles.modalSectionTitle}>Attached Images</Text>
                    <View style={styles.imageContainer}>
                      {selectedJob.images.map((img, i) => (
                        <Image key={i} source={{ uri: img }} style={styles.image} />
                      ))}
                    </View>
                  </>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: '#19034d',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  content: { flex: 1 },
  section: { padding: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#19034d' },
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  jobHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  jobCategory: { fontSize: 18, fontWeight: 'bold', color: '#19034d' },
  jobSubcategory: { fontSize: 14, color: '#666', marginTop: 2 },
  chargesContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  jobCharges: { fontSize: 16, fontWeight: 'bold', color: '#25cb35ff' },
  jobCustomer: { fontSize: 14, color: '#333', fontWeight: '500', marginBottom: 4 },
  jobLocation: { fontSize: 12, color: '#999', marginBottom: 12 },
  dateRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  dateLabel: { fontSize: 12, color: '#666', marginRight: 8 },
  dateValue: { fontSize: 12, color: '#333', fontWeight: '500' },
  viewButton: {
    backgroundColor: '#f0ebf8',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewButtonText: { fontSize: 14, fontWeight: '600', color: '#19034d' },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyStateText: { fontSize: 16, color: '#999', marginTop: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#19034d' },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#19034d',
    marginTop: 16,
    marginBottom: 6,
  },
  modalText: { fontSize: 14, color: '#333', marginBottom: 4 },
  imageContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  image: { width: 80, height: 80, borderRadius: 8, backgroundColor: '#f0f0f0' },
});
