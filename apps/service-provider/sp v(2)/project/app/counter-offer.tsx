import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, DollarSign } from 'lucide-react-native';

export default function CounterOfferScreen() {
  const router = useRouter();
  const [counterAmount, setCounterAmount] = useState('');
  const [message, setMessage] = useState('');

  const originalPrice = 500;

  const handleSubmitCounter = () => {
    if (!counterAmount) {
      Alert.alert('Missing Amount', 'Please enter your counter offer amount');
      return;
    }

    const amount = parseInt(counterAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }

    Alert.alert(
      'Counter Offer Sent',
      `Your counter offer of PKR ${amount.toLocaleString()} has been sent to the customer.`,
      [
        {
          text: 'OK',
          onPress: () => router.replace('/jobs')
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#19034d" />
        </TouchableOpacity>
        <Text style={styles.title}>Counter Offer</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.jobSummary}>
          <Text style={styles.jobTitle}>Electrical Wiring Repair</Text>
          <Text style={styles.originalPrice}>Original Offer: PKR {originalPrice.toLocaleString()}</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Your Counter Offer *</Text>
            <View style={styles.priceInputContainer}>
              <DollarSign size={20} color="#6B7280" />
              <Text style={styles.currency}>PKR</Text>
              <TextInput
                style={styles.priceInput}
                value={counterAmount}
                onChangeText={setCounterAmount}
                placeholder="0"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Message (Optional)</Text>
            <TextInput
              style={styles.messageInput}
              value={message}
              onChangeText={setMessage}
              placeholder="Explain your counter offer..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.tipContainer}>
            <Text style={styles.tipTitle}>💡 Counter Offer Tips:</Text>
            <Text style={styles.tipText}>• Be reasonable with your pricing</Text>
            <Text style={styles.tipText}>• Explain why you're adjusting the price</Text>
            <Text style={styles.tipText}>• Consider material costs and complexity</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            !counterAmount && styles.disabledButton,
          ]}
          onPress={handleSubmitCounter}
          disabled={!counterAmount}>
          <Text style={[
            styles.submitText,
            !counterAmount && styles.disabledText,
          ]}>
            Send Counter Offer
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#19034d',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  jobSummary: {
    backgroundColor: '#F9FAFB',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#19034d',
    marginBottom: 8,
  },
  originalPrice: {
    fontSize: 16,
    color: '#6B7280',
  },
  formContainer: {
    gap: 24,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#19034d',
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  currency: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  priceInput: {
    flex: 1,
    fontSize: 18,
    color: '#19034d',
    fontWeight: 'bold',
  },
  messageInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#19034d',
    backgroundColor: '#FFFFFF',
    textAlignVertical: 'top',
    minHeight: 100,
  },
  tipContainer: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 13,
    color: '#92400E',
    marginBottom: 4,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  submitButton: {
    backgroundColor: '#05f51d',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
  submitText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  disabledText: {
    color: '#9CA3AF',
  },
});