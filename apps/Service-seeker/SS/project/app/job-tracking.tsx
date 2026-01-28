// import React, { useEffect, useState } from 'react';
// import { 
//   View, Text, ScrollView, StyleSheet, Alert 
// } from 'react-native';
// import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
// import { useLocalSearchParams } from 'expo-router';

// export default function JobTrackingScreen() {
//   const { provider, categories, subcategories, dynamicFields } = useLocalSearchParams();

//   // Safe JSON parsing
//   const providerData = provider ? JSON.parse(provider as string) : {};
//   const categoriesData = categories ? JSON.parse(categories as string) : [];
//   const subcategoriesData = subcategories ? JSON.parse(subcategories as string) : [];
//   const dynamicFieldsData = dynamicFields ? JSON.parse(dynamicFields as string) : {};

//   // Animated progress
//   const progressWidth = useSharedValue(20);
//   const animatedProgressStyle = useAnimatedStyle(() => ({
//     width: `${progressWidth.value}%`, // ✅ Corrected syntax
//   }));

//   useEffect(() => {
//     // Example: increment progress over time
//     const interval = setInterval(() => {
//       if (progressWidth.value < 100) {
//         progressWidth.value += 5;
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.header}>Job Tracking</Text>

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Provider Info</Text>
//         <Text>Name: {providerData.name || 'N/A'}</Text>
//         <Text>Phone: {providerData.phone || 'N/A'}</Text>
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Categories</Text>
//         {categoriesData.map((category: any, idx: number) => (
//           <View key={`category-${idx}`} style={styles.categorySection}>
//             <Text style={styles.categoryTitle}>{category.name}</Text>
//             {category.services && category.services.map((service: any, sIdx: number) => (
//               <Text key={`service-${idx}-${sIdx}`} style={styles.serviceItem}>
//                 • {service.name}
//               </Text>
//             ))}
//           </View>
//         ))}
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Dynamic Fields</Text>
//         {Object.keys(dynamicFieldsData).map((key, idx) => (
//           <Text key={`field-${idx}`} style={styles.serviceItem}>
//             {key}: {dynamicFieldsData[key]}
//           </Text>
//         ))}
//       </View>

//       <View style={styles.progressBarBackground}>
//         <View style={[styles.progressBarFill, animatedProgressStyle]} />
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     paddingBottom: 50,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: '700',
//     marginBottom: 20,
//   },
//   section: {
//     marginBottom: 20,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 8,
//   },
//   categorySection: {
//     marginBottom: 10,
//   },
//   categoryTitle: {
//     fontWeight: '500',
//   },
//   serviceItem: {
//     marginLeft: 10,
//   },
//   progressBarBackground: {
//     height: 20,
//     backgroundColor: '#ddd',
//     borderRadius: 10,
//     marginTop: 20,
//     overflow: 'hidden',
//   },
//   progressBarFill: {
//     height: '100%',
//     backgroundColor: '#4caf50',
//   },
// });
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  TextInput,
  Linking,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Star,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  X,
  CircleCheck as CheckCircle,
  Navigation,
} from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import ChatModal from '../components/ChatModal';
import { addJobToHistory } from '../utils/historyStorage';

const jobStatuses = [
  { key: 'accepted', label: 'Accepted', completed: true },
  { key: 'arriving', label: 'Arriving', completed: false },
  { key: 'arrived', label: 'Arrived', completed: false },
  { key: 'started', label: 'Started', completed: false },
  { key: 'completed', label: 'Completed', completed: false },
];

const cancelReasons = [
  'Change of plan',
  'Found another provider',
  'Provider is late',
  'Wrong location',
  'Emergency came up',
  'Price too high',
  'Other',
];

