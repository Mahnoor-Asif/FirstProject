// import React, { createContext, useContext, useState, useEffect } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Platform } from 'react-native';
// import * as Haptics from 'expo-haptics';

// interface SettingsContextType {
//   soundEnabled: boolean;
//   vibrationEnabled: boolean;
//   setSoundEnabled: (enabled: boolean) => void;
//   setVibrationEnabled: (enabled: boolean) => void;
//   playSound: (type?: 'success' | 'error' | 'notification') => void;
//   triggerVibration: (type?: 'light' | 'medium' | 'heavy') => void;
// }

// const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [soundEnabled, setSoundEnabledState] = useState(true);
//   const [vibrationEnabled, setVibrationEnabledState] = useState(true);

//   useEffect(() => {
//     loadSettings();
//   }, []);

//   const loadSettings = async () => {
//     try {
//       const sound = await AsyncStorage.getItem('soundEnabled');
//       const vibration = await AsyncStorage.getItem('vibrationEnabled');
      
//       if (sound !== null) setSoundEnabledState(JSON.parse(sound));
//       if (vibration !== null) setVibrationEnabledState(JSON.parse(vibration));
//     } catch (error) {
//       console.error('Error loading settings:', error);
//     }
//   };

//   const setSoundEnabled = async (enabled: boolean) => {
//     try {
//       setSoundEnabledState(enabled);
//       await AsyncStorage.setItem('soundEnabled', JSON.stringify(enabled));
//     } catch (error) {
//       console.error('Error saving sound setting:', error);
//     }
//   };

//   const setVibrationEnabled = async (enabled: boolean) => {
//     try {
//       setVibrationEnabledState(enabled);
//       await AsyncStorage.setItem('vibrationEnabled', JSON.stringify(enabled));
//     } catch (error) {
//       console.error('Error saving vibration setting:', error);
//     }
//   };

//   const playSound = (type: 'success' | 'error' | 'notification' = 'notification') => {
//     if (!soundEnabled) return;
    
//     if (Platform.OS === 'web') {
//       // Web audio implementation
//       try {
//         const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
//         const oscillator = audioContext.createOscillator();
//         const gainNode = audioContext.createGain();
        
//         oscillator.connect(gainNode);
//         gainNode.connect(audioContext.destination);
        
//         // Different frequencies for different sound types
//         const frequencies = {
//           success: 800,
//           error: 400,
//           notification: 600
//         };
        
//         oscillator.frequency.setValueAtTime(frequencies[type], audioContext.currentTime);
//         oscillator.type = 'sine';
        
//         gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
//         gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
//         oscillator.start(audioContext.currentTime);
//         oscillator.stop(audioContext.currentTime + 0.3);
//       } catch (error) {
//         console.log('Web audio not supported');
//       }
//     } else {
//       // Mobile sound would be implemented with expo-av
//       console.log(`Playing ${type} sound`);
//     }
//   };

//   const triggerVibration = (type: 'light' | 'medium' | 'heavy' = 'light') => {
//     if (!vibrationEnabled) return;
    
//     if (Platform.OS !== 'web') {
//       try {
//         switch (type) {
//           case 'light':
//             Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
//             break;
//           case 'medium':
//             Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
//             break;
//           case 'heavy':
//             Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
//             break;
//         }
//       } catch (error) {
//         console.log('Haptics not available');
//       }
//     } else {
//       // Web vibration
//       if (navigator.vibrate) {
//         const patterns = {
//           light: 50,
//           medium: 100,
//           heavy: 200
//         };
//         navigator.vibrate(patterns[type]);
//       }
//     }
//   };

//   return (
//     <SettingsContext.Provider value={{
//       soundEnabled,
//       vibrationEnabled,
//       setSoundEnabled,
//       setVibrationEnabled,
//       playSound,
//       triggerVibration
//     }}>
//       {children}
//     </SettingsContext.Provider>
//   );
// };

// export const useSettings = () => {
//   const context = useContext(SettingsContext);
//   if (!context) {
//     throw new Error('useSettings must be used within a SettingsProvider');
//   }
//   return context;
// };