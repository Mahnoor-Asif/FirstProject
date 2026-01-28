import React, { useState, useMemo } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert, Linking, Image 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, MapPin, User, Phone, Bell, CheckCircle } from 'lucide-react-native';

export default function JobTrackingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const defaultJob = {
    id: 'J001',
    category: 'Plumbing',
    subcategory: 'Pipe Repair',
    description: 'Need electrical wiring repair in bedroom',
    location: 'Main Road Airport Society',
    customerName: 'Mohammad Ali',
    customerPhone: '+923001234567',
    price: 200,
    photos: [],
  };

  let jobData = defaultJob;
  if (params.job) {
    try {
      jobData = typeof params.job === 'string' ? JSON.parse(params.job) : params.job;
    } catch {
      jobData = defaultJob;
    }
  }

  const [jobStatus, setJobStatus] = useState('accepted');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState(null);

  const statusSteps = useMemo(() => [
    { key: 'accepted', label: 'Accepted', completed: jobStatus !== 'accepted' },
    { key: 'arriving', label: 'Arriving', completed: ['arriving','arrived','started','completed'].includes(jobStatus) },
    { key: 'arrived', label: 'Arrived', completed: ['arrived','started','completed'].includes(jobStatus) },
    { key: 'started', label: 'Started', completed: ['started','completed'].includes(jobStatus) },
    { key: 'completed', label: 'Completed', completed: jobStatus === 'completed' },
  ], [jobStatus]);

  const cancelReasonsList = [
    'Change of plan',
    'Unexpected delay',
    'Wrong location provided',
    'Customer not available',
    'Emergency situation',
    'Technical issues',
    'Other reason',
  ];

  const handleCall = () => {
    if (jobData.customerPhone) {
      Linking.openURL(`tel:${jobData.customerPhone}`);
    } else {
      Alert.alert('Phone number not available');
    }
  };

  const handleCancelBooking = () => setShowCancelModal(true);

  const handleConfirmCancel = () => {
    if (!selectedReason) {
      Alert.alert('Select Reason', 'Please select a reason for cancellation');
      return;
    }
    Alert.alert(
      'Booking Cancelled',
      `Booking cancelled for reason: ${selectedReason}`,
      [{ text: 'OK', onPress: () => setShowCancelModal(false) }]
    );
  };

  const handleCompleteJob = () => {
    Alert.alert('Complete Job', 'Mark this job as completed?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Complete', 
        onPress: () => {
          setJobStatus('completed');
          Alert.alert(
            'Payment Completed!',
            'Payment of visit charges has been received.',
            [{ text: 'OK', onPress: () => router.replace('/dashboard') }]
          );
        } 
      },
    ]);
  };

  // --- Cancel Modal ---
  if (showCancelModal) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setShowCancelModal(false)}>
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cancel Booking</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content}>
          <Text style={styles.cancelTitle}>Why are you cancelling?</Text>
          <Text style={styles.cancelSubtitle}>Select one reason</Text>

          {cancelReasonsList.map(reason => (
            <TouchableOpacity
              key={reason}
              style={[styles.reasonItem, selectedReason === reason && styles.selectedReason]}
              onPress={() => setSelectedReason(reason)}
            >
              <View style={[styles.checkbox, selectedReason === reason && styles.checkedBox]}>
                {selectedReason === reason && <CheckCircle size={16} color="#fff" />}
              </View>
              <Text style={[styles.reasonText, selectedReason === reason && { color: '#fff' }]}>{reason}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setShowCancelModal(false)}>
            <Text style={styles.cancelButtonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.confirmCancelButton, !selectedReason && styles.disabledButton]}
            onPress={handleConfirmCancel}
            disabled={!selectedReason}
          >
            <Text style={styles.confirmCancelText}>Confirm Cancel</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // --- Main Screen ---
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: '12%' }}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.logo}>Job Tracking</Text>
        <TouchableOpacity style={{ marginTop: '12%' }} onPress={() => router.push('/notifications')}>
          <Bell size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Progress */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressTitle}>Job Progress</Text>
          <View style={styles.progressBar}>
            {statusSteps.map((step, index) => (
              <View key={step.key} style={styles.progressStep}>
                <View style={[
                  styles.progressDot,
                  step.completed && styles.completedDot,
                  jobStatus === step.key && styles.currentDot
                ]}>
                  {step.completed && <CheckCircle size={16} color="#fff" />}
                </View>
                <Text style={[
                  styles.progressLabel,
                  step.completed && styles.completedLabel,
                  jobStatus === step.key && styles.currentLabel
                ]}>
                  {step.label}
                </Text>
                {index < statusSteps.length - 1 && <View style={[styles.progressLine, step.completed && styles.completedLine]} />}
              </View>
            ))}
          </View>
        </View>

        {/* Service Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Details</Text>
          <View style={styles.detailCard}>
            <Text style={styles.detailHeader}>{jobData.category} - {jobData.subcategory}</Text>
            <Text style={styles.detailDescription}>{jobData.description}</Text>
            <View style={styles.divider} />

            <Text style={styles.subTitle}>Customer Information</Text>
            <View style={styles.infoRow}>
              {/* <Phone size={18} color="#05f51d" /> */}
              <Text style={[styles.infoText, { marginLeft: 6 }]}>{jobData.customerPhone}</Text>
              <TouchableOpacity onPress={handleCall} style={[styles.callBtnWithText, { marginLeft: 10 }]}>
                <Text style={styles.callText}>Call</Text>
              </TouchableOpacity>
            </View>

            {/* Customer Name */}
            <View style={styles.infoRow}>
              <User size={18} color="#05f51d" />
              <Text style={[styles.infoText, { marginLeft: 6 }]}>{jobData.customerName}</Text>
            </View>

            {/* Location */}
            <View style={styles.infoRow}>
              <MapPin size={18} color="#05f51d" />
              <Text style={[styles.infoText, { marginLeft: 6 }]}>{jobData.location}</Text>
            </View>

            <View style={styles.divider} />
            <Text style={styles.subTitle}>Job Details</Text>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Category:</Text>
              <Text style={styles.infoValue}>{jobData.category}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Subcategory:</Text>
              <Text style={styles.infoValue}>{jobData.subcategory}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Booking Type:</Text>
              <Text style={styles.infoValue}>Book Now</Text>
            </View>
            <Text style={styles.visitCharge}>Visit Charges: PKR {jobData.price}</Text>

            {jobData.photos?.length > 0 && (
              <>
                <View style={styles.divider} />
                <Text style={styles.subTitle}>Attached Images</Text>
                <View style={styles.imageContainer}>
                  {jobData.photos.map((img, i) => (
                    <Image key={i} source={{ uri: img }} style={styles.image} />
                  ))}
                </View>
              </>
            )}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          {jobStatus === 'accepted' && (
            <TouchableOpacity style={styles.startButton} onPress={() => setJobStatus('arriving')}>
              <Text style={styles.startButtonText}>Mark as Arriving</Text>
            </TouchableOpacity>
          )}
          {jobStatus === 'arriving' && (
            <TouchableOpacity style={styles.startButton} onPress={() => setJobStatus('arrived')}>
              <Text style={styles.startButtonText}>Mark as Arrived</Text>
            </TouchableOpacity>
          )}
          {jobStatus === 'arrived' && (
            <TouchableOpacity style={styles.startButton} onPress={() => setJobStatus('started')}>
              <Text style={styles.startButtonText}>Start Job</Text>
            </TouchableOpacity>
          )}
          {jobStatus !== 'started' && jobStatus !== 'completed' && jobStatus !== 'arrived' && (
            <TouchableOpacity style={styles.cancelButtonAlt} onPress={handleCancelBooking}>
              <Text style={{ color: '#fff', fontWeight: '600' }}>Cancel Booking</Text>
            </TouchableOpacity>
          )}
          {jobStatus === 'started' && (
            <TouchableOpacity style={styles.completeButton} onPress={handleCompleteJob}>
              <Text style={styles.completeButtonText}>Complete Job</Text>
            </TouchableOpacity>
          )}
          {jobStatus === 'completed' && (
            <View style={styles.completedContainer}>
              <CheckCircle size={48} color="#05f51d" />
              <Text style={styles.completedTitle}>Payment Completed!</Text>
              <TouchableOpacity style={styles.greenButton} onPress={() => router.replace('/dashboard')}>
                <Text style={styles.greenButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Keep your original styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#19034d', paddingHorizontal: 16, paddingTop: 20, paddingBottom: 10 },
  logo: { color: '#fff', fontSize: 20, fontWeight: '700' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  content: { paddingHorizontal: 20 },
  progressContainer: { marginVertical: 20 },
  progressTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 12 },
  progressBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  progressStep: { alignItems: 'center', flexDirection: 'row', position: 'relative' },
  progressDot: { width: 25, height: 26, borderRadius: 13, borderWidth: 2, borderColor: '#9CA3AF', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F4F6' },
  completedDot: { backgroundColor: '#05f51d', borderColor: '#05f51d' },
  currentDot: { backgroundColor: '#05f51d', borderColor: '#05f51d' },
  progressLine: { width: 40, height: 2, backgroundColor: '#D1D5DB', marginHorizontal: 4 },
  completedLine: { backgroundColor: '#05f51d' },
  progressLabel: { position: 'absolute', top: 32, left: -8, fontSize: 12, color: '#6B7280' },
  completedLabel: { color: '#05f51d' },
  currentLabel: { color: '#19034d', fontWeight: '600' },
  section: { marginTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 8, paddingLeft: 6 },
  detailCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  detailHeader: { fontSize: 16, fontWeight: '700', color: '#111827' },
  detailDescription: { fontSize: 14, color: '#374151', marginTop: 4, marginBottom: 12 },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 12 },
  subTitle: { fontSize: 15, fontWeight: '600', color: '#111827', marginBottom: 6 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  infoText: { fontSize: 14, color: '#374151', flex: 1 },
  infoBox: { marginBottom: 6 },
  infoLabel: { fontSize: 14, fontWeight: '600', color: '#111827' },
  infoValue: { fontSize: 14, color: '#374151', marginTop: 2 },
  visitCharge: { fontSize: 15, fontWeight: '700', color: '#000', textAlign: 'left', marginTop: 8 },
  imageContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
  image: { width: 100, height: 100, borderRadius: 10, marginRight: 8, marginBottom: 8 },
  startButton: { backgroundColor: '#19034d', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  startButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  completeButton: { backgroundColor: '#19034d', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  completeButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  cancelButtonAlt: { backgroundColor: '#EF4444', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  completedContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 40 },
  completedTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginVertical: 10 },
  greenButton: { backgroundColor: '#10B981', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 10 },
  greenButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  cancelTitle: { fontSize: 20, fontWeight: '700', color: '#111827', marginVertical: 8, textAlign: 'center' },
  cancelSubtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 16 },
  reasonItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', padding: 12, borderRadius: 10, marginBottom: 8 },
  selectedReason: { backgroundColor: '#2563EB' },
  checkbox: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#9CA3AF', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  checkedBox: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  reasonText: { color: '#111827', fontSize: 14 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#E5E7EB' },
  cancelButton: { flex: 1, marginRight: 8, backgroundColor: '#E5E7EB', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  cancelButtonText: { color: '#111827', fontSize: 16, fontWeight: '600' },
  confirmCancelButton: { flex: 1, backgroundColor: '#eb2323ff', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  confirmCancelText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  disabledButton: { opacity: 0.6 },
  callBtnWithText: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#05f51d', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  callText: { color: '#fff', marginLeft: 6, fontWeight: '600' },
  actionsContainer: { marginTop: 16, marginBottom: 32 },
});
