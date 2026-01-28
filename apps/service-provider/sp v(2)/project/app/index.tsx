// import { useEffect, useState } from 'react';
// // import { View, Text, StyleSheet } from 'react-native';
// // import { router } from 'expo-router';
// // import AsyncStorage from '@react-native-async-storage/async-storage';

// // export default function SplashScreen() {
// //   const [isReady, setIsReady] = useState(false);

// //   useEffect(() => {
// //     const initializeApp = async () => {
// //       const timer = setTimeout(async () => {
// //         try {
// //           const hasCompletedOnboarding = await AsyncStorage.getItem('hasCompletedOnboarding');
// //           const isApproved = await AsyncStorage.getItem('isApproved');
// //           const hasSetPassword = await AsyncStorage.getItem('hasSetPassword');

// //           if (hasCompletedOnboarding === 'true' && isApproved === 'true' && hasSetPassword === 'true') {
// //             router.replace('/(tabs)');
// //           } else if (isApproved === 'true' && hasSetPassword !== 'true') {
// //             router.replace('/password-setup');
// //           } else if (isApproved === 'true' && hasCompletedOnboarding !== 'true') {
// //             router.replace('/onboarding');
// //           } else {
// //             const hasRegistered = await AsyncStorage.getItem('hasRegistered');
// //             if (hasRegistered === 'true') {
// //               router.replace('/pending-approval');
// //             } else {
// //               router.replace('/role-selection');
// //             }
// //           }
// //         } catch (error) {
// //           router.replace('/role-selection');
// //         }
// //       }, 2500);

// //       return () => clearTimeout(timer);
// //     };

// //     initializeApp();
// //   }, []);

// //   return (
// //     <View style={styles.container}>
// //       <View style={styles.logoContainer}>
// //         <Text style={styles.logoText}>SP</Text>
// //       </View>
// //       <Text style={styles.appName}>Service Provider</Text>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#19034d',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   logoContainer: {
// //     width: 150,
// //     height: 150,
// //     borderRadius: 75,
// //     backgroundColor: '#05f51d',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginBottom: 20,
// //   },
// //   logoText: {
// //     fontSize: 64,
// //     fontWeight: 'bold',
// //     color: '#19034d',
// //   },
// //   appName: {
// //     fontSize: 24,
// //     fontWeight: 'bold',
// //     color: '#fff',
// //   },
// // });


// // import { Redirect } from 'expo-router';

// // export default function Index() {
// //   return <Redirect href="/splash" />;
// // }