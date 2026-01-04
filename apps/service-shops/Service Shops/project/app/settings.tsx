import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, ArrowRight, Bell, CreditCard, Shield, CircleHelp as HelpCircle, Settings, User, Mail, Phone, MapPin, X } from 'lucide-react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  // const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    sms: false
  });

  const settingsItems = [
    { icon: Bell, title: 'Notifications', subtitle: 'Manage your notifications', action: () => setShowNotificationSettings(true) },
    // { icon: CreditCard, title: 'Payment Methods', subtitle: 'Manage cards and wallets', action: () => setShowPaymentMethods(true) },
    { icon: HelpCircle, title: 'FAQ', subtitle: 'View and ask questions', action: () => router.push('/faq') },
 
    { icon: Shield, title: 'Privacy & Security', subtitle: 'Account security settings', action: () => router.push('/privacy-security') },
    { icon: HelpCircle, title: 'Help & Support', subtitle: 'Get help and contact support', action: () => router.push('/HelpSupport') },
  //   { icon: Settings, title: 'App Settings', subtitle: 'Language, preferences', action: () => router.push('/app-settings') },
   ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
  <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
    <ArrowLeft size={24} color="#fff" />  {/* ← white back icon */}
  </TouchableOpacity>
  <Text style={styles.headerTitleWhite}>Settings</Text> {/* white text */}
  <View style={styles.placeholder} />
</View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.pageHeader}>
          {/* <Text style={styles.headerTitle}>Settings</Text> */}
          <Text style={styles.headerSubtitle}>Manage your account and app preferences</Text>
        </View>

        {/* Settings Items */}
        <View style={styles.menuSection}>
          {settingsItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <TouchableOpacity key={index} style={styles.menuItem} onPress={item.action}>
                <View style={styles.menuItemLeft}>
                  <View style={styles.menuIconContainer}>
                    <IconComponent size={20} color="#19034d" />
                  </View>
                  <View style={styles.menuTextContainer}>
                    <Text style={styles.menuTitle}>{item.title}</Text>
                    <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                  </View>
                </View>
                <ArrowRight size={16} color="#666" />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Notification Settings Modal */}
      <Modal visible={showNotificationSettings} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notification Settings</Text>
              <TouchableOpacity onPress={() => setShowNotificationSettings(false)}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.notificationOptions}>
              <TouchableOpacity 
                style={styles.notificationOption}
                onPress={() => setNotifications({...notifications, push: !notifications.push})}
              >
                <Text style={styles.notificationLabel}>Push Notifications</Text>
                <View style={[styles.toggle, notifications.push && styles.toggleActive]}>
                  <View style={[styles.toggleThumb, notifications.push && styles.toggleThumbActive]} />
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.notificationOption}
                onPress={() => setNotifications({...notifications, email: !notifications.email})}
              >
                <Text style={styles.notificationLabel}>Email Notifications</Text>
                <View style={[styles.toggle, notifications.email && styles.toggleActive]}>
                  <View style={[styles.toggleThumb, notifications.email && styles.toggleThumbActive]} />
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.notificationOption}
                onPress={() => setNotifications({...notifications, sms: !notifications.sms})}
              >
                <Text style={styles.notificationLabel}>SMS Notifications</Text>
                <View style={[styles.toggle, notifications.sms && styles.toggleActive]}>
                  <View style={[styles.toggleThumb, notifications.sms && styles.toggleThumbActive]} />
                </View>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={() => {
                setShowNotificationSettings(false);
                Alert.alert('Success', 'Notification settings updated');
              }}
            >
              <Text style={styles.saveButtonText}>Save Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Payment Methods Modal */}
      {/* <Modal visible={showPaymentMethods} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Payment Methods</Text>
              <TouchableOpacity onPress={() => setShowPaymentMethods(false)}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.paymentMethods}>
              <View style={styles.paymentMethod}>
                <CreditCard size={20} color="#19034d" />
                <Text style={styles.paymentMethodText}>**** **** **** 1234</Text>
                <Text style={styles.paymentMethodType}>Visa</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.addPaymentButton}
                onPress={() => {
                  setShowPaymentMethods(false);
                  Alert.alert('Add Payment Method', 'Payment method integration coming soon');
                }}
              >
                <Text style={styles.addPaymentText}>+ Add New Card</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal> */}
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
  // headerTitle: {
  //   fontSize: 18,
  //   fontWeight: '600',
  //   color: '#fff',
  // },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  pageHeader: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#19034d',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
     textAlign: 'center',
  },
  menuSection: {
    paddingHorizontal: 24,
    gap: 4,
    marginBottom: 32,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#19034d',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#666',
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
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#19034d',
  },
  notificationOptions: {
    gap: 20,
    marginBottom: 24,
  },
  notificationOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationLabel: {
    fontSize: 16,
    color: '#333',
  },
  toggle: {
    width: 50,
    height: 30,
    backgroundColor: '#e5e5e5',
    borderRadius: 15,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#05f51d',
  },
  toggleThumb: {
    width: 26,
    height: 26,
    backgroundColor: '#fff',
    borderRadius: 13,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  saveButton: {
    backgroundColor: '#05f51d',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#19034d',
  },
  paymentMethods: {
    gap: 16,
    marginBottom: 24,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  paymentMethodText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  paymentMethodType: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  addPaymentButton: {
    backgroundColor: '#05f51d',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addPaymentText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#19034d',
  },
  headerTitleWhite: {
  fontSize: 20,
  fontWeight: '700',
  color: '#fff', // white text
},
});


















