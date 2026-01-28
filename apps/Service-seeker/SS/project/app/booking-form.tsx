// import React, { useState, useEffect } from 'react';
// import { 
//   View, Text, StyleSheet, ScrollView, TextInput, 
//   TouchableOpacity, Alert, Image 
// } from 'react-native';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import * as ImagePicker from 'expo-image-picker';
// import DateTimePickerModal from 'react-native-modal-datetime-picker';
// import { StatusBar } from 'expo-status-bar';
// import { 
//   ArrowLeft, User, Mail, Phone, MapPin, Calendar, 
//   Clock, FileText, Camera, ChevronDown 
// } from 'lucide-react-native';
// import { io } from 'socket.io-client';
// import * as DocumentPicker from 'expo-document-picker';


// export default function BookingFormScreen() {
//   const router = useRouter();
//   const { categories, subcategories } = useLocalSearchParams();

//   // ---------------- STATES ----------------
//   const [bookingType, setBookingType] = useState<'now' | 'schedule'>('now');
//   const [amount] = useState('500');
//   const [description, setDescription] = useState('');
//   const [scheduleDate, setScheduleDate] = useState('');
//   const [scheduleTime, setScheduleTime] = useState('');
//   const [selectedImage, setSelectedImage] = useState<string | null>(null); // Base64 image
//   const [loading, setLoading] = useState(false);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [showTimePicker, setShowTimePicker] = useState(false);
//   const [bookingStatus, setBookingStatus] = useState<string | null>(null);

//   const selectedCategories = JSON.parse(categories || '[]');
//   const selectedServices = JSON.parse(subcategories || '[]');

//   // ---------------- SOCKET.IO FOR REAL-TIME STATUS ----------------
//   useEffect(() => {
//     const CUSTOMER_ID = '12345'; // replace with actual logged-in user ID
//     const socket = io('http://172.21.244.120:5000'); // backend URL

//     socket.emit('joinRoom', CUSTOMER_ID);

//     socket.on('bookingStatusUpdate', (booking: any) => {
//       Alert.alert(
//         `Booking ${booking.status}`,
//         `Your booking for "${booking.description}" has been ${booking.status}`
//       );
//       setBookingStatus(booking.status);
//     });

//     return () => socket.disconnect();
//   }, []);

// const pickImage = async () => {
//   try {
//     const result = await DocumentPicker.getDocumentAsync({
//       type: 'image/*',
//       copyToCacheDirectory: true,
//       base64: true,
//     });

//     if (result.type === 'success') {
//       const base64Image = `data:image/jpeg;base64,${result.base64}`;
//       setSelectedImage(base64Image);
//     }
//   } catch (err) {
//     console.error(err);
//     Alert.alert('Error', 'Cannot pick image');
//   }
// };

//   const takePhoto = async () => {
//     const { status } = await ImagePicker.requestCameraPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Permission Required', 'We need camera access.');
//       return;
//     }

//     const result = await ImagePicker.launchCameraAsync({
//       allowsEditing: true,
//       quality: 1,
//       base64: true,
//     });

//     if (!result.canceled) {
//       const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
//       setSelectedImage(base64Image);
//     }
//   };

//   // ---------------- DATE & TIME PICKER ----------------
//   const handleConfirmDate = (date: Date) => {
//     setScheduleDate(date.toISOString().split('T')[0]);
//     setShowDatePicker(false);
//   };

//   const handleConfirmTime = (time: Date) => {
//     const hours = time.getHours().toString().padStart(2, '0');
//     const minutes = time.getMinutes().toString().padStart(2, '0');
//     setScheduleTime(`${hours}:${minutes}`);
//     setShowTimePicker(false);
//   };

//   // ---------------- SUBMIT BOOKING ----------------
//   const handleSubmit = async () => {
//     if (!description.trim()) return Alert.alert('Error', 'Please provide a job description');
//     if (bookingType === 'schedule' && (!scheduleDate || !scheduleTime))
//       return Alert.alert('Error', 'Please select date and time');

//     setLoading(true);
//     const formData = new FormData();
//     formData.append('name', 'Fatima Noor');
//     formData.append('email', 'Fatima@email.com');
//     formData.append('phone', '+92 300 1234567');
//     formData.append('address', 'House 25 G-9/3,isla');
//     formData.append('categories', JSON.stringify(selectedCategories));
//     formData.append('subcategories', JSON.stringify(selectedServices));
//     formData.append('bookingType', bookingType);
//     formData.append('amount', amount);
//     formData.append('description', description);
//     formData.append('scheduleDate', scheduleDate);
//     formData.append('scheduleTime', scheduleTime);
//     formData.append('customerId', '12345');

