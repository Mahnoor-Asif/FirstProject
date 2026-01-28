// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   SafeAreaView,
//   TextInput,
// } from 'react-native';
// import { useRouter } from 'expo-router';
// import { ArrowLeft, MessageSquare, User, Send, Image, Camera } from 'lucide-react-native';

// export default function ChatScreen() {
//   const router = useRouter();
//   const [selectedChat, setSelectedChat] = useState<string | null>(null);
//   const [messageText, setMessageText] = useState('');

//   const chatList = [
//     {
//       id: '1',
//       name: 'Ahmad Khan',
//       lastMessage: 'Are you on your way?',
//       time: '2 min ago',
//       unread: 2,
//       jobType: 'Electrical Wiring',
//       status: 'ongoing',
//     },
//     {
//       id: '2',
//       name: 'Fatima Ali',
//       lastMessage: 'What paint colors do you recommend?',
//       time: '15 min ago',
//       unread: 0,
//       jobType: 'Interior Painting',
//       status: 'scheduled',
//     },
//     {
//       id: '3',
//       name: 'Muhammad Usman',
//       lastMessage: 'Thank you for the great service!',
//       time: '1 hour ago',
//       unread: 0,
//       jobType: 'AC Repair',
//       status: 'completed',
//     },
//     {
//       id: '4',
//       name: 'Sarah Ahmed',
//       lastMessage: 'When can you start the work?',
//       time: '3 hours ago',
//       unread: 1,
//       jobType: 'Plumbing',
//       status: 'accepted',
//     },
//   ];

//   const messages = [
//     {
//       id: '1',
//       text: 'Hi, I accepted your job request. When would be a good time to start?',
//       sender: 'me',
//       time: '10:30 AM',
//     },
//     {
//       id: '2',
//       text: 'Great! Can you come today around 2 PM?',
//       sender: 'customer',
//       time: '10:35 AM',
//     },
//     {
//       id: '3',
//       text: 'Yes, that works for me. I will be there at 2 PM.',
//       sender: 'me',
//       time: '10:36 AM',
//     },
//     {
//       id: '4',
//       text: 'Perfect! See you then.',
//       sender: 'customer',
//       time: '10:37 AM',
//     },
//     {
//       id: '5',
//       text: 'Are you on your way?',
//       sender: 'customer',
//       time: '1:55 PM',
//     },
//   ];

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'ongoing':
//         return '#05f51d';
//       case 'scheduled':
//         return '#06B6D4';
//       case 'accepted':
//         return '#F59E0B';
//       case 'completed':
//         return '#6B7280';
//       default:
//         return '#6B7280';
//     }
//   };

//   const getStatusText = (status: string) => {
//     switch (status) {
//       case 'ongoing':
//         return 'In Progress';
//       case 'scheduled':
//         return 'Scheduled';
//       case 'accepted':
//         return 'Accepted';
//       case 'completed':
//         return 'Completed';
//       default:
//         return status;
//     }
//   };

//   const handleSendMessage = () => {
//     if (messageText.trim()) {
//       // Add message logic here
//       setMessageText('');
//     }
//   };

//   if (selectedChat) {
//     const chat = chatList.find(c => c.id === selectedChat);
    
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.chatHeader}>
//           <TouchableOpacity onPress={() => setSelectedChat(null)}>
//             <ArrowLeft size={24} color="#19034d" />
//           </TouchableOpacity>
//           <View style={styles.chatInfo}>
//             <Text style={styles.chatName}>{chat?.name}</Text>
//             <Text style={styles.chatJobType}>{chat?.jobType}</Text>
//           </View>
//           <View style={[styles.statusBadge, { backgroundColor: getStatusColor(chat?.status || '') }]}>
//             <Text style={styles.statusText}>{getStatusText(chat?.status || '')}</Text>
//           </View>
//         </View>

//         <ScrollView style={styles.messagesContainer}>
//           {messages.map((message) => (
//             <View
//               key={message.id}
//               style={[
//                 styles.messageItem,
//                 message.sender === 'me' ? styles.myMessage : styles.customerMessage,
//               ]}>
//               <Text style={[
//                 styles.messageText,
//                 message.sender === 'me' ? styles.myMessageText : styles.customerMessageText,
//               ]}>
//                 {message.text}
//               </Text>
//               <Text style={[
//                 styles.messageTime,
//                 message.sender === 'me' ? styles.myMessageTime : styles.customerMessageTime,
//               ]}>
//                 {message.time}
//               </Text>
//             </View>
//           ))}
//         </ScrollView>

//         <View style={styles.messageInput}>
//           <TouchableOpacity style={styles.attachButton}>
//             <Camera size={20} color="#6B7280" />
//           </TouchableOpacity>
//           <TextInput
//             style={styles.inputField}
//             value={messageText}
//             onChangeText={setMessageText}
//             placeholder="Type a message..."
//             placeholderTextColor="#9CA3AF"
//             multiline
//           />
//           <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
//             <Send size={20} color="#FFFFFF" />
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.back()}>
//           <ArrowLeft size={24} color="#19034d" />
//         </TouchableOpacity>
//         <Text style={styles.title}>Messages</Text>
//         <View style={styles.chatStats}>
//           <Text style={styles.statsText}>
//             {chatList.filter(c => c.unread > 0).length} unread
//           </Text>
//         </View>
//       </View>

