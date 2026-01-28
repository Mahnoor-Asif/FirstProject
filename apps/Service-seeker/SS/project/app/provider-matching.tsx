// import React, { useState, useEffect, useRef } from 'react';
// import { 
//   View, 
//   Text, 
//   ScrollView, 
//   TouchableOpacity, 
//   Image, 
//   StyleSheet, 
//   ActivityIndicator
// } from 'react-native';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import { ArrowLeft, Star, User } from 'lucide-react-native';
// import { io, Socket } from 'socket.io-client';

// export default function ProviderMatchingScreen() {
//   const router = useRouter();
//   const { job, provider } = useLocalSearchParams();

//   const parsedJob = job ? JSON.parse(decodeURIComponent(job as string)) : null;
//   const initialProvider = provider ? [JSON.parse(decodeURIComponent(provider as string))] : [];

//   const [providers, setProviders] = useState<any[]>(initialProvider);
//   const [loading, setLoading] = useState(initialProvider.length === 0);
//   const socketRef = useRef<Socket | null>(null);

//   useEffect(() => {
//     socketRef.current = io('http://172.21.244.120:5000');

//     socketRef.current.on('connect', () => console.log('✅ Connected to socket'));
//     socketRef.current.on('disconnect', () => console.log('❌ Disconnected'));

//     socketRef.current.on('jobAcceptedNotification', (providerData) => {
//       console.log('Provider accepted job:', providerData);
//       setProviders((prev) => [...prev, providerData]);
//       setLoading(false);
//     });

//     return () => {
//       socketRef.current?.disconnect();
//     };
//   }, []);

//   // ✅ Accept navigation
//   const handleAcceptProvider = (provider: any) => {
//     router.push({
//       pathname: '/job-tracking',
//       params: {
//         job: encodeURIComponent(JSON.stringify(parsedJob)),
//         provider: encodeURIComponent(JSON.stringify(provider)),
//       },
//     });
//   };

//   // ✅ Reject just removes the provider
//   const handleRejectProvider = (providerId: any) => {
//     setProviders((prev) => prev.filter((p) => p.providerId !== providerId));
//   };

//   const renderStars = (rating: number) =>
//     Array.from({ length: 5 }, (_, i) => (
//       <Star
//         key={i}
//         size={14}
//         color={i < Math.floor(rating) ? '#f59e0b' : '#d1d5db'}
//         fill={i < Math.floor(rating) ? '#f59e0b' : 'transparent'}
//       />
//     ));

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.back()}>
//           <ArrowLeft size={24} color="#fff" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Available Providers</Text>
//         <View style={{ width: 24 }} />
//       </View>

//       {/* Job Summary */}
//       {parsedJob && (
//         <View style={styles.jobSummary}>
//           <Text style={styles.jobCategory}>{parsedJob.category}</Text>
//           <Text style={styles.jobSubcategory}>{parsedJob.subcategory}</Text>
//           <Text style={styles.jobLocation}>📍 {parsedJob.location}</Text>
//           <Text style={styles.jobDescription}>{parsedJob.description}</Text>
//         </View>
//       )}

//       {/* Providers List */}
//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         {loading ? (
//           <ActivityIndicator size="large" color="#19034d" style={{ marginTop: 50 }} />
//         ) : providers.length === 0 ? (
//           <View style={styles.emptyState}>
//             <User size={48} color="#9CA3AF" />
//             <Text style={styles.emptyText}>No providers available yet</Text>
//           </View>
//         ) : (
//           providers.map((provider) => (
//             <View key={provider.providerId} style={styles.providerCard}>
//               <View style={styles.providerHeader}>
//                 <Image
//                   source={{ uri: provider.photo || 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
//                   style={styles.providerPhoto}
//                 />
//                 <View style={{ flex: 1 }}>
//                   <Text style={styles.providerName}>{provider.providerName || 'John Doe'}</Text>
//                   <View style={styles.ratingRow}>
//                     {renderStars(provider.rating || 4.5)}
//                     <Text style={styles.ratingText}>
//                       {provider.rating || 4.5} ({provider.reviews || 12} reviews)
//                     </Text>
//                   </View>
//                 </View>
//               </View>

