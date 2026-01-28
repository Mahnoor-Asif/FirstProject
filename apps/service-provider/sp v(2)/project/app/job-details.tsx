import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, MapPin, User, Clock, DollarSign, Camera, MessageSquare, Phone, Star } from 'lucide-react-native';

export default function JobDetailsScreen() {
  const router = useRouter();
  const [jobAccepted, setJobAccepted] = useState(false);

  const jobDetails = {
    id: 'J001',
    category: 'Electrical',
    subcategory: 'Wiring',
    description: 'Need electrical wiring repair in bedroom. The main switch is not working properly and some outlets are not getting power. Need urgent repair.',
    location: 'House #123, Street 5, Gulberg III, Lahore',
    customerName: 'Ahmad Khan',
    customerPhone: '+92 300 1234567',
    price: 1500,
    urgent: true,
    estimatedTime: '2-3 hours',
    photos: ['bedroom_wiring_1', 'electrical_panel', 'outlet_issue'],
    requirements: [
      'Bring electrical tools',
      'Safety equipment required',
      'Test all connections after repair'
    ],
    customerRating: 4.7,
    customerJobsCount: 12,
    distance: '0.5 km away',
    postedTime: '5 minutes ago'
  };

  const handleAcceptJob = () => {
    setJobAccepted(true);
    Alert.alert(
      'Job Accepted!',
      'You have successfully accepted this job. The customer has been notified.',
      [
        {
          text: 'Start Chat',
          onPress: () => router.push('/chat')
        },
        {
          text: 'OK',
          style: 'default'
        }
      ]
    );
  };

  const handleRejectJob = () => {
    Alert.alert(
      'Reject Job',
      'Are you sure you want to reject this job request?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Job Rejected', 'You have rejected this job request.');
            router.back();
          }
        }
      ]
    );
  };

  const handleCounterOffer = () => {
    router.push('/counter-offer');
  };

  const handleCallCustomer = () => {
    Alert.alert('Call Customer', `Calling ${jobDetails.customerName} at ${jobDetails.customerPhone}`);
  };

  const handleChatCustomer = () => {
    router.push('/chat');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#19034d" />
        </TouchableOpacity>
        <Text style={styles.title}>Job Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Job Header */}
        <View style={[styles.jobCard, jobDetails.urgent && styles.urgentCard]}>
          <View style={styles.jobHeader}>
            <View style={styles.categoryContainer}>
              <Text style={styles.jobCategory}>{jobDetails.category}</Text>
              <Text style={styles.jobSubcategory}>• {jobDetails.subcategory}</Text>
            </View>
            <Text style={styles.jobPrice}>PKR {jobDetails.price.toLocaleString()}</Text>
          </View>

          {jobDetails.urgent && (
            <View style={styles.urgentBanner}>
              <Text style={styles.urgentText}>🚨 URGENT REQUEST</Text>
            </View>
          )}

          <Text style={styles.jobDescription}>{jobDetails.description}</Text>

          <View style={styles.jobInfo}>
            <View style={styles.infoRow}>
              <MapPin size={16} color="#6B7280" />
              <Text style={styles.jobLocation}>{jobDetails.location}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Clock size={16} color="#6B7280" />
              <Text style={styles.estimatedTime}>Estimated: {jobDetails.estimatedTime}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.distance}>{jobDetails.distance} • Posted {jobDetails.postedTime}</Text>
            </View>
          </View>
        </View>

        {/* Customer Information */}
        <View style={styles.customerCard}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          
          <View style={styles.customerInfo}>
            <View style={styles.customerAvatar}>
              <User size={24} color="#6B7280" />
            </View>
            
            <View style={styles.customerDetails}>
              <Text style={styles.customerName}>{jobDetails.customerName}</Text>
              <View style={styles.customerStats}>
                <Star size={14} color="#FFD700" />
                <Text style={styles.customerRating}>{jobDetails.customerRating}/5</Text>
                <Text style={styles.customerJobs}>• {jobDetails.customerJobsCount} jobs posted</Text>
              </View>
            </View>

            <View style={styles.contactButtons}>
              <TouchableOpacity style={styles.contactButton} onPress={handleCallCustomer}>
                <Phone size={16} color="#19034d" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactButton} onPress={handleChatCustomer}>
                <MessageSquare size={16} color="#19034d" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Photos */}
        {jobDetails.photos && jobDetails.photos.length > 0 && (
          <View style={styles.photosCard}>
            <Text style={styles.sectionTitle}>Attached Photos ({jobDetails.photos.length})</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.photosContainer}>
                {jobDetails.photos.map((photo, index) => (
                  <TouchableOpacity key={index} style={styles.photoItem}>
                    <Camera size={24} color="#6B7280" />
                    <Text style={styles.photoText}>Photo {index + 1}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Requirements */}
        <View style={styles.requirementsCard}>
          <Text style={styles.sectionTitle}>Job Requirements</Text>
          {jobDetails.requirements.map((requirement, index) => (
            <View key={index} style={styles.requirementItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.requirementText}>{requirement}</Text>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        {!jobAccepted && (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.rejectButton} onPress={handleRejectJob}>
              <Text style={styles.rejectText}>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.counterButton} onPress={handleCounterOffer}>
              <Text style={styles.counterText}>Counter Offer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.acceptButton} onPress={handleAcceptJob}>
              <Text style={styles.acceptText}>Accept Job</Text>
            </TouchableOpacity>
          </View>
        )}

        {jobAccepted && (
          <View style={styles.acceptedContainer}>
            <Text style={styles.acceptedText}>✅ Job Accepted!</Text>
            <Text style={styles.acceptedSubtext}>Customer has been notified. You can now chat with them.</Text>
            <TouchableOpacity style={styles.chatButton} onPress={handleChatCustomer}>
              <MessageSquare size={20} color="#FFFFFF" />
              <Text style={styles.chatButtonText}>Start Chat</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#19034d',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#19034d',
  },
  jobSubcategory: {
    fontSize: 14,
    color: '#05f51d',
    fontWeight: '500',
  },
  jobPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#05f51d',
  },
  urgentBanner: {
    backgroundColor: '#FEF2F2',
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  urgentText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#DC2626',
    textAlign: 'center',
  },
  jobDescription: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 16,
  },
  jobInfo: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  jobLocation: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  estimatedTime: {
    fontSize: 14,
    color: '#6B7280',
  },
  distance: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  customerCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#19034d',
    marginBottom: 16,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  customerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#19034d',
    marginBottom: 4,
  },
  customerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  customerRating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#19034d',
  },
  customerJobs: {
    fontSize: 12,
    color: '#6B7280',
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  contactButton: {
    backgroundColor: '#F3F4F6',
    padding: 10,
    borderRadius: 8,
  },
  photosCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  photosContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  photoItem: {
    width: 80,
    height: 80,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoText: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 4,
  },
  requirementsCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  bulletPoint: {
    fontSize: 16,
    color: '#05f51d',
    fontWeight: 'bold',
  },
  requirementText: {
    fontSize: 14,
    color: '#4B5563',
    flex: 1,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 30,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  rejectText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  counterButton: {
    flex: 1,
    backgroundColor: '#F59E0B',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  counterText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#05f51d',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  acceptText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  acceptedContainer: {
    backgroundColor: '#F0FDF4',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#05f51d',
    alignItems: 'center',
    marginBottom: 30,
  },
  acceptedText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#05f51d',
    marginBottom: 8,
  },
  acceptedSubtext: {
    fontSize: 14,
    color: '#059669',
    textAlign: 'center',
    marginBottom: 16,
  },
  chatButton: {
    flexDirection: 'row',
    backgroundColor: '#05f51d',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    gap: 8,
  },
  chatButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});