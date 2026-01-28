// import { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
// import * as Location from 'expo-location';
// import { Menu, Bell, MapPin, Radio } from 'lucide-react-native';
// import {Sidebar} from '@/components/Sidebar';
// import JobDetailModal from '@/components/JobDetailModal';
// import { Job } from '@/context/AppContext';

// export default function Dashboard() {
//   const [sidebarVisible, setSidebarVisible] = useState(false);
//   const [isOnline, setIsOnline] = useState(false);
//   const [locationShared, setLocationShared] = useState(false);
//   const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
//   const [selectedJob, setSelectedJob] = useState<Job | null>(null);
//   const [jobModalVisible, setJobModalVisible] = useState(false);
//   const [jobs, setJobs] = useState<Job[]>([
//     {
//       id: '1',
//       visitCharges: 500,
//       customerName: 'Ahmed Ali',
//       customerPhone: '+92 300 1234567',
//       location: {
//         address: '123 Main Street, Karachi',
//         latitude: 24.8607,
//         longitude: 67.0011,
//       },
//       category: 'Electrician',
//       subcategory: 'AC Repair',
//       bookingType: 'bookNow',
//       description: 'AC not cooling properly. Need immediate inspection and repair.',
//       images: [],
//       status: 'pending',
//     },
//     {
//       id: '2',
//       visitCharges: 700,
//       customerName: 'Sara Khan',
//       customerPhone: '+92 321 9876543',
//       location: {
//         address: '456 Garden Avenue, Lahore',
//         latitude: 31.5497,
//         longitude: 74.3436,
//       },
//       category: 'Plumber',
//       subcategory: 'Leak Repair',
//       bookingType: 'scheduled',
//       scheduledDateTime: '2025-10-14 10:00 AM',
//       description: 'Kitchen sink is leaking. Need to fix urgently.',
//       images: [],
//       status: 'pending',
//     },
//   ]);
//   const [acceptedJobs, setAcceptedJobs] = useState<Job[]>([]);
//   const [ongoingJob, setOngoingJob] = useState<Job | null>(null);

//   const toggleOnline = () => {
//     if (!locationShared) {
//       Alert.alert('Location Required', 'Please share your location first to go online');
//       return;
//     }
//     setIsOnline(!isOnline);
//   };

//   const toggleLocationSharing = async () => {
//     if (!locationShared) {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission Denied', 'Location permission is required to share your location');
//         return;
//       }

//       const location = await Location.getCurrentPositionAsync({});
//       setCurrentLocation({
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//       });
//       setLocationShared(true);
//       Alert.alert('Location Shared', 'Your location is now being shared');
//     } else {
//       setLocationShared(false);
//       setIsOnline(false);
//       Alert.alert('Location Stopped', 'Location sharing has been stopped');
//     }
//   };

//   const handleViewJob = (job: Job) => {
//     setSelectedJob(job);
//     setJobModalVisible(true);
//   };

//   const handleAcceptJob = () => {
//     if (selectedJob) {
//       const updatedJob = { ...selectedJob, status: 'accepted' as const, acceptedAt: new Date().toISOString() };
//       setJobs(jobs.filter((j) => j.id !== selectedJob.id));
//       setAcceptedJobs([...acceptedJobs, updatedJob]);
//       setJobModalVisible(false);
//       Alert.alert('Job Accepted', 'You have accepted this job. Navigate to the location to start.');
//     }
//   };

//   const handleRejectJob = () => {
//     if (selectedJob) {
//       setJobs(jobs.filter((j) => j.id !== selectedJob.id));
//       setJobModalVisible(false);
//       Alert.alert('Job Rejected', 'You have rejected this job');
//     }
//   };

//   const handleStartJob = () => {
//     if (selectedJob) {
//       const updatedJob = { ...selectedJob, status: 'ongoing' as const, startedAt: new Date().toISOString() };
//       setAcceptedJobs(acceptedJobs.filter((j) => j.id !== selectedJob.id));
//       setOngoingJob(updatedJob);
//       setJobModalVisible(false);
//       Alert.alert('Job Started', 'Timer has started. Complete the job and click End when finished.');
//     }
//   };

//   const handleEndJob = () => {
//     if (selectedJob && ongoingJob) {
//       Alert.alert(
//         'Job Completed',
//         `Visit charges: PKR ${ongoingJob.visitCharges}\n\nThe job has been marked as completed.`,
//         [
//           {
//             text: 'OK',
//             onPress: () => {
//               setOngoingJob(null);
//               setJobModalVisible(false);
//             },
//           },
//         ]
//       );
//     }
//   };