//     if (selectedImage) {
//       // Convert Base64 to Blob for FormData
//       const blob = await fetch(selectedImage).then(res => res.blob());
//       formData.append('image', blob);
//     }

//     try {
//       const response = await fetch('http://172.21.244.120:5000/api/bookings', {
//         method: 'POST',
//         body: formData,
//       });
//       const result = await response.json();
//       if (result.success) {
//         Alert.alert('Success', 'Booking submitted successfully!');
//         router.push('/provider-matching');
//       } else {
//         Alert.alert('Error', result.message || 'Something went wrong');
//       }
//     } catch (err) {
//       console.error(err);
//       Alert.alert('Error', 'Could not connect to server');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---------------- UI ----------------
//   return (
//     <View style={styles.container}>
//       <StatusBar style="light" backgroundColor="#19034d" />
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
//           <ArrowLeft size={24} color="#fff" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Book Service</Text>
//         <View style={{ width: 40 }} />
//       </View>

//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         {bookingStatus && (
//           <Text style={{ textAlign: 'center', marginVertical: 10, color: bookingStatus === 'accepted' ? 'green' : 'red' }}>
//             Your booking has been {bookingStatus}
//           </Text>
//         )}

//         {/* Your Information */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Your Information</Text>
//           <View style={styles.infoBox}>
//             <View style={styles.infoRow}><User size={20} color="#666" /><Text style={styles.infoText}>Fatima Noor </Text></View>
//             <View style={styles.infoRow}><Mail size={20} color="#666" /><Text style={styles.infoText}>fatima@gmail.com</Text></View>
//             <View style={styles.infoRow}><Phone size={20} color="#666" /><Text style={styles.infoText}>+92 300 1234567</Text></View>
//             <View style={styles.infoRow}><MapPin size={20} color="#666" /><Text style={styles.infoText}>House no 85 G9/3 islamabad</Text></View>
//           </View>
//         </View>

//         {/* Service Details */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Service Details</Text>
//           <View style={styles.serviceInfo}>
//             {selectedCategories.map((cat, i) => (
//               <View key={i} style={{ marginBottom: 12 }}>
//                 <Text style={styles.serviceCategory}>{cat.name}</Text>
//                 {selectedServices.filter(s => s.category === cat.name)
//                   .map((s, j) => <Text key={j} style={styles.serviceItem}>• {s.name}</Text>)}
//               </View>
//             ))}
//           </View>
//         </View>

//         {/* Booking Type */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Booking Type</Text>
//           <View style={{ flexDirection: 'row', gap: 12 }}>
//             <TouchableOpacity style={[styles.bookingOption, bookingType === 'now' && styles.selectedOption]} onPress={() => setBookingType('now')}>
//               <Text style={[styles.optionText, bookingType === 'now' && styles.selectedOptionText]}>Book Now</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={[styles.bookingOption, bookingType === 'schedule' && styles.selectedOption]} onPress={() => setBookingType('schedule')}>
//               <Text style={[styles.optionText, bookingType === 'schedule' && styles.selectedOptionText]}>Schedule</Text>
//             </TouchableOpacity>
//           </View>

//           {bookingType === 'schedule' && (
//             <View style={{ marginTop: 16, gap: 12 }}>
//               <TouchableOpacity style={styles.inputGroup} onPress={() => setShowDatePicker(true)}>
//                 <Calendar size={20} color="#666" />
//                 <Text style={[styles.input, !scheduleDate && { color: '#999' }]}>{scheduleDate || 'Select Date'}</Text>
//                 <ChevronDown size={20} color="#666" />
//               </TouchableOpacity>

//               <TouchableOpacity style={styles.inputGroup} onPress={() => setShowTimePicker(true)}>
//                 <Clock size={20} color="#666" />
//                 <Text style={[styles.input, !scheduleTime && { color: '#999' }]}>{scheduleTime || 'Select Time'}</Text>
//                 <ChevronDown size={20} color="#666" />
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>

//         {/* Job Description */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Job Description</Text>
//           <View style={styles.textAreaGroup}>
//             <FileText size={20} color="#666" />
//             <TextInput
//               style={styles.textArea}
//               placeholder="Describe your service requirements..."
//               value={description}
//               onChangeText={setDescription}
//               multiline
//               numberOfLines={4}
//               textAlignVertical="top"
//             />
//           </View>
//         </View>

//         {/* Attach Photos */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Attach Photos (Optional)</Text>
//           <View style={{ flexDirection: 'row', gap: 12 }}>
//             <TouchableOpacity style={styles.photoUpload} onPress={pickImage}>
//               <Camera size={24} color="#666" /><Text style={styles.photoUploadText}>Gallery</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.photoUpload} onPress={takePhoto}>
//               <Camera size={24} color="#666" /><Text style={styles.photoUploadText}>Camera</Text>
//             </TouchableOpacity>
//           </View>
//           {selectedImage && <Image source={{ uri: selectedImage }} style={{ width: 120, height: 120, marginTop: 12, borderRadius: 8 }} />}
//         </View>
//       </ScrollView>

//       <View style={{ padding: 24, paddingBottom: 32 }}>
//         <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
//           <Text style={styles.submitButtonText}>{loading ? "Submitting..." : bookingType === 'now' ? 'Find Providers' : 'Schedule Service'}</Text>
//         </TouchableOpacity>
//       </View>

//       <DateTimePickerModal
//         isVisible={showDatePicker}
//         mode="date"
//         onConfirm={handleConfirmDate}
//         onCancel={() => setShowDatePicker(false)}
//         minimumDate={new Date()}
//       />
//       <DateTimePickerModal
//         isVisible={showTimePicker}
//         mode="time"
//         onConfirm={handleConfirmTime}
//         onCancel={() => setShowTimePicker(false)}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff' },
//   header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 16, backgroundColor: '#19034d' },
//   backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
//   headerTitle: { fontSize: 18, fontWeight: '600', color: '#fff' },
//   content: { flex: 1, paddingHorizontal: 24 },
//   section: { marginBottom: 32 },
//   sectionTitle: { fontSize: 16, fontWeight: '600', color: '#19034d', marginBottom: 16 },
//   infoBox: { backgroundColor: '#f8f9fa', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#e5e5e5', gap: 12 },
//   infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
//   infoText: { fontSize: 16, color: '#333' },
//   serviceInfo: { backgroundColor: '#f8f9fa', padding: 16, borderRadius: 12 },
//   serviceCategory: { fontSize: 16, fontWeight: '600', color: '#19034d', marginBottom: 8 },
//   serviceItem: { fontSize: 14, color: '#666', marginBottom: 4 },
//   bookingOption: { flex: 1, backgroundColor: '#f8f9fa', padding: 16, borderRadius: 12, alignItems: 'center', borderWidth: 2, borderColor: 'transparent' },
//   selectedOption: { backgroundColor: '#f0fff1', borderColor: '#05f51d' },
//   optionText: { fontSize: 16, fontWeight: '500', color: '#333' },
//   selectedOptionText: { color: '#05f51d', fontWeight: '600' },
//   inputGroup: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9fa', borderRadius: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: '#e5e5e5', paddingVertical: 14, gap: 10 },
//   input: { flex: 1, fontSize: 16, color: '#333' },
//   textAreaGroup: { flexDirection: 'row', backgroundColor: '#f8f9fa', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#e5e5e5', alignItems: 'flex-start' },
//   textArea: { flex: 1, fontSize: 16, color: '#333', marginLeft: 12, minHeight: 80 },
//   photoUpload: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9fa', padding: 16, borderRadius: 12, borderWidth: 2, borderColor: '#e5e5e5', borderStyle: 'dashed', flex: 1, justifyContent: 'center' },
//   photoUploadText: { marginLeft: 8, fontSize: 16, color: '#666' },
//   submitButton: { backgroundColor: '#05f51d', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
//   submitButtonText: { fontSize: 16, fontWeight: '600', color: '#19034d' },
// });
// import React, { useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Modal } from 'react-native';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import { 
//   ArrowLeft, 
//   User, 
//   Mail, 
//   Phone, 
//   MapPin, 
//   Calendar, 
//   Clock, 
//   FileText, 
//   Camera,
//   Minus,
//   Plus,
//   ChevronDown
// } from 'lucide-react-native';

// export default function BookingFormScreen() {
//   const router = useRouter();
//   const { categories, subcategories } = useLocalSearchParams();
//   const [bookingType, setBookingType] = useState<'now' | 'schedule'>('now');
//   const [amount, setAmount] = useState('500');
//   const [description, setDescription] = useState('');
//   const [scheduleDate, setScheduleDate] = useState('');
//   const [scheduleTime, setScheduleTime] = useState('');
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [showTimePicker, setShowTimePicker] = useState(false);
  
//   const selectedCategories = JSON.parse(categories as string);
//   const selectedServices = JSON.parse(subcategories as string);

//   const timeSlots = [
//     '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
//     '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
//     '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'
//   ];

//   const generateDateOptions = () => {
//     const dates = [];
//     const today = new Date();
//     for (let i = 0; i < 30; i++) {
//       const date = new Date(today);
//       date.setDate(today.getDate() + i);
//       dates.push({
//         value: date.toISOString().split('T')[0],
//         label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : date.toLocaleDateString('en-US', { 
//           weekday: 'short', 
//           month: 'short', 
//           day: 'numeric' 
//         })
//       });
//     }
//     return dates;
//   };

//   const handleSubmit = () => {
//     if (!description.trim()) {
//       Alert.alert('Error', 'Please provide a job description');
//       return;
//     }

//     if (bookingType === 'schedule' && (!scheduleDate || !scheduleTime)) {
//       Alert.alert('Error', 'Please select date and time for scheduled booking');
//       return;
//     }

//     // Navigate to provider matching screen
//     router.push({
//       pathname: '/provider-matching',
//       params: {
//         categories: JSON.stringify(selectedCategories),
//         subcategories: JSON.stringify(selectedServices),
//         bookingType,
//         amount,
//         description,
//         scheduleDate,
//         scheduleTime,
//       }
//     });
//   };

//   const adjustAmount = (increment: boolean) => {
//     const currentAmount = parseInt(amount) || 0;
//     const newAmount = increment ? currentAmount + 50 : currentAmount - 50;
//     setAmount(Math.max(100, newAmount).toString());
//   };

//   const handleAmountChange = (text: string) => {
//     // Only allow numbers
//     const numericValue = text.replace(/[^0-9]/g, '');
//     setAmount(numericValue);
//   };

//   const selectDate = (date: string) => {
//     setScheduleDate(date);
//     setShowDatePicker(false);
//   };

//   const selectTime = (time: string) => {
//     setScheduleTime(time);
//     setShowTimePicker(false);
//   };

//   const getSelectedDateLabel = () => {
//     if (!scheduleDate) return 'Select Date';
//     const dateOptions = generateDateOptions();
//     const selectedOption = dateOptions.find(option => option.value === scheduleDate);
//     return selectedOption ? selectedOption.label : scheduleDate;
//   };

//   const getSelectedTimeLabel = () => {
//     return scheduleTime || 'Select Time';
//   };

//   const renderDatePicker = () => (
//     <Modal visible={showDatePicker} transparent animationType="slide">
//       <View style={styles.modalOverlay}>
//         <View style={styles.modalContent}>
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalTitle}>Select Date</Text>
//             <TouchableOpacity onPress={() => setShowDatePicker(false)}>
//               <Text style={styles.modalClose}>✕</Text>
//             </TouchableOpacity>
//           </View>
//           <ScrollView style={styles.optionsList}>
//             {generateDateOptions().map((option, index) => (
//               <TouchableOpacity
//                 key={index}
//                 style={[
//                   styles.optionItem,
//                   scheduleDate === option.value && styles.selectedOption
//                 ]}
//                 onPress={() => selectDate(option.value)}
//               >
//                 <Text style={[
//                   styles.optionText,
//                   scheduleDate === option.value && styles.selectedOptionText
//                 ]}>
//                   {option.label}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         </View>
//       </View>
//     </Modal>
//   );

//   const renderTimePicker = () => (
//     <Modal visible={showTimePicker} transparent animationType="slide">
//       <View style={styles.modalOverlay}>
//         <View style={styles.modalContent}>
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalTitle}>Select Time</Text>
//             <TouchableOpacity onPress={() => setShowTimePicker(false)}>
//               <Text style={styles.modalClose}>✕</Text>
//             </TouchableOpacity>
//           </View>
//           <ScrollView style={styles.optionsList}>
//             {timeSlots.map((time, index) => (
//               <TouchableOpacity
//                 key={index}
//                 style={[
//                   styles.optionItem,
//                   scheduleTime === time && styles.selectedOption
//                 ]}
//                 onPress={() => selectTime(time)}
//               >
//                 <Text style={[
//                   styles.optionText,
//                   scheduleTime === time && styles.selectedOptionText
//                 ]}>
//                   {time}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         </View>
//       </View>
//     </Modal>
//   );

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
//           <ArrowLeft size={24} color="#19034d" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Book Service</Text>
//         <View style={styles.placeholder} />
//       </View>

//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         {/* Pre-filled Information */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Your Information</Text>
          
//           <View style={styles.inputGroup}>
//             <User size={20} color="#666" />
//             <TextInput
//               style={styles.input}
//               value="John Doe"
//               editable={false}
//               placeholderTextColor="#999"
//             />
//           </View>

//           <View style={styles.inputGroup}>
//             <Mail size={20} color="#666" />
//             <TextInput
//               style={styles.input}
//               value="john.doe@email.com"
//               editable={false}
//               placeholderTextColor="#999"
//             />
//           </View>