export default function JobTrackingScreen() {
  const router = useRouter();
  const {
    provider,
    categories,
    subcategories,
    bookingType,
    amount,
    description,
    scheduleDate,
    scheduleTime,
    dynamicFields,
  } = useLocalSearchParams();

  const [currentStatus, setCurrentStatus] = useState('accepted');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedCancelReasons, setSelectedCancelReasons] = useState<string[]>([]);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showCancellationSuccessModal, setShowCancellationSuccessModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showVerificationResultModal, setShowVerificationResultModal] = useState(false);
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [driverLocation, setDriverLocation] = useState({ lat: 24.8607, lng: 67.0011 });
  const [customerLocation] = useState({ lat: 24.8615, lng: 67.0099 });

  const providerData = JSON.parse(provider as string);
  const categoriesData = JSON.parse(categories as string);
  const subcategoriesData = JSON.parse(subcategories as string);
  const dynamicFieldsData = dynamicFields ? JSON.parse(dynamicFields as string) : {};

  const progressWidth = useSharedValue(20);
  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  useEffect(() => {
    const statusTimers = [
      setTimeout(() => {
        setCurrentStatus('arriving');
        progressWidth.value = withTiming(40);
      }, 5000),
      setTimeout(() => {
        setCurrentStatus('arrived');
        progressWidth.value = withTiming(60);
        // Show verification modal when provider arrives
        setTimeout(() => {
          setShowVerificationModal(true);
        }, 1000);
      }, 15000),
      setTimeout(() => {
        setCurrentStatus('started');
        progressWidth.value = withTiming(80);
      }, 25000),
      setTimeout(() => {
        setCurrentStatus('completed');
        progressWidth.value = withTiming(100);
        // Show payment modal only on mobile/when needed
        setTimeout(() => {
          setShowPaymentModal(true);
        }, 1000);
      }, 45000),
    ];

    // Simulate driver movement
    const locationTimer = setInterval(() => {
      if (currentStatus === 'arriving') {
        setDriverLocation(prev => ({
          lat: prev.lat + (Math.random() - 0.5) * 0.001,
          lng: prev.lng + (Math.random() - 0.5) * 0.001,
        }));
      }
    }, 2000);

    return () => {
      statusTimers.forEach(timer => clearTimeout(timer));
      clearInterval(locationTimer);
    };
  }, []);

  const getStatusIndex = () => jobStatuses.findIndex(s => s.key === currentStatus);

  const toggleCancelReason = (reason: string) => {
  setSelectedCancelReasons(prev =>
    prev.includes(reason) ? [] : [reason]
  );
};


  const handleCancelConfirm = () => {
    if (selectedCancelReasons.length === 0) {
      Alert.alert('Error', 'Please select at least one reason');
      return;
    }
    
    setShowCancelModal(false);
    setShowCancellationSuccessModal(true);
    Alert.alert('Your Booking has been cancelled');
    router.replace('/(tabs)');
  };

  const handlePaymentComplete = () => {
    setShowPaymentModal(false);
    setShowRatingModal(true);
  };

  const handleRatingSubmit = () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please provide a rating');
      return;
    }
    
    // Add job to history
    const completedJob = {
      id: Date.now(),
      service: categoriesData.map((c: any) => c.name).join(', '),
      subcategory: subcategoriesData.map((s: any) => s.name).join(', '),
      date: new Date().toISOString().split('T')[0],
      provider: providerData.name,
      amount: parseInt(amount as string),
      status: 'completed',
      rating: rating,
      review: review || 'No review provided',
    };
    
    addJobToHistory(completedJob);
    setShowRatingModal(false);
    router.replace('/(tabs)');
  };

  const handleSkipRating = () => {
    // Add job to history without rating
    const completedJob = {
      id: Date.now(),
      service: categoriesData.map((c: any) => c.name).join(', '),
      subcategory: subcategoriesData.map((s: any) => s.name).join(', '),
      date: new Date().toISOString().split('T')[0],
      provider: providerData.name,
      amount: parseInt(amount as string),
      status: 'completed',
      rating: 0,
      review: 'No review provided',
    };
    
    addJobToHistory(completedJob);
    setShowRatingModal(false);
    router.replace('/(tabs)');
  };

  const handleVerificationResponse = (isVerified: boolean) => {
    setVerificationResult(isVerified);
    setShowVerificationModal(false);
    setShowVerificationResultModal(true);
  };

  const handleVerificationResultAction = (continueBooking: boolean) => {
    setShowVerificationResultModal(false);
    
    if (!continueBooking) {
      // Cancel the booking
      const cancelledJob = {
        id: Date.now(),
        service: categoriesData.map((c: any) => c.name).join(', '),
        subcategory: subcategoriesData.map((s: any) => s.name).join(', '),
        date: new Date().toISOString().split('T')[0],
        provider: providerData.name,
        amount: parseInt(amount as string),
        status: 'cancelled',
        rating: 0,
        review: 'Booking cancelled due to verification',
      };
      
      addJobToHistory(cancelledJob);
      router.replace('/(tabs)');
    }
    // If continuing, job proceeds normally
  };
  const handleCancellationSuccess = () => {
    // Add cancelled job to history
    const cancelledJob = {
      id: Date.now(),
      service: categoriesData.map((c: any) => c.name).join(', '),
      subcategory: subcategoriesData.map((s: any) => s.name).join(', '),
      date: new Date().toISOString().split('T')[0],
      provider: providerData.name,
      amount: parseInt(amount as string),
      status: 'cancelled',
      rating: 0,
      review: 'Booking was cancelled',
    };
    
    addJobToHistory(cancelledJob);
    setShowCancellationSuccessModal(false);
    setSelectedCancelReasons([]);
    router.replace('/(tabs)');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={12}
        color={index < Math.floor(rating) ? '#f59e0b' : '#e5e5e5'}
        fill={index < Math.floor(rating) ? '#f59e0b' : 'transparent'}
      />
    ));
  };

  const renderProgressBar = () => (
    <View style={styles.progressSection}>
      {/* <Text style={styles.progressTitle}>Job Progress</Text> */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animated.View style={[styles.progressFill, animatedProgressStyle]} />
        </View>
        <View style={styles.statusSteps}>
          {jobStatuses.map((status, idx) => {
            const isCompleted = idx <= getStatusIndex();
            const isCurrent = status.key === currentStatus;
            return (
              <View key={status.key} style={styles.statusStep}>
                <View
                  style={[
                    styles.statusDot,
                    isCompleted && styles.completedDot,
                    isCurrent && styles.currentDot,
                  ]}
                >
                  {isCompleted && <CheckCircle size={12} color="#fff" />}
                </View>
                <Text
                  style={[
                    styles.statusLabel,
                    isCompleted && styles.completedLabel,
                    isCurrent && styles.currentLabel,
                  ]}
                >
                  {status.label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );

  const renderCancelModal = () => (
    <Modal visible={showCancelModal} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Cancel Booking</Text>
            <TouchableOpacity onPress={() => setShowCancelModal(false)}>
              <X size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <Text style={styles.modalSubtitle}>Please select reason(s) for cancellation:</Text>
          <ScrollView style={styles.reasonsList}>
            {cancelReasons.map((reason, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.reasonItem,
                  selectedCancelReasons.includes(reason) && styles.selectedReason,
                ]}
                onPress={() => toggleCancelReason(reason)}
              >
                <Text
                  style={[
                    styles.reasonText,
                    selectedCancelReasons.includes(reason) && styles.selectedReasonText,
                  ]}
                >
                  {reason}
                </Text>
                {selectedCancelReasons.includes(reason) && <CheckCircle size={16} color="#05f51d" />}
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.confirmCancelButton} onPress={handleCancelConfirm}>
            <Text style={styles.confirmCancelText}>Confirm Cancellation</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderPaymentModal = () => (
    <Modal visible={showPaymentModal} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Job Completed</Text>
          </View>
          <Text style={styles.modalSubtitle}>Service has been completed successfully</Text>
          <View style={styles.paymentDetails}>
            <Text style={styles.paymentLabel}>Total Amount</Text>
            <Text style={styles.paymentAmount}>PKR {amount}</Text>
          </View>
          <TouchableOpacity style={styles.payButton} onPress={handlePaymentComplete}>
            <Text style={styles.payButtonText}>Confirm Payment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderRatingModal = () => (
    <Modal visible={showRatingModal} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Rate Your Experience</Text>
            <TouchableOpacity onPress={handleSkipRating}>
              <X size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <View style={styles.ratingSection}>
            <Image source={{ uri: providerData.photo }} style={styles.ratingProviderPhoto} />
            <Text style={styles.ratingProviderName}>{providerData.name}</Text>
            <View style={styles.starRating}>
              {Array.from({ length: 5 }, (_, idx) => (
                <TouchableOpacity key={idx} onPress={() => setRating(idx + 1)}>
                  <Star
                    size={32}
                    color={idx < rating ? '#f59e0b' : '#e5e5e5'}
                    fill={idx < rating ? '#f59e0b' : 'transparent'}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.reviewInput}
              placeholder="Write your review (optional)"
              value={review}
              onChangeText={setReview}
              multiline
              numberOfLines={3}
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.ratingButtonsContainer}>
            {/* <TouchableOpacity style={styles.skipRatingButton} onPress={handleSkipRating}>
              <Text style={styles.skipRatingText}>Skip</Text>
            </TouchableOpacity> */}
            <TouchableOpacity style={styles.submitRatingButton} onPress={handleRatingSubmit}>
              <Text style={styles.submitRatingText}>Submit Review</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Tracking</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderProgressBar()}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Provider</Text>
          <View style={styles.providerDetailsCard}>
            <View style={styles.providerHeader}>
              <Image source={{ uri: providerData.photo }} style={styles.providerPhoto} />
              <View style={styles.providerInfo}>
                <Text style={styles.providerName}>{providerData.name}</Text>
                <View style={styles.ratingContainer}>
                  {renderStars(providerData.rating)}
                  <Text style={styles.ratingText}>({providerData.reviews} reviews)</Text>
                </View>
                <Text style={styles.VisitCharge}>Visit Charges: PKR {amount}</Text>
              </View>
            </View>
            <View style={styles.contactButtons}>
              <TouchableOpacity 
                style={styles.contactButton}
                onPress={() => Alert.alert(
                  `Contact ${providerData.name}`,
                  `Phone: +92 300 1234567`,
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Call', onPress: () => Linking.openURL('tel:+923001234567') }
                  ]
                )}
              >
                <Phone size={20} color="#05f51d" />
                <Text style={styles.contactButtonText}>Call</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity style={styles.contactButton} onPress={() => setShowChatModal(true)}>
                <MessageCircle size={20} color="#05f51d" />
                <Text style={styles.contactButtonText}>Chat</Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Details</Text>
          <View style={styles.serviceDetailsCard}>
            {categoriesData.map((category: any, idx: number) => (
              <View key={idx} style={styles.categorySection}>
                <Text style={styles.serviceCategory}>{category.name}</Text>
                {subcategoriesData
                  .filter((service: any) => service.category === category.name)
                  .map((service: any, sIdx: number) => (
                    <Text key={sIdx} style={styles.serviceItem}>
                      • {service.name}
                    </Text>
                  ))}
              </View>
            ))}
            <View style={styles.bookingDetails}>
              <View style={styles.detailRow}>
                <Clock size={16} color="#666" />
                <Text style={styles.detailText}>
                  {bookingType === 'now'
                    ? 'Immediate Service'
                    : `${scheduleDate} at ${scheduleTime}`}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <MapPin size={16} color="#666" />
                <Text style={styles.detailText}>House no 85 G9/3 islam</Text>
              </View>
            </View>
            <Text style={styles.jobDescription}>{description}</Text>
          </View>
        </View>

        {/* {(currentStatus === 'arriving' || currentStatus === 'arrived') && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Live Location</Text>
            <View style={styles.mapContainer}>
              <View style={styles.mockMap}>
                <View 
                  style={[
                    styles.driverLocationContainer,
                    { 
                      top: `${20 + (driverLocation.lat - 24.8607) * 10000}%`,
                      right: `${30 + (driverLocation.lng - 67.0011) * 10000}%`
                    }
                  ]}
                >
                  <View style={styles.driverMarker}>
                    <Navigation size={16} color="#fff" />
                  </View>
                  <Text style={styles.driverLocationText}>{providerData.name}</Text>
                </View>
                <View style={styles.customerLocationContainer}>
                  <View style={styles.customerMarker}>
                    <MapPin size={16} color="#fff" />
                  </View>
                  <Text style={styles.customerLocationText}>Your Location</Text>
                </View>
                <View style={styles.routeLine} />
                <View style={styles.locationInfo}>
                  <Text style={styles.mapText}>
                    {currentStatus === 'arriving'
                      ? 'Provider is on the way'
                      : 'Provider has arrived'}
                  </Text>
                  <Text style={styles.etaText}>
                    {currentStatus === 'arriving' ? 'ETA: 5 minutes' : 'At your location'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )} */}
      </ScrollView>

      {currentStatus !== 'completed' && (
        <View style={styles.bottomSection}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setShowCancelModal(true)}>
            <Text style={styles.cancelButtonText}>Cancel Booking</Text>
          </TouchableOpacity>
        </View>
      )}

      {renderCancelModal()}
      {renderPaymentModal()}
      {renderRatingModal()}
      
      {/* <ChatModal
        visible={showChatModal}
        onClose={() => setShowChatModal(false)}
        providerName={providerData.name}
        jobId="job123"
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#19034d',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#19034d',
    marginBottom: 16,
  },
  progressSection: {
    marginBottom: 32,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#19034d',
    marginBottom: 16,
    textAlign: 'center',
  },
  progressContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 20,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e5e5e5',
    borderRadius: 3,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#05f51d',
    borderRadius: 3,
  },
  statusSteps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusStep: {
    alignItems: 'center',
    flex: 1,
  },
  statusDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e5e5e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  completedDot: {
    backgroundColor: '#05f51d',
  },
  currentDot: {
    backgroundColor: '#05f51d',
    borderWidth: 3,
    borderColor: '#f0fff1',
  },
  statusLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  completedLabel: {
    color: '#05f51d',
    fontWeight: '600',
  },
  currentLabel: {
    color: '#05f51d',
    fontWeight: '600',
  },
  providerDetailsCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 20,
  },
  providerHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  providerPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  providerInfo: {
    flex: 1,
    gap: 4,
  },
  providerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#19034d',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
  },
  VisitCharge: {
    fontSize: 14,
    fontWeight: '600',
    color: '#05f51d',
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: '#05f51d',
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#05f51d',
  },
  serviceDetailsCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 20,
  },
  categorySection: {
    marginBottom: 16,
  },
  serviceCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: '#19034d',
    marginBottom: 8,
  },
  serviceItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  bookingDetails: {
    gap: 8,
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#333',
  },
  jobDescription: {
    fontSize: 14,
    color: '#333',
    fontStyle: 'italic',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mockMap: {
    flex: 1,
    backgroundColor: '#f0fff1',
    position: 'relative',
    justifyContent: 'flex-end',
    padding: 16,
  },
  driverLocationContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  driverMarker: {
    width: 24,
    height: 24,
    backgroundColor: '#05f51d',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  driverLocationText: {
    fontSize: 10,
    color: '#19034d',
    fontWeight: '600',
  },
  customerLocationContainer: {
    position: 'absolute',
    bottom: 40,
    left: 30,
    alignItems: 'center',
  },
  customerMarker: {
    width: 24,
    height: 24,
    backgroundColor: '#19034d',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  customerLocationText: {
    fontSize: 10,
    color: '#19034d',
    fontWeight: '600',
  },
  routeLine: {
    position: 'absolute',
    top: 44,
    left: 42,
    right: 42,
    height: 2,
    backgroundColor: '#05f51d',
    opacity: 0.6,
  },
  locationInfo: {
    alignItems: 'center',
    gap: 4,
  },
  mapText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#19034d',
     marginTop: '10%',
  },
  etaText: {
    fontSize: 14,
    color: '#05f51d',
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
  },
  cancelButton: {
    backgroundColor: '#fee2e2',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dc2626',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc2626',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#19034d',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  reasonsList: {
    maxHeight: 300,
    marginBottom: 20,
  },
  reasonItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedReason: {
    backgroundColor: '#f0fff1',
    borderColor: '#05f51d',
  },
  reasonText: {
    fontSize: 14,
    color: '#333',
  },
  selectedReasonText: {
    color: '#05f51d',
    fontWeight: '600',
  },
  confirmCancelButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  paymentDetails: {
    alignItems: 'center',
    marginVertical: 24,
  },
  paymentLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  paymentAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#05f51d',
  },
  payButton: {
    backgroundColor: '#05f51d',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#19034d',
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  ratingProviderPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  ratingProviderName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#19034d',
    marginBottom: 16,
  },
  starRating: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  reviewInput: {
    width: '100%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: '#333',
    textAlignVertical: 'top',
    minHeight: 80,
  },
  submitRatingButton: {
    backgroundColor: '#05f51d',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitRatingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#19034d',
  },
  
  skipRatingButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  skipRatingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
});