//   const handleCancelJob = () => {
//     Alert.alert('Cancel Job', 'Are you sure you want to cancel this job?', [
//       { text: 'No', style: 'cancel' },
//       {
//         text: 'Yes',
//         style: 'destructive',
//         onPress: () => {
//           if (selectedJob) {
//             if (selectedJob.status === 'accepted') {
//               setAcceptedJobs(acceptedJobs.filter((j) => j.id !== selectedJob.id));
//             } else if (selectedJob.status === 'ongoing') {
//               setOngoingJob(null);
//             }
//             setJobModalVisible(false);
//           }
//         },
//       },
//     ]);
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => setSidebarVisible(true)}>
//           <Menu size={28} color="#fff" />
//         </TouchableOpacity>
//         <Text style={styles.logoText}>SP</Text>
//         <TouchableOpacity>
//           <Bell size={28} color="#fff" />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.controls}>
//         <View style={styles.controlRow}>
//           <Text style={styles.controlLabel}>Status:</Text>
//           <TouchableOpacity
//             style={[styles.statusButton, isOnline && styles.statusButtonOnline]}
//             onPress={toggleOnline}
//           >
//             <Radio size={16} color={isOnline ? '#05f51d' : '#999'} />
//             <Text style={[styles.statusText, isOnline && styles.statusTextOnline]}>
//               {isOnline ? 'Online' : 'Offline'}
//             </Text>
//           </TouchableOpacity>
//         </View>

//         <TouchableOpacity
//           style={[styles.locationButton, locationShared && styles.locationButtonActive]}
//           onPress={toggleLocationSharing}
//         >
//           <MapPin size={20} color={locationShared ? '#19034d' : '#fff'} />
//           <Text style={[styles.locationButtonText, locationShared && styles.locationButtonTextActive]}>
//             {locationShared ? 'Location Shared' : 'Share Location'}
//           </Text>
//         </TouchableOpacity>
//       </View>

//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         {ongoingJob && (
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Ongoing Job</Text>
//             <TouchableOpacity
//               style={[styles.jobCard, styles.ongoingJobCard]}
//               onPress={() => handleViewJob(ongoingJob)}
//             >
//               <View style={styles.jobHeader}>
//                 <Text style={styles.jobCategory}>{ongoingJob.category}</Text>
//                 <Text style={styles.jobCharges}>PKR {ongoingJob.visitCharges}</Text>
//               </View>
//               <Text style={styles.jobCustomer}>{ongoingJob.customerName}</Text>
//               <Text style={styles.jobLocation} numberOfLines={1}>
//                 {ongoingJob.location.address}
//               </Text>
//               <View style={styles.jobBadge}>
//                 <Text style={styles.jobBadgeText}>In Progress</Text>
//               </View>
//             </TouchableOpacity>
//           </View>
//         )}

//         {acceptedJobs.length > 0 && (
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Accepted Jobs</Text>
//             {acceptedJobs.map((job) => (
//               <TouchableOpacity
//                 key={job.id}
//                 style={[styles.jobCard, styles.acceptedJobCard]}
//                 onPress={() => handleViewJob(job)}
//               >
//                 <View style={styles.jobHeader}>
//                   <Text style={styles.jobCategory}>{job.category}</Text>
//                   <Text style={styles.jobCharges}>PKR {job.visitCharges}</Text>
//                 </View>
//                 <Text style={styles.jobCustomer}>{job.customerName}</Text>
//                 <Text style={styles.jobLocation} numberOfLines={1}>
//                   {job.location.address}
//                 </Text>
//                 <View style={styles.jobBadge}>
//                   <Text style={styles.jobBadgeText}>Accepted</Text>
//                 </View>
//               </TouchableOpacity>
//             ))}
//           </View>
//         )}