//           <View style={styles.inputGroup}>
//             <Phone size={20} color="#666" />
//             <TextInput
//               style={styles.input}
//               value="+92 300 1234567"
//               editable={false}
//               placeholderTextColor="#999"
//             />
//           </View>

//           <View style={styles.inputGroup}>
//             <MapPin size={20} color="#666" />
//             <TextInput
//               style={styles.input}
//               value="123 Main Street, Karachi"
//               editable={false}
//               placeholderTextColor="#999"
//             />
//           </View>
//         </View>

//         {/* Service Details */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Service Details</Text>
//           <View style={styles.serviceInfo}>
//             {selectedCategories.map((category: any, index: number) => (
//               <View key={index} style={styles.categorySection}>
//                 <Text style={styles.serviceCategory}>{category.name}</Text>
//                 {selectedServices
//                   .filter((service: any) => service.category === category.name)
//                   .map((service: any, serviceIndex: number) => (
//                     <Text key={serviceIndex} style={styles.serviceItem}>• {service.name}</Text>
//                   ))}
//               </View>
//             ))}
//           </View>
//         </View>

//         {/* Booking Options */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Booking Type</Text>
//           <View style={styles.bookingOptions}>
//             <TouchableOpacity
//               style={[
//                 styles.bookingOption,
//                 bookingType === 'now' && styles.selectedOption
//               ]}
//               onPress={() => setBookingType('now')}
//             >
//               <Text style={[
//                 styles.optionText,
//                 bookingType === 'now' && styles.selectedOptionText
//               ]}>
//                 Book Now
//               </Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[
//                 styles.bookingOption,
//                 bookingType === 'schedule' && styles.selectedOption
//               ]}
//               onPress={() => setBookingType('schedule')}
//             >
//               <Text style={[
//                 styles.optionText,
//                 bookingType === 'schedule' && styles.selectedOptionText
//               ]}>
//                 Schedule
//               </Text>
//             </TouchableOpacity>
//           </View>

//           {bookingType === 'schedule' && (
//             <View style={styles.scheduleInputs}>
//               <TouchableOpacity 
//                 style={styles.inputGroup}
//                 onPress={() => setShowDatePicker(true)}
//               >
//                 <Calendar size={20} color="#666" />
//                 <Text style={[
//                   styles.input,
//                   !scheduleDate && styles.placeholderText
//                 ]}>
//                   {getSelectedDateLabel()}
//                 </Text>
//                 <ChevronDown size={20} color="#666" />
//               </TouchableOpacity>
              
//               <TouchableOpacity 
//                 style={styles.inputGroup}
//                 onPress={() => setShowTimePicker(true)}
//               >
//                 <Clock size={20} color="#666" />
//                 <Text style={[
//                   styles.input,
//                   !scheduleTime && styles.placeholderText
//                 ]}>
//                   {getSelectedTimeLabel()}
//                 </Text>
//                 <ChevronDown size={20} color="#666" />
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>

//         {/* Job Description */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Job Description</Text>
//           <View style={styles.textAreaGroup}>
//             <FileText size={20} color="#666" />
//             <TextInput
//               style={styles.textArea}
//               placeholder="Describe your service requirements in detail..."
//               value={description}
//               onChangeText={setDescription}
//               multiline
//               numberOfLines={4}
//               textAlignVertical="top"
//               placeholderTextColor="#999"
//             />
//           </View>
//         </View>

//         {/* Photo Upload */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Attach Photos (Optional)</Text>
//           <TouchableOpacity style={styles.photoUpload}>
//             <Camera size={24} color="#666" />
//             <Text style={styles.photoUploadText}>Add photos or documents</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Amount/Bidding */}
//         <View style={styles.section}>
//           {/* <Text style={styles.sectionTitle}>Your Bid Amount</Text> */}
//           {/* <View style={styles.amountNote}>
//             <Text style={styles.amountNoteText}>
//               Providers may counter your offer with their price
//             </Text>
//           </View> */}
//           {/* <View style={styles.amountContainer}>
//             <TouchableOpacity
//               style={styles.amountButton}
//               onPress={() => adjustAmount(false)}
//             >
//               <Minus size={20} color="#19034d" />
//             </TouchableOpacity>
//             <View style={styles.amountInputContainer}>
//               <Text style={styles.currency}>PKR</Text>
//               <TextInput
//                 style={styles.amountInput}
//                 value={amount}
//                 onChangeText={handleAmountChange}
//                 keyboardType="numeric"
//                 placeholder="500"
//                 placeholderTextColor="#999"
//               />
//             </View>
//             {/* <TouchableOpacity
//               style={styles.amountButton}
//               onPress={() => adjustAmount(true)}
//             >
//               <Plus size={20} color="#19034d" />
//             </TouchableOpacity> */}
//         {/*  </View> */}
//         </View>
//       </ScrollView>