// import { useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch } from 'react-native';
// import { router } from 'expo-router';
// import {
//   ArrowLeft,
//   ChevronRight,
//   Bell,
//   Mail,
//   MessageSquare,
//   HelpCircle,
//   Shield,
//   Lock,
//   FileText,
// } from 'lucide-react-native';

// export default function Settings() {
//   const [pushNotifications, setPushNotifications] = useState(true);
//   const [smsNotifications, setSmsNotifications] = useState(false);
//   const [emailNotifications, setEmailNotifications] = useState(true);

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.back()}>
//           <ArrowLeft size={28} color="#fff" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Settings</Text>
//         <View style={{ width: 28 }} />
//       </View>

//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Notifications</Text>

//           <View style={styles.settingItem}>
//             <View style={styles.settingLeft}>
//               <Bell size={24} color="#19034d" />
//               <View style={styles.settingText}>
//                 <Text style={styles.settingTitle}>Push Notifications</Text>
//                 <Text style={styles.settingDescription}>Receive notifications on your device</Text>
//               </View>
//             </View>
//             <Switch
//               value={pushNotifications}
//               onValueChange={setPushNotifications}
//               trackColor={{ false: '#ddd', true: '#05f51d' }}
//               thumbColor="#fff"
//             />
//           </View>

//           <View style={styles.settingItem}>
//             <View style={styles.settingLeft}>
//               <MessageSquare size={24} color="#19034d" />
//               <View style={styles.settingText}>
//                 <Text style={styles.settingTitle}>SMS Notifications</Text>
//                 <Text style={styles.settingDescription}>Receive SMS for important updates</Text>
//               </View>
//             </View>
//             <Switch
//               value={smsNotifications}
//               onValueChange={setSmsNotifications}
//               trackColor={{ false: '#ddd', true: '#05f51d' }}
//               thumbColor="#fff"
//             />
//           </View>

//           <View style={styles.settingItem}>
//             <View style={styles.settingLeft}>
//               <Mail size={24} color="#19034d" />
//               <View style={styles.settingText}>
//                 <Text style={styles.settingTitle}>Email Notifications</Text>
//                 <Text style={styles.settingDescription}>Receive email notifications</Text>
//               </View>
//             </View>
//             <Switch
//               value={emailNotifications}
//               onValueChange={setEmailNotifications}
//               trackColor={{ false: '#ddd', true: '#05f51d' }}
//               thumbColor="#fff"
//             />
//           </View>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Support</Text>

//           <TouchableOpacity style={styles.menuItem}>
//             <HelpCircle size={24} color="#19034d" />
//             <Text style={styles.menuItemText}>FAQ</Text>
//             <ChevronRight size={20} color="#999" />
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.menuItem}>
//             <Shield size={24} color="#19034d" />
//             <Text style={styles.menuItemText}>Privacy and Security</Text>
//             <ChevronRight size={20} color="#999" />
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.menuItem}>
//             <MessageSquare size={24} color="#19034d" />
//             <Text style={styles.menuItemText}>Help and Support</Text>
//             <ChevronRight size={20} color="#999" />
//           </TouchableOpacity>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Legal</Text>

//           <TouchableOpacity style={styles.menuItem}>
//             <FileText size={24} color="#19034d" />
//             <Text style={styles.menuItemText}>Terms of Service</Text>
//             <ChevronRight size={20} color="#999" />
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.menuItem}>
//             <Lock size={24} color="#19034d" />
//             <Text style={styles.menuItemText}>Privacy Policy</Text>
//             <ChevronRight size={20} color="#999" />
//           </TouchableOpacity>
//         </View>

//         <View style={styles.versionContainer}>
//           <Text style={styles.versionText}>Version 1.0.0</Text>
//         </View>
//       </ScrollView>
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
//   headerTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   content: {
//     flex: 1,
//   },
//   section: {
//     paddingVertical: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#19034d',
//     paddingHorizontal: 20,
//     marginBottom: 16,
//   },
//   settingItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//   },
//   settingLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//     gap: 12,
//   },
//   settingText: {
//     flex: 1,
//   },
//   settingTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 2,
//   },
//   settingDescription: {
//     fontSize: 12,
//     color: '#999',
//   },
//   menuItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//     gap: 12,
//   },
//   menuItemText: {
//     flex: 1,
//     fontSize: 16,
//     color: '#333',
//     fontWeight: '500',
//   },
//   versionContainer: {
//     alignItems: 'center',
//     paddingVertical: 30,
//   },
//   versionText: {
//     fontSize: 14,
//     color: '#999',
//   },
// });
