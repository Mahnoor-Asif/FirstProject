import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MapPin, User, Clock, Calendar as CalendarIcon } from 'lucide-react-native';

interface JobCardProps {
  job: {
    id: string;
    category: string;
    subcategory: string;
    description: string;
    location: string;
    customerName: string;
    price: number;
    time?: string;
    date?: string; // ✅ added date
    urgent?: boolean;
    photos?: string[];
  };
  type: 'incoming' | 'scheduled' | 'ongoing';
  onAccept?: () => void;
  onReject?: () => void;
  onCounter?: () => void;
  onStart?: () => void;
  onEnd?: () => void;
  onViewDetails?: () => void;
  onChat?: () => void;
  onCancel?: () => void;
}

export function JobCard({ 
  job, 
  type, 
  onAccept, 
  onReject, 
  onCounter, 
  onStart, 
  onEnd, 
  onViewDetails, 
  onChat,
  onCancel
}: JobCardProps) {
  const renderActions = () => {
    switch (type) {
      case 'incoming':
        return (
          <View style={styles.jobActions}>
            <TouchableOpacity style={styles.rejectButton} onPress={onReject}>
              <Text style={styles.rejectText}>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
              <Text style={styles.acceptText}>Accept</Text>
            </TouchableOpacity>
          </View>
        );

      case 'scheduled':
        return (
          <View style={styles.scheduledActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.viewDetailsButton} onPress={onViewDetails}>
              <Text style={styles.viewDetailsText}>View Details</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chatButton} onPress={onChat}>
              <Text style={styles.chatText}>Chat</Text>
            </TouchableOpacity>
          </View>
        );

      case 'ongoing':
        return (
          <View style={styles.ongoingActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chatButton} onPress={onChat}>
              <Text style={styles.chatText}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.startButton} onPress={onStart}>
              <Text style={styles.startText}>Start</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.endJobButton} onPress={onEnd}>
              <Text style={styles.endJobText}>End Job</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={[
      styles.jobCard,
      type === 'ongoing' && styles.ongoingCard,
      job.urgent && styles.urgentCard,
    ]}>
      <View style={styles.jobHeader}>
        <View style={styles.categoryContainer}>
          <Text style={styles.jobCategory}>{job.category}</Text>
          <Text style={styles.jobSubcategory}>• {job.subcategory}</Text>
        </View>
        {job.urgent && (
          <View style={styles.urgentBadge}>
            <Text style={styles.urgentText}>🚨 URGENT REQUEST</Text>
          </View>
        )}
        <Text style={styles.jobPrice}>PKR {job.price.toLocaleString()}</Text>
      </View>

      <Text style={styles.jobDescription}>{job.description}</Text>

      <View style={styles.jobInfo}>
        <View style={styles.infoRow}>
          <MapPin size={16} color="#6B7280" />
          <Text style={styles.jobLocation}>{job.location}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <User size={16} color="#6B7280" />
          <Text style={styles.jobCustomer}>{job.customerName}</Text>
        </View>

        {/* ✅ Added Date */}
        {job.date && (
          <View style={styles.infoRow}>
            <CalendarIcon size={16} color="#6B7280" />
            <Text style={styles.jobDate}>{job.date}</Text>
          </View>
        )}
        
        {job.time && (
          <View style={styles.infoRow}>
            <Clock size={16} color="#6B7280" />
            <Text style={styles.jobTime}>{job.time}</Text>
          </View>
        )}
      </View>

      {job.photos && job.photos.length > 0 && (
        <View style={styles.photosContainer}>
          <Text style={styles.photosLabel}>Attached Photos:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {job.photos.map((photo, index) => (
              <View key={index} style={styles.photoPlaceholder}>
                <Text style={styles.photoText}>Photo {index + 1}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {renderActions()}
    </View>
  );
}

const styles = StyleSheet.create({
  jobCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 15,
  },
  ongoingCard: {
    borderColor: '#05f51d',
    borderWidth: 2,
  },
  urgentCard: {
    borderColor: '#EF4444',
    borderWidth: 2,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  categoryContainer: {
    flex: 1,
  },
  jobCategory: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#19034d',
  },
  jobSubcategory: {
    fontSize: 14,
    color: '#05f51d',
    fontWeight: '500',
  },
  jobPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#05f51d',
  },
  urgentBadge: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  urgentText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  jobDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  jobInfo: {
    gap: 8,
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  jobLocation: {
    fontSize: 14,
    color: '#6B7280',
  },
  jobCustomer: {
    fontSize: 14,
    color: '#6B7280',
  },
  jobDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  jobTime: {
    fontSize: 14,
    color: '#6B7280',
  },
  photosContainer: {
    marginBottom: 15,
  },
  photosLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 8,
  },
  photoPlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  photoText: {
    fontSize: 10,
    color: '#6B7280',
  },
  jobActions: {
    flexDirection: 'row',
    gap: 10,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  rejectText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#05f51d',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  scheduledActions: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  viewDetailsButton: {
    flex: 1,
    backgroundColor: '#19034d',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewDetailsText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  chatButton: {
    flex: 1,
    backgroundColor: '#6B7280',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  chatText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  ongoingActions: {
    flexDirection: 'row',
    gap: 10,
  },
  startButton: {
    flex: 1,
    backgroundColor: '#F59E0B',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  startText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  endJobButton: {
    flex: 1,
    backgroundColor: '#05f51d',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  endJobText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