//       {/* Submit Button */}
//       <View style={styles.bottomSection}>
//         <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
//           <Text style={styles.submitButtonText}>
//             {bookingType === 'now' ? 'Find Providers' : 'Schedule Service'}
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {renderDatePicker()}
//       {renderTimePicker()}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff' },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 24,
//     paddingTop: 60,
//     paddingBottom: 16,
//   },
//   backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
//   headerTitle: { fontSize: 18, fontWeight: '600', color: '#19034d' },
//   placeholder: { width: 40 },
//   content: { flex: 1, paddingHorizontal: 24 },
//   section: { marginBottom: 32 },
//   sectionTitle: { fontSize: 16, fontWeight: '600', color: '#19034d', marginBottom: 16 },
//   inputGroup: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f8f9fa',
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#e5e5e5',
//   },
//   input: { flex: 1, paddingVertical: 16, fontSize: 16, color: '#333', marginLeft: 12 },
//   placeholderText: { color: '#999' },
//   serviceInfo: { backgroundColor: '#f8f9fa', padding: 16, borderRadius: 12 },
//   categorySection: { marginBottom: 16 },
//   serviceCategory: { fontSize: 16, fontWeight: '600', color: '#19034d', marginBottom: 8 },
//   serviceItem: { fontSize: 14, color: '#666', marginBottom: 4 },
//   bookingOptions: { flexDirection: 'row', gap: 12 },
//   bookingOption: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//     padding: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: 'transparent',
//   },
//   selectedOption: { backgroundColor: '#f0fff1', borderColor: '#05f51d' },
//   optionText: { fontSize: 16, fontWeight: '500', color: '#333' },
//   selectedOptionText: { color: '#05f51d', fontWeight: '600' },
//   scheduleInputs: { marginTop: 16, gap: 12 },
//   textAreaGroup: {
//     flexDirection: 'row',
//     backgroundColor: '#f8f9fa',
//     borderRadius: 12,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: '#e5e5e5',
//     alignItems: 'flex-start',
//   },
//   textArea: { flex: 1, fontSize: 16, color: '#333', marginLeft: 12, minHeight: 80 },
//   photoUpload: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f8f9fa',
//     padding: 20,
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: '#e5e5e5',
//     borderStyle: 'dashed',
//     gap: 12,
//     justifyContent: 'center',
//   },
//   photoUploadText: { fontSize: 16, color: '#666' },
//   amountContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24, marginBottom: 12 },
//   amountButton: {
//     width: 48,
//     height: 48,
//     backgroundColor: '#f8f9fa',
//     borderRadius: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#e5e5e5',
//   },
//   amountInputContainer: { alignItems: 'center', gap: 4 },
//   currency: { fontSize: 14, color: '#666', fontWeight: '500' },
//   amountInput: {
//     fontSize: 32,
//     fontWeight: '700',
//     color: '#19034d',
//     textAlign: 'center',
//     minWidth: 120,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e5e5e5',
//     paddingBottom: 4,
//   },
//   amountNote: { 
//     backgroundColor: '#f0fff1', 
//     padding: 12, 
//     borderRadius: 8, 
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#05f51d',
//   },
//   amountNoteText: { 
//     fontSize: 12, 
//     color: '#05f51d', 
//     textAlign: 'center',
//     fontWeight: '500',
//   },
//   bottomSection: { paddingHorizontal: 24, paddingBottom: 32, paddingTop: 16 },
//   submitButton: { backgroundColor: '#05f51d', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
//   submitButtonText: { fontSize: 16, fontWeight: '600', color: '#19034d' },
//   modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
//   modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '70%' },
//   modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#e5e5e5' },
//   modalTitle: { fontSize: 18, fontWeight: '600', color: '#19034d' },
//   modalClose: { fontSize: 18, color: '#666', fontWeight: '600' },
//   optionsList: { maxHeight: 300 },
//   optionItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
// });


import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TextInput, 
  TouchableOpacity, Alert, Modal, Image 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from "expo-image-picker";
import { 
  ArrowLeft, User, Mail, Phone, MapPin, Calendar, 
  Clock, FileText, Camera, Minus, Plus, ChevronDown 
} from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