//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         {chatList.map((chat) => (
//           <TouchableOpacity 
//             key={chat.id} 
//             style={styles.chatItem}
//             onPress={() => setSelectedChat(chat.id)}>
//             <View style={styles.avatarContainer}>
//               <User size={24} color="#6B7280" />
//             </View>
            
//             <View style={styles.chatContent}>
//               <View style={styles.chatHeaderRow}>
//                 <Text style={styles.contactName}>{chat.name}</Text>
//                 <Text style={styles.timeText}>{chat.time}</Text>
//               </View>
              
//               <View style={styles.jobTypeRow}>
//                 <Text style={styles.jobTypeText}>{chat.jobType}</Text>
//                 <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(chat.status) }]}>
//                   <Text style={styles.statusIndicatorText}>{getStatusText(chat.status)}</Text>
//                 </View>
//               </View>
              
//               <View style={styles.messageRow}>
//                 <Text style={styles.lastMessage} numberOfLines={1}>
//                   {chat.lastMessage}
//                 </Text>
//                 {chat.unread > 0 && (
//                   <View style={styles.unreadBadge}>
//                     <Text style={styles.unreadText}>{chat.unread}</Text>
//                   </View>
//                 )}
//               </View>
//             </View>
//           </TouchableOpacity>
//         ))}

//         {chatList.length === 0 && (
//           <View style={styles.emptyState}>
//             <MessageSquare size={64} color="#D1D5DB" />
//             <Text style={styles.emptyTitle}>No Active Chats</Text>
//             <Text style={styles.emptySubtitle}>
//               Accept a job to start chatting with service seekers
//             </Text>
//           </View>
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#19034d',
//   },
//   chatStats: {
//     backgroundColor: '#FEF3C7',
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     borderRadius: 16,
//   },
//   statsText: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#92400E',
//   },
//   content: {
//     flex: 1,
//   },
//   chatItem: {
//     flexDirection: 'row',
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F3F4F6',
//     alignItems: 'flex-start',
//   },
//   avatarContainer: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: '#F3F4F6',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 15,
//   },
//   chatContent: {
//     flex: 1,
//   },
//   chatHeaderRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   contactName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#19034d',
//   },
//   timeText: {
//     fontSize: 12,
//     color: '#9CA3AF',
//   },
//   jobTypeRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 6,
//   },
//   jobTypeText: {
//     fontSize: 12,
//     color: '#05f51d',
//     fontWeight: '500',
//   },
//   statusIndicator: {
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 8,
//   },
//   statusIndicatorText: {
//     fontSize: 10,
//     color: '#FFFFFF',
//     fontWeight: '600',
//   },
//   messageRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   lastMessage: {
//     fontSize: 14,
//     color: '#6B7280',
//     flex: 1,
//   },
//   unreadBadge: {
//     backgroundColor: '#05f51d',
//     borderRadius: 10,
//     width: 20,
//     height: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginLeft: 10,
//   },
//   unreadText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   emptyState: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: 40,
//     paddingTop: 100,
//   },
//   emptyTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#4B5563',
//     marginTop: 20,
//     marginBottom: 8,
//   },
//   emptySubtitle: {
//     fontSize: 14,
//     color: '#9CA3AF',
//     textAlign: 'center',
//     lineHeight: 20,
//   },
//   // Chat Detail Styles
//   chatHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   chatInfo: {
//     alignItems: 'center',
//   },
//   chatName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#19034d',
//   },
//   chatJobType: {
//     fontSize: 12,
//     color: '#6B7280',
//   },
//   statusBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   statusText: {
//     fontSize: 10,
//     color: '#FFFFFF',
//     fontWeight: '600',
//   },
//   messagesContainer: {
//     flex: 1,
//     padding: 20,
//   },
//   messageItem: {
//     marginBottom: 15,
//     maxWidth: '80%',
//   },
//   myMessage: {
//     alignSelf: 'flex-end',
//     backgroundColor: '#05f51d',
//     borderRadius: 18,
//     borderBottomRightRadius: 4,
//     padding: 12,
//   },
//   customerMessage: {
//     alignSelf: 'flex-start',
//     backgroundColor: '#F3F4F6',
//     borderRadius: 18,
//     borderBottomLeftRadius: 4,
//     padding: 12,
//   },
//   messageText: {
//     fontSize: 14,
//     lineHeight: 20,
//   },
//   myMessageText: {
//     color: '#FFFFFF',
//   },
//   customerMessageText: {
//     color: '#19034d',
//   },
//   messageTime: {
//     fontSize: 11,
//     marginTop: 4,
//   },
//   myMessageTime: {
//     color: '#E5F5E5',
//     textAlign: 'right',
//   },
//   customerMessageTime: {
//     color: '#9CA3AF',
//   },
//   messageInput: {
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     borderTopWidth: 1,
//     borderTopColor: '#E5E7EB',
//     gap: 12,
//   },
//   attachButton: {
//     padding: 8,
//   },
//   inputField: {
//     flex: 1,
//     backgroundColor: '#F9FAFB',
//     borderRadius: 24,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     fontSize: 14,
//     color: '#19034d',
//     maxHeight: 100,
//   },
//   sendButton: {
//     backgroundColor: '#05f51d',
//     borderRadius: 20,
//     padding: 10,
//   },
// });