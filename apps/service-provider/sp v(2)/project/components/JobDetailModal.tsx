import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Image, Linking } from 'react-native';
import { Job } from '@/context/AppContext';
import { X, Phone, MapPin, Clock, FileText } from 'lucide-react-native';

interface JobDetailModalProps {
  visible: boolean;
  job: Job | null;
  onClose: () => void;
  onAccept?: () => void;
  onReject?: () => void;
  onStart?: () => void;
  onEnd?: () => void;
  onCancel?: () => void;
}

export default function JobDetailModal({
  visible,
  job,
  onClose,
  onAccept,
  onReject,
  onStart,
  onEnd,
  onCancel,
}: JobDetailModalProps) {
  if (!job) return null;

  const handleCall = () => {
    Linking.openURL(`tel:${job.customerPhone}`);
  };

  const handleNavigate = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${job.location.latitude},${job.location.longitude}`;
    Linking.openURL(url);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Job Details</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.chargesBanner}>
              <Text style={styles.chargesLabel}>Fixed Visit Charges</Text>
              <Text style={styles.chargesAmount}>PKR {job.visitCharges}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Booking Details</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Customer Name:</Text>
                <Text style={styles.infoValue}>{job.customerName}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Phone:</Text>
                <TouchableOpacity onPress={handleCall}>
                  <Text style={[styles.infoValue, styles.phoneLink]}>{job.customerPhone}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.infoRow}>
                <MapPin size={16} color="#666" />
                <Text style={[styles.infoValue, { flex: 1, marginLeft: 8 }]}>
                  {job.location.address}
                </Text>
              </View>
              <TouchableOpacity style={styles.navigateButton} onPress={handleNavigate}>
                <MapPin size={16} color="#19034d" />
                <Text style={styles.navigateButtonText}>Navigate</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Service Details</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Category:</Text>
                <Text style={styles.infoValue}>{job.category}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Subcategory:</Text>
                <Text style={styles.infoValue}>{job.subcategory}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Booking Type:</Text>
                <Text style={[styles.infoValue, styles.bookingType]}>
                  {job.bookingType === 'bookNow' ? 'Book Now' : 'Scheduled'}
                </Text>
              </View>
              {job.scheduledDateTime && (
                <View style={styles.infoRow}>
                  <Clock size={16} color="#666" />
                  <Text style={[styles.infoValue, { marginLeft: 8 }]}>{job.scheduledDateTime}</Text>
                </View>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Job Description</Text>
              <Text style={styles.description}>{job.description}</Text>
            </View>

            {job.images.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Attached Images</Text>
                <View style={styles.imagesGrid}>
                  {job.images.map((img, index) => (
                    <Image key={index} source={{ uri: img }} style={styles.image} />
                  ))}
                </View>
              </View>
            )}
          </ScrollView>

          <View style={styles.footer}>
            {job.status === 'pending' && onAccept && onReject && (
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.rejectButton} onPress={onReject}>
                  <Text style={styles.rejectButtonText}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
                  <Text style={styles.acceptButtonText}>Accept</Text>
                </TouchableOpacity>
              </View>
            )}

            {job.status === 'accepted' && onStart && onCancel && (
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.startButton} onPress={onStart}>
                  <Text style={styles.startButtonText}>Start Job</Text>
                </TouchableOpacity>
              </View>
            )}

            {job.status === 'ongoing' && onEnd && onCancel && (
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.endButton} onPress={onEnd}>
                  <Text style={styles.endButtonText}>End Job</Text>
                </TouchableOpacity>
              </View>
            )}

            {job.status === 'completed' && (
              <View style={styles.callButtonContainer}>
                <TouchableOpacity style={styles.callButton} onPress={handleCall}>
                  <Phone size={20} color="#fff" />
                  <Text style={styles.callButtonText}>Call Customer</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  header: {
    backgroundColor: '#19034d',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  chargesBanner: {
    backgroundColor: '#05f51d',
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  chargesLabel: {
    fontSize: 14,
    color: '#19034d',
    fontWeight: '600',
  },
  chargesAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#19034d',
    marginTop: 4,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#19034d',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    width: 120,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  phoneLink: {
    color: '#0066cc',
    textDecorationLine: 'underline',
  },
  bookingType: {
    backgroundColor: '#f0ebf8',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  navigateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0ebf8',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  navigateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#19034d',
  },
  description: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ff4444',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  rejectButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff4444',
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#05f51d',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#19034d',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#999',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  startButton: {
    flex: 1,
    backgroundColor: '#05f51d',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#19034d',
  },
  endButton: {
    flex: 1,
    backgroundColor: '#05f51d',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  endButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#19034d',
  },
  callButtonContainer: {
    width: '100%',
  },
  callButton: {
    flexDirection: 'row',
    backgroundColor: '#19034d',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  callButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