//               <View style={styles.buttonRow}>
//                 <TouchableOpacity
//                   style={styles.rejectButton}
//                   onPress={() => handleRejectProvider(provider.providerId)}
//                 >
//                   <Text style={styles.rejectButtonText}>Reject</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={styles.acceptButton}
//                   onPress={() => handleAcceptProvider(provider)}
//                 >
//                   <Text style={styles.acceptButtonText}>Accept</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           ))
//         )}
//       </ScrollView>
//     </View>
//   );
// }

// // Styles remain same as before

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#FFFFFF' },

//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: '#19034d',
//     paddingHorizontal: 20,
//     paddingVertical: 18,
//     paddingTop: 50,
//   },
//   headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },

//   jobSummary: {
//     backgroundColor: '#f8f9fa',
//     margin: 16,
//     padding: 16,
//     borderRadius: 12,
//     borderLeftWidth: 4,
//     borderLeftColor: '#19034d',
//   },
//   jobCategory: { fontSize: 16, fontWeight: '700', color: '#19034d' },
//   jobSubcategory: { fontSize: 14, color: '#444', marginTop: 2 },
//   jobLocation: { fontSize: 13, color: '#666', marginTop: 6 },
//   jobDescription: { fontSize: 13, color: '#666', marginTop: 8 },

//   content: { flex: 1, paddingHorizontal: 16, paddingBottom: 30 },

//   providerCard: {
//     backgroundColor: '#f8f9fa',
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },

//   providerHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   providerPhoto: { width: 64, height: 64, borderRadius: 32, marginRight: 16 },
//   providerName: { fontSize: 17, fontWeight: '700', color: '#19034d' },
//   ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 6 },
//   ratingText: { fontSize: 12, color: '#666' },

//   buttonRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
//   rejectButton: {
//     flex: 1,
//     backgroundColor: '#fee2e2',
//     borderWidth: 1,
//     borderColor: '#dc2626',
//     borderRadius: 8,
//     paddingVertical: 10,
//     alignItems: 'center',
//   },
//   rejectButtonText: { fontSize: 14, fontWeight: '600', color: '#dc2626' },
//   acceptButton: {
//     flex: 2,
//     backgroundColor: '#05f51d',
//     borderRadius: 8,
//     paddingVertical: 10,
//     alignItems: 'center',
//   },
//   acceptButtonText: { fontSize: 14, fontWeight: '700', color: '#19034d' },

//   emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 60 },
//   emptyText: { marginTop: 10, fontSize: 14, color: '#6b7280' },

//   // 🔹 Modal styles
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContainer: {
//     width: '80%',
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 24,
//     alignItems: 'center',
//   },
//   modalTitle: { fontSize: 18, fontWeight: '700', color: '#19034d', marginTop: 12 },
//   modalMessage: { fontSize: 14, color: '#555', textAlign: 'center', marginTop: 8 },
//   modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, width: '100%' },
//   modalCancel: {
//     flex: 1,
//     backgroundColor: '#e5e7eb',
//     borderRadius: 8,
//     paddingVertical: 10,
//     alignItems: 'center',
//     marginRight: 10,
//   },
//   modalConfirm: {
//     flex: 1,
//     backgroundColor: '#dc2626',
//     borderRadius: 8,
//     paddingVertical: 10,
//     alignItems: 'center',
//   },
//   modalCancelText: { color: '#333', fontWeight: '600' },
//   modalConfirmText: { color: '#fff', fontWeight: '700' },
// });


import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Star, MapPin, Clock } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';

const mockProviders = [
  // {
  //   id: 1,
  //   name: 'Ahmad Ali',
  //   photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
  //   rating: 4.8,
  //   reviews: 127,
  //   distance: '0.5 km away',
  //   VisitCharge: null,
  //   responseTime: '2 mins',
  // },
  // {
  //   id: 2,
  //   name: 'Sara Khan',
  //   photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
  //   rating: 4.9,
  //   reviews: 89,
  //   distance: '1.2 km away',
  //   VisitCharge: 500,
  //   responseTime: '5 mins',
  // },
  {
    id: 3,
    name: 'Mahnoor Asif',
    // photo: https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 4.7,
    reviews: 156,
    distance: '2.1 km away',
    VisitCharge: 500,
    responseTime: '1 min',
  },
];