export default function BookingFormScreen() {
  const router = useRouter();
  const { categories, subcategories } = useLocalSearchParams();

  const [bookingType, setBookingType] = useState<'now' | 'schedule'>('now');
  const [amount, setAmount] = useState('500');
  const [description, setDescription] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const selectedCategories = JSON.parse(categories as string);
  const selectedServices = JSON.parse(subcategories as string);

  const timeSlots = [
    '9:00 AM','10:00 AM','11:00 AM','12:00 PM',
    '1:00 PM','2:00 PM','3:00 PM','4:00 PM',
    '5:00 PM','6:00 PM','7:00 PM','8:00 PM'
  ];

  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : date.toLocaleDateString('en-US', { 
          weekday: 'short', month: 'short', day: 'numeric' 
        })
      });
    }
    return dates;
  };

  const handleSubmit = () => {
    if (!description.trim()) {
      Alert.alert('Error', 'Please provide a job description');
      return;
    }

    if (bookingType === 'schedule' && (!scheduleDate || !scheduleTime)) {
      Alert.alert('Error', 'Please select date and time for scheduled booking');
      return;
    }

    router.push({
      pathname: '/provider-matching',
      params: {
        categories: JSON.stringify(selectedCategories),
        subcategories: JSON.stringify(selectedServices),
        bookingType,
        amount,
        description,
        scheduleDate,
        scheduleTime,
      }
    });
  };

  const adjustAmount = (increment: boolean) => {
    const currentAmount = parseInt(amount) || 0;
    const newAmount = increment ? currentAmount + 50 : currentAmount - 50;
    setAmount(Math.max(100, newAmount).toString());
  };

  const handleAmountChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setAmount(numericValue);
  };

  const selectDate = (date: string) => {
    setScheduleDate(date);
    setShowDatePicker(false);
  };

  const selectTime = (time: string) => {
    setScheduleTime(time);
    setShowTimePicker(false);
  };

  const getSelectedDateLabel = () => {
    if (!scheduleDate) return 'Select Date';
    const dateOptions = generateDateOptions();
    const selectedOption = dateOptions.find(option => option.value === scheduleDate);
    return selectedOption ? selectedOption.label : scheduleDate;
  };

  const getSelectedTimeLabel = () => scheduleTime || 'Select Time';

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission is required to access photos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) setSelectedImage(result.assets[0].uri);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Permission is required to access the camera.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) setSelectedImage(result.assets[0].uri);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#19034d" />
      <View style={[styles.header, { marginBottom: 16 }]}>
  <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
    <ArrowLeft size={24} color="#fff" />
  </TouchableOpacity>
  <Text style={styles.headerTitle}>Book Service</Text>
  <View style={styles.placeholder} />