//         {isOnline && locationShared && jobs.length > 0 && (
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Incoming Requests</Text>
//             {jobs.map((job) => (
//               <TouchableOpacity
//                 key={job.id}
//                 style={[
//                   styles.jobCard,
//                   job.bookingType === 'bookNow' ? styles.bookNowCard : styles.scheduledCard,
//                 ]}
//                 onPress={() => handleViewJob(job)}
//               >
//                 <View style={styles.jobHeader}>
//                   <Text style={styles.jobCategory}>{job.category}</Text>
//                   <Text style={styles.jobCharges}>PKR {job.visitCharges}</Text>
//                 </View>
//                 <Text style={styles.jobSubcategory}>{job.subcategory}</Text>
//                 <Text style={styles.jobCustomer}>{job.customerName}</Text>
//                 <Text style={styles.jobLocation} numberOfLines={1}>
//                   {job.location.address}
//                 </Text>
//                 <View style={styles.jobBadge}>
//                   <Text style={styles.jobBadgeText}>
//                     {job.bookingType === 'bookNow' ? 'Book Now' : 'Scheduled'}
//                   </Text>
//                 </View>
//               </TouchableOpacity>
//             ))}
//           </View>
//         )}

//         {!isOnline && (
//           <View style={styles.offlineMessage}>
//             <Text style={styles.offlineMessageText}>
//               You are offline. Go online to receive job requests.
//             </Text>
//           </View>
//         )}

//         {isOnline && !locationShared && (
//           <View style={styles.offlineMessage}>
//             <Text style={styles.offlineMessageText}>Share your location to receive nearby jobs.</Text>
//           </View>
//         )}
//       </ScrollView>

//       <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />

//       <JobDetailModal
//         visible={jobModalVisible}
//         job={selectedJob}
//         onClose={() => setJobModalVisible(false)}
//         onAccept={selectedJob?.status === 'pending' ? handleAcceptJob : undefined}
//         onReject={selectedJob?.status === 'pending' ? handleRejectJob : undefined}
//         onStart={selectedJob?.status === 'accepted' ? handleStartJob : undefined}
//         onEnd={selectedJob?.status === 'ongoing' ? handleEndJob : undefined}
//         onCancel={
//           selectedJob?.status === 'accepted' || selectedJob?.status === 'ongoing'
//             ? handleCancelJob
//             : undefined
//         }
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   header: {
//     backgroundColor: '#19034d',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingTop: 50,
//     paddingBottom: 16,
//     paddingHorizontal: 20,
//   },
//   logoText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#05f51d',
//   },
//   controls: {
//     backgroundColor: '#19034d',
//     paddingHorizontal: 20,
//     paddingBottom: 16,
//     gap: 12,
//   },
//   controlRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   controlLabel: {
//     fontSize: 16,
//     color: '#fff',
//     fontWeight: '600',
//   },
//   statusButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     gap: 8,
//   },
//   statusButtonOnline: {
//     backgroundColor: '#05f51d',
//   },
//   statusText: {
//     fontSize: 14,
//     color: '#999',
//     fontWeight: '600',
//   },
//   statusTextOnline: {
//     color: '#19034d',
//   },
//   locationButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     paddingVertical: 12,
//     borderRadius: 8,
//     gap: 8,
//   },
//   locationButtonActive: {
//     backgroundColor: '#05f51d',
//   },
//   locationButtonText: {
//     fontSize: 14,
//     color: '#fff',
//     fontWeight: '600',
//   },
//   locationButtonTextActive: {
//     color: '#19034d',
//   },
//   content: {
//     flex: 1,
//   },
//   section: {
//     padding: 20,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#19034d',
//     marginBottom: 12,
//   },
//   jobCard: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     borderWidth: 2,
//   },
//   bookNowCard: {
//     borderColor: '#ff6b6b',
//   },
//   scheduledCard: {
//     borderColor: '#4dabf7',
//   },
//   acceptedJobCard: {
//     borderColor: '#ffd43b',
//   },
//   ongoingJobCard: {
//     borderColor: '#05f51d',
//   },
//   jobHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   jobCategory: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#19034d',
//   },
//   jobCharges: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#05f51d',
//   },
//   jobSubcategory: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 4,
//   },
//   jobCustomer: {
//     fontSize: 14,
//     color: '#333',
//     fontWeight: '500',
//     marginBottom: 4,
//   },
//   jobLocation: {
//     fontSize: 12,
//     color: '#999',
//     marginBottom: 8,
//   },
//   jobBadge: {
//     backgroundColor: '#f0ebf8',
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     borderRadius: 12,
//     alignSelf: 'flex-start',
//   },
//   jobBadgeText: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#19034d',
//   },
//   offlineMessage: {
//     margin: 20,
//     padding: 20,
//     backgroundColor: '#f0f0f0',
//     borderRadius: 12,
//     alignItems: 'center',
//   },
//   offlineMessageText: {
//     fontSize: 14,
//     color: '#666',
//     textAlign: 'center',
//   },
// });


// app/index.tsx
import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/splash" />;
}
