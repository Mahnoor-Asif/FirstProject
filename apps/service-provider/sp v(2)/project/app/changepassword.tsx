import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Lock, Eye, EyeOff, Mail } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

type Step = 'password' | 'otp' | 'verify';

export default function ChangePassword() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('password');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const loadEmail = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem('registrationEmail');
        if (savedEmail) {
          setEmail(savedEmail);
        }
      } catch (err) {
        console.error('Error loading email:', err);
      }
    };
    loadEmail();
  }, []);

  // Timer for OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      // Send OTP to email
      await axios.post('http://localhost:5004/api/send-otp', { email });
      Alert.alert('Success', 'OTP has been sent to your email. Please check your inbox.');
      setStep('otp');
      setTimer(600); // 10 minutes
    } catch (err: any) {
      console.error('Error sending OTP:', err);
      Alert.alert('Error', err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }

    setLoading(true);
    try {
      // Verify OTP
      await axios.post('http://localhost:5004/api/verify-otp', { email, otp });
      setStep('verify');
    } catch (err: any) {
      console.error('Error verifying OTP:', err);
      Alert.alert('Error', err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setLoading(true);
    try {
      // Change password
      await axios.post('http://localhost:5004/api/change-password', { email, newPassword });
      
      Alert.alert('Success', 'Password changed successfully! Please login with your new password.', [
        {
          text: 'OK',
          onPress: async () => {
            await AsyncStorage.removeItem('registrationEmail');
            router.replace('/login');
          }
        }
      ]);
    } catch (err: any) {
      console.error('Error changing password:', err);
      Alert.alert('Error', err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0) return;
    
    setLoading(true);
    try {
      await axios.post('http://localhost:5004/api/send-otp', { email });
      Alert.alert('Success', 'OTP has been resent to your email');
      setTimer(600);
    } catch (err: any) {
      Alert.alert('Error', 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ArrowLeft size={24} color="#19034d" />
      </TouchableOpacity>

      {step === 'password' && (
        <>
          <Text style={styles.title}>Set Password</Text>
          <Text style={styles.subtitle}>Create a strong password for your account</Text>

          <View style={styles.inputGroup}>
            <Lock size={20} color="#666" style={{ marginRight: 10 }} />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Lock size={20} color="#666" style={{ marginRight: 10 }} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor="#999"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOff size={20} color="#666" />
              ) : (
                <Eye size={20} color="#666" />
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.resetButton, loading && { opacity: 0.7 }]} 
            onPress={handleSetPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#19034d" />
            ) : (
              <Text style={styles.resetButtonText}>Continue to OTP</Text>
            )}
          </TouchableOpacity>
        </>
      )}

      {step === 'otp' && (
        <>
          <Text style={styles.title}>Verify Email</Text>
          <Text style={styles.subtitle}>We've sent an OTP to your email</Text>

          <View style={styles.emailDisplay}>
            <Mail size={20} color="#19034d" />
            <Text style={styles.emailText}>{email}</Text>
          </View>

          <Text style={styles.otpLabel}>Enter OTP</Text>
          <TextInput
            style={styles.otpInput}
            placeholder="000000"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            maxLength={6}
            placeholderTextColor="#ccc"
          />

          <TouchableOpacity 
            style={[styles.resetButton, loading && { opacity: 0.7 }]} 
            onPress={handleVerifyOtp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#19034d" />
            ) : (
              <Text style={styles.resetButtonText}>Verify OTP</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.resendButton}
            onPress={handleResendOtp}
            disabled={timer > 0}
          >
            <Text style={[styles.resendText, timer > 0 && { color: '#ccc' }]}>
              {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
            </Text>
          </TouchableOpacity>
        </>
      )}

      {step === 'verify' && (
        <>
          <View style={styles.successContainer}>
            <Text style={styles.successEmoji}>✓</Text>
            <Text style={styles.title}>OTP Verified</Text>
            <Text style={styles.subtitle}>Your email has been verified. Click below to confirm password change.</Text>
          </View>

          <TouchableOpacity 
            style={[styles.resetButton, loading && { opacity: 0.7 }]} 
            onPress={handleChangePassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#19034d" />
            ) : (
              <Text style={styles.resetButtonText}>Confirm & Login</Text>
            )}
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#19034d',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
  },
  emailDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  emailText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  otpLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#19034d',
    marginBottom: 8,
  },
  otpInput: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 8,
    borderWidth: 2,
    borderColor: '#19034d',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#19034d',
  },
  resetButton: {
    backgroundColor: '#05f51d',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#19034d',
  },
  resendButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    color: '#05f51d',
    fontWeight: '500',
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginBottom: 50,
  },
  successEmoji: {
    fontSize: 60,
    marginBottom: 16,
  },
});
