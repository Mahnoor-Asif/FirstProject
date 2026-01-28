import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Eye, EyeOff, ArrowLeft, Mail } from 'lucide-react-native';

type Step = 'password' | 'otp' | 'verify';

// ---------------------------
// Use your PC IP instead of localhost
// ---------------------------
const API = axios.create({
  baseURL: 'http://192.168.18.20:5004/api', // ✅ PC IP here
  headers: { 'Content-Type': 'application/json' },
});

export default function PasswordSetup() {
  const [step, setStep] = useState<Step>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  // Load saved email from AsyncStorage
  useEffect(() => {
    const loadEmail = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem('registrationEmail');
        if (savedEmail) setEmail(savedEmail);
      } catch (err) {
        console.error('Error loading email:', err);
      }
    };
    loadEmail();
  }, []);

  // OTP countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // ---------------------------
  // Step 1: Send OTP
  // ---------------------------
  const handleSetPassword = async () => {
    if (!email) return Alert.alert('Error', 'Email not found. Please start registration.');
    if (!password || !confirmPassword) return Alert.alert('Error', 'Fill all password fields');
    if (password !== confirmPassword) return Alert.alert('Error', 'Passwords do not match');
    if (password.length < 6) return Alert.alert('Error', 'Password must be at least 6 characters');

    setLoading(true);
    try {
      await API.post('/send-otp', { email });
      Alert.alert('Success', 'OTP has been sent to your email.');
      setStep('otp');
      setTimer(600); // 10 minutes
    } catch (err: any) {
      console.error('Error sending OTP:', err);
      Alert.alert('Error', err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // Step 2: Verify OTP
  // ---------------------------
  const handleVerifyOtp = async () => {
    if (!otp) return Alert.alert('Error', 'Enter OTP');

    setLoading(true);
    try {
      await API.post('/verify-otp', { email, otp });
      setStep('verify');
    } catch (err: any) {
      console.error('Error verifying OTP:', err);
      Alert.alert('Error', err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // Step 3: Change password
  // ---------------------------
  const handleChangePassword = async () => {
    setLoading(true);
    try {
      await API.post('/change-password', { email, newPassword: password });

      await AsyncStorage.setItem('hasSetPassword', 'true');
      await AsyncStorage.setItem('userCredentials', JSON.stringify({ email, password }));
      
      Alert.alert('Success', 'Password set successfully!', [
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
      Alert.alert('Error', err.response?.data?.message || 'Failed to set password');
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // Resend OTP
  // ---------------------------
  const handleResendOtp = async () => {
    if (timer > 0) return;

    setLoading(true);
    try {
      await API.post('/send-otp', { email });
      Alert.alert('Success', 'OTP resent to your email');
      setTimer(600);
    } catch (err: any) {
      Alert.alert('Error', 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // UI
  // ---------------------------
  return (
    <View style={styles.container}>
      {/* Back button */}
      {step === 'password' && (
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#19034d" />
        </TouchableOpacity>
      )}

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {step === 'password' ? 'Set Up Your Password' : step === 'otp' ? 'Verify Email' : 'Account Created'}
        </Text>
        <Text style={styles.headerSubtitle}>
          {step === 'password' ? 'Create a strong password for your account' : step === 'otp' ? "We've sent an OTP to your email" : 'Your password has been set successfully'}
        </Text>
      </View>

      <View style={styles.form}>
        {/* Password Setup */}
        {step === 'password' && (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput style={[styles.input, { backgroundColor: '#f5f5f5' }]} value={email} editable={false} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>New Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput style={styles.passwordInput} value={password} onChangeText={setPassword} placeholder="Enter password" secureTextEntry={!showPassword} placeholderTextColor="#999" />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput style={styles.passwordInput} value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Confirm password" secureTextEntry={!showConfirmPassword} placeholderTextColor="#999" />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={[styles.continueButton, loading && { opacity: 0.7 }]} onPress={handleSetPassword} disabled={loading}>
              {loading ? <ActivityIndicator color="#19034d" /> : <Text style={styles.continueButtonText}>Continue to OTP</Text>}
            </TouchableOpacity>
          </>
        )}

        {/* OTP Verification */}
        {step === 'otp' && (
          <>
            <View style={styles.emailDisplay}>
              <Mail size={20} color="#19034d" />
              <Text style={styles.emailText}>{email}</Text>
            </View>
            <Text style={styles.otpLabel}>Enter OTP</Text>
            <TextInput style={styles.otpInput} placeholder="000000" value={otp} onChangeText={setOtp} keyboardType="number-pad" maxLength={6} placeholderTextColor="#ccc" />
            <TouchableOpacity style={[styles.continueButton, loading && { opacity: 0.7 }]} onPress={handleVerifyOtp} disabled={loading}>
              {loading ? <ActivityIndicator color="#19034d" /> : <Text style={styles.continueButtonText}>Verify OTP</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.resendButton} onPress={handleResendOtp} disabled={timer > 0}>
              <Text style={[styles.resendText, timer > 0 && { color: '#ccc' }]}>{timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}</Text>
            </TouchableOpacity>
          </>
        )}

        {/* OTP Verified */}
        {step === 'verify' && (
          <>
            <View style={styles.successContainer}>
              <Text style={styles.successEmoji}>✓</Text>
              <Text style={styles.successMessage}>OTP Verified Successfully!</Text>
              <Text style={styles.successSubtext}>Your email has been verified.</Text>
            </View>
            <TouchableOpacity style={[styles.continueButton, loading && { opacity: 0.7 }]} onPress={handleChangePassword} disabled={loading}>
              {loading ? <ActivityIndicator color="#19034d" /> : <Text style={styles.continueButtonText}>Complete Setup & Login</Text>}
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

// ---------------------------
// Styles (same as before)
// ---------------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', marginLeft: 16, marginTop: 16 },
  header: { backgroundColor: '#19034d', paddingTop: 20, paddingBottom: 30, paddingHorizontal: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  headerSubtitle: { fontSize: 14, color: '#ddd' },
  form: { padding: 20, flex: 1 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#19034d', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: '#333' },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8 },
  passwordInput: { flex: 1, fontSize: 16, color: '#333' },
  emailDisplay: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9fa', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 24, borderWidth: 1, borderColor: '#e5e5e5' },
  emailText: { marginLeft: 12, fontSize: 16, color: '#333', fontWeight: '500' },
  otpLabel: { fontSize: 14, fontWeight: '600', color: '#19034d', marginBottom: 8 },
  otpInput: { fontSize: 24, fontWeight: 'bold', letterSpacing: 8, borderWidth: 2, borderColor: '#19034d', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 16, textAlign: 'center', marginBottom: 24, color: '#19034d' },
  continueButton: { backgroundColor: '#05f51d', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 10, marginBottom: 12 },
  continueButtonText: { fontSize: 16, fontWeight: 'bold', color: '#19034d' },
  resendButton: { paddingVertical: 12, alignItems: 'center' },
  resendText: { fontSize: 14, color: '#05f51d', fontWeight: '500' },
  successContainer: { alignItems: 'center', justifyContent: 'center', flex: 1, marginBottom: 50 },
  successEmoji: { fontSize: 60, marginBottom: 16 },
  successMessage: { fontSize: 20, fontWeight: 'bold', color: '#19034d', marginBottom: 8 },
  successSubtext: { fontSize: 14, color: '#666' },
});