export default function ProviderMatchingScreen() {
  const router = useRouter();
  const { categories, subcategories, bookingType, amount, description, scheduleDate, scheduleTime } = useLocalSearchParams();
  const [providers, setProviders] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(true);

  const searchOpacity = useSharedValue(0.3);

  const animatedSearchStyle = useAnimatedStyle(() => ({
    opacity: searchOpacity.value,
  }));

  useEffect(() => {
    searchOpacity.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
    const timer = setTimeout(() => {
      setProviders(mockProviders);
      setIsSearching(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleAcceptProvider = (provider: any) => {
    const finalAmount = provider.counterBid || amount;
    router.push({
      pathname: '/job-tracking',
      params: {
        provider: JSON.stringify(provider),
        categories,
        subcategories,
        bookingType,
        amount: finalAmount,
        description,
        scheduleDate,
        scheduleTime,
      },
    });
  };

  const handleRejectProvider = (providerId: number) => {
    setProviders((prev) => prev.filter((p) => p.id !== providerId));
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

  if (isSearching) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" backgroundColor="#19034d" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitleWhite}>Finding Providers</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.searchingContainer}>
          <Animated.View style={[styles.searchingIcon, animatedSearchStyle]}>
            <View style={styles.searchingDot} />
          </Animated.View>
          <Text style={styles.searchingTitle}>Searching for providers...</Text>
          <Text style={styles.searchingSubtitle}>We're finding the best service providers near you</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#19034d" />
      <View style={[styles.header, styles.headerBlue]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitleWhite}>Available Providers</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>{providers.length} providers found near you</Text>

        {providers.map((provider) => (
          <View key={provider.id} style={styles.providerCard}>
            <View style={styles.providerHeader}>
              <Image source={{ uri: provider.photo }} style={styles.providerPhoto} />
              <View style={styles.providerInfo}>
                <Text style={styles.providerName}>{provider.name}</Text>
                <View style={styles.ratingContainer}>
                  {renderStars(provider.rating)}
                  <Text style={styles.ratingText}>
                    {provider.rating} ({provider.reviews} reviews)
                  </Text>
                </View>
                <View style={styles.locationContainer}>
                  <MapPin size={14} color="#666" />
                  <Text style={styles.locationText}>{provider.distance}</Text>
                </View>
                <View style={styles.responseContainer}>
                  <Clock size={14} color="#666" />
                  <Text style={styles.responseText}>Responded in {provider.responseTime}</Text>
                </View>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.rejectButton} onPress={() => handleRejectProvider(provider.id)}>
                <Text style={styles.rejectButtonText}>Reject</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.acceptButton} onPress={() => handleAcceptProvider(provider)}>
                <Text style={styles.acceptButtonText}>Accept</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {providers.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No providers available</Text>
            <Text style={styles.emptyStateText}>Try adjusting your location or increasing your bid amount</Text>
          </View>
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
    marginBottom: 10,
  },
  headerBlue: {
    backgroundColor: '#19034d',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleWhite: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  placeholder: { width: 40 },
  content: { flex: 1, paddingHorizontal: 24 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 24, textAlign: 'center' },
  searchingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  searchingIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0fff1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  searchingDot: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#05f51d' },
  searchingTitle: { fontSize: 20, fontWeight: '600', color: '#19034d', marginBottom: 8, textAlign: 'center' },
  searchingSubtitle: { fontSize: 14, color: '#666', textAlign: 'center' },
  providerCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  providerHeader: { flexDirection: 'row', marginBottom: 16 },
  providerPhoto: { width: 60, height: 60, borderRadius: 30, marginRight: 16 },
  providerInfo: { flex: 1, gap: 4 },
  providerName: { fontSize: 18, fontWeight: '600', color: '#19034d' },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ratingText: { fontSize: 12, color: '#666' },
  locationContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { fontSize: 12, color: '#666' },
  responseContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  responseText: { fontSize: 12, color: '#05f51d', fontWeight: '500' },
  actionButtons: { flexDirection: 'row', gap: 12 },
  rejectButton: {
    flex: 1,
    backgroundColor: '#fee2e2',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dc2626',
  },
  rejectButtonText: { fontSize: 14, fontWeight: '600', color: '#dc2626' },
  acceptButton: {
    flex: 2,
    backgroundColor: '#05f51d',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButtonText: { fontSize: 14, fontWeight: '600', color: '#19034d' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 80 },
  emptyStateTitle: { fontSize: 18, fontWeight: '600', color: '#19034d', marginBottom: 8 },
  emptyStateText: { fontSize: 14, color: '#666', textAlign: 'center' },
});