</View>


      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Information</Text>
          <View style={styles.infoBox}>
            <View style={styles.infoRow}><User size={20} color="#666" /><Text style={styles.infoText}>Fatima Noor</Text></View>
            <View style={styles.infoRow}><Mail size={20} color="#666" /><Text style={styles.infoText}>Fatima@email.com</Text></View>
            <View style={styles.infoRow}><Phone size={20} color="#666" /><Text style={styles.infoText}>+92 300 1234567</Text></View>
            <View style={styles.infoRow}><MapPin size={20} color="#666" /><Text style={styles.infoText}>House no 85 G9/3 islamabad</Text></View>
          </View>
        </View>

        {/* Service Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Details</Text>
          <View style={styles.serviceInfo}>
            {selectedCategories.map((category: any, i: number) => (
              <View key={i} style={styles.categorySection}>
                <Text style={styles.serviceCategory}>{category.name}</Text>
                {selectedServices.filter((s: any) => s.category === category.name)
                  .map((s: any, j: number) => <Text key={j} style={styles.serviceItem}>• {s.name}</Text>)}
              </View>
            ))}
          </View>
        </View>

        {/* Booking Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Type</Text>
          <View style={styles.bookingOptions}>
            <TouchableOpacity style={[styles.bookingOption, bookingType === 'now' && styles.selectedOption]} onPress={() => setBookingType('now')}>
              <Text style={[styles.optionText, bookingType === 'now' && styles.selectedOptionText]}>Book Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.bookingOption, bookingType === 'schedule' && styles.selectedOption]} onPress={() => setBookingType('schedule')}>
              <Text style={[styles.optionText, bookingType === 'schedule' && styles.selectedOptionText]}>Schedule</Text>
            </TouchableOpacity>
          </View>

          {bookingType === 'schedule' && (
            <View style={styles.scheduleInputs}>
              <TouchableOpacity style={styles.inputGroup} onPress={() => setShowDatePicker(true)}>
                <Calendar size={20} color="#666" />
                <Text style={[styles.input, !scheduleDate && styles.placeholderText]}>{getSelectedDateLabel()}</Text>
                <ChevronDown size={20} color="#666" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.inputGroup} onPress={() => setShowTimePicker(true)}>
                <Clock size={20} color="#666" />
                <Text style={[styles.input, !scheduleTime && styles.placeholderText]}>{getSelectedTimeLabel()}</Text>
                <ChevronDown size={20} color="#666" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Job Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Description</Text>
          <View style={styles.textAreaGroup}>
            <FileText size={20} color="#666" />
            <TextInput
              style={styles.textArea}
              placeholder="Describe your service requirements..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Photo Upload */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attach Photos (Optional)</Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity style={styles.photoUpload} onPress={pickImage}>
              <Camera size={24} color="#666" /><Text style={styles.photoUploadText}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.photoUpload} onPress={takePhoto}>
              <Camera size={24} color="#666" /><Text style={styles.photoUploadText}>Camera</Text>
            </TouchableOpacity>
          </View>
          {selectedImage && <Image source={{ uri: selectedImage }} style={{ width: 120, height: 120, marginTop: 12, borderRadius: 8 }} />}
        </View>
      </ScrollView>

      {/* Submit */}
      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>
            {bookingType === 'now' ? 'Find Providers' : 'Schedule Service'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date & Time Modals */}
      {showDatePicker && (
        <Modal visible transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Date</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}><Text style={styles.modalClose}>✕</Text></TouchableOpacity>
              </View>
              <ScrollView style={styles.optionsList}>
                {generateDateOptions().map((o, i) => (
                  <TouchableOpacity key={i} style={[styles.optionItem, scheduleDate === o.value && styles.selectedOption]} onPress={() => selectDate(o.value)}>
                    <Text style={[styles.optionText, scheduleDate === o.value && styles.selectedOptionText]}>{o.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      {showTimePicker && (
        <Modal visible transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Time</Text>
                <TouchableOpacity onPress={() => setShowTimePicker(false)}><Text style={styles.modalClose}>✕</Text></TouchableOpacity>
              </View>
              <ScrollView style={styles.optionsList}>
                {timeSlots.map((t, i) => (
                  <TouchableOpacity key={i} style={[styles.optionItem, scheduleTime === t && styles.selectedOption]} onPress={() => selectTime(t)}>
                    <Text style={[styles.optionText, scheduleTime === t && styles.selectedOptionText]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 16, backgroundColor: '#19034d' },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#fff' },
  placeholder: { width: 40 },
  content: { flex: 1, paddingHorizontal: 24 },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#19034d', marginBottom: 16 },
  infoBox: { backgroundColor: '#f8f9fa', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#e5e5e5', gap: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  infoText: { fontSize: 16, color: '#333' },
  serviceInfo: { backgroundColor: '#f8f9fa', padding: 16, borderRadius: 12 },
  categorySection: { marginBottom: 16 },
  serviceCategory: { fontSize: 16, fontWeight: '600', color: '#19034d', marginBottom: 8 },
  serviceItem: { fontSize: 14, color: '#666', marginBottom: 4 },
  bookingOptions: { flexDirection: 'row', gap: 12 },
  bookingOption: { flex: 1, backgroundColor: '#f8f9fa', padding: 16, borderRadius: 12, alignItems: 'center', borderWidth: 2, borderColor: 'transparent' },
  selectedOption: { backgroundColor: '#f0fff1', borderColor: '#05f51d' },
  optionText: { fontSize: 16, fontWeight: '500', color: '#333' },
  selectedOptionText: { color: '#05f51d', fontWeight: '600' },
  scheduleInputs: { marginTop: 16, gap: 12 },
  inputGroup: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9fa', borderRadius: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: '#e5e5e5' },
  input: { flex: 1, paddingVertical: 16, fontSize: 16, color: '#333', marginLeft: 12 },
  placeholderText: { color: '#999' },
  textAreaGroup: { flexDirection: 'row', backgroundColor: '#f8f9fa', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#e5e5e5', alignItems: 'flex-start' },
  textArea: { flex: 1, fontSize: 16, color: '#333', marginLeft: 12, minHeight: 80 },
  photoUpload: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9fa', padding: 16, borderRadius: 12, borderWidth: 2, borderColor: '#e5e5e5', borderStyle: 'dashed', flex: 1, justifyContent: 'center' },
  photoUploadText: { marginLeft: 8, fontSize: 16, color: '#666' },
  bottomSection: { paddingHorizontal: 24, paddingBottom: 32, paddingTop: 16 },
  submitButton: { backgroundColor: '#05f51d', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  submitButtonText: { fontSize: 16, fontWeight: '600', color: '#19034d' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '70%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#e5e5e5' },
  modalTitle: { fontSize: 18, fontWeight: '600', color: '#19034d' },
  modalClose: { fontSize: 18, color: '#666', fontWeight: '600' },
  optionsList: { maxHeight: 300 },
  optionItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
});
