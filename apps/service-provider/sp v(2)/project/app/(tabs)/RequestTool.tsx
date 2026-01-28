import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface ToolRequest {
  id: string;
  item_name: string;
  description: string;
  status: string;
  created_at: string;
}

interface Offer {
  id: string;
  request_id: string;
  shop_name: string;
  price: number;
  delivery_charge: number;
  delivery_type: string;
  status: string;
}

export default function RequestTool() {
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [requests, setRequests] = useState<ToolRequest[]>([]);
  const [offers, setOffers] = useState<{ [key: string]: Offer[] }>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const generateId = () => Math.random().toString(36).substr(2, 9);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const regData = await AsyncStorage.getItem('registrationData');
      if (regData) {
        const parsed = JSON.parse(regData);
        const response = await axios.get(`http://localhost:5004/api/reqtool/get-requests?email=${parsed.email}`);
        if (response.data?.requests) {
          setRequests(response.data.requests);
          console.log('✅ Tool requests loaded:', response.data.requests);
        }
      }
    } catch (err) {
      console.error('❌ Error loading requests:', err);
    }
  };

  const handleSubmit = async () => {
    if (!itemName.trim()) {
      Alert.alert('Error', 'Please enter an item name');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }

    setLoading(true);
    try {
      const regData = await AsyncStorage.getItem('registrationData');
      if (!regData) {
        Alert.alert('Error', 'User session not found. Please login again.');
        setLoading(false);
        return;
      }

      const parsed = JSON.parse(regData);
      const response = await axios.post('http://localhost:5004/api/reqtool/submit-request', {
        email: parsed.email,
        item_name: itemName.trim(),
        description: description.trim()
      });

      if (response.data.success) {
        console.log('✅ Request submitted:', response.data.requestId);
        setItemName('');
        setDescription('');
        Alert.alert('Success', 'Tool request submitted successfully!');
        loadRequests(); // Refresh the list
      }
    } catch (err) {
      console.error('❌ Error submitting request:', err);
      Alert.alert('Error', err.response?.data?.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOffer = (offer: Offer, request: ToolRequest) => {
    const updatedOffers = { ...offers };
    updatedOffers[request.id] = updatedOffers[request.id].map((o) =>
      o.id === offer.id ? { ...o, status: 'accepted' } : o
    );
    setOffers(updatedOffers);

    Alert.alert(
      'Order Confirmed',
      `You accepted the offer from PKR{offer.shop_name} for PKR{request.item_name}.`
    );
  };

  const handleDeclineOffer = (offerId: string, requestId: string) => {
    const updatedOffers = { ...offers };
    updatedOffers[requestId] = updatedOffers[requestId].filter(
      (o) => o.id !== offerId
    );
    setOffers(updatedOffers);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      
      {/* ✅ Full-width header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Request Tools</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* ✅ Scrollable content below header */}
      <ScrollView style={styles.container}>
        
        <View style={styles.form}>
          <Text style={styles.label}>Item Name</Text>
          <TextInput
            style={styles.input}
            value={itemName}
            onChangeText={setItemName}
            placeholder="Enter item name"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter description"
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity 
            style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>{loading ? 'Submitting...' : 'Submit Request'}</Text>
          </TouchableOpacity>
        </View>

        {requests.length > 0 && (
          <View style={styles.requestsSection}>
            <Text style={styles.sectionTitle}>Requested Items</Text>

            {requests.map((request) => (
              <View key={request.id} style={styles.requestCard}>
                <Text style={styles.requestTitle}>{request.item_name}</Text>
                <Text style={styles.requestDescription}>{request.description}</Text>

                {offers[request.id] && offers[request.id].length > 0 && (
                  <View style={styles.offersSection}>
                    <Text style={styles.offersTitle}>Offers:</Text>

                    {offers[request.id].map((offer) => (
                      <View key={offer.id} style={styles.offerCard}>
                        {offer.status === 'accepted' ? (
                          <Text style={styles.acceptedText}>Offer Accepted</Text>
                        ) : (
                          <>
                            <Text style={styles.offerText}>
                              {offer.shop_name} - Rs{offer.price} + Rs{offer.delivery_charge} (
                              {offer.delivery_type})
                            </Text>

                            <View style={styles.offerButtons}>
                              <TouchableOpacity
                                style={styles.acceptButton}
                                onPress={() => handleAcceptOffer(offer, request)}
                              >
                                <Text style={styles.buttonText}>Accept</Text>
                              </TouchableOpacity>

                              <TouchableOpacity
                                style={styles.declineButton}
                                onPress={() =>
                                  handleDeclineOffer(offer.id, request.id)
                                }
                              >
                                <Text style={styles.buttonText}>Decline</Text>
                              </TouchableOpacity>
                            </View>
                          </>
                        )}
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  /* ✅ HEADER FULL WIDTH */
  header: {
    width: '100%',
    backgroundColor: '#19034d',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#fff' },

  form: { marginBottom: 30 },
  label: { fontSize: 16, fontWeight: '600', color: '#011a30', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  textArea: { height: 100, textAlignVertical: 'top' },

  submitButton: {
    backgroundColor: '#32fc17',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#999',
    opacity: 0.6,
  },
  submitButtonText: { fontSize: 16, fontWeight: '600', color: '#011a30' },

  requestsSection: { marginTop: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#011a30', marginBottom: 16 },

  requestCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  requestTitle: { fontSize: 18, fontWeight: '600', color: '#011a30', marginBottom: 8 },
  requestDescription: { fontSize: 14, color: '#666', marginBottom: 12 },

  offersSection: { marginTop: 12 },
  offersTitle: { fontSize: 16, fontWeight: '600', color: '#011a30', marginBottom: 8 },

  offerCard: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 8 },
  offerText: { fontSize: 14, color: '#333', marginBottom: 12 },

  offerButtons: { flexDirection: 'row', gap: 8 },

  acceptButton: {
    flex: 1,
    backgroundColor: '#32fc17',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  declineButton: {
    flex: 1,
    backgroundColor: '#ff4444',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: { fontSize: 14, fontWeight: '600', color: '#fff' },

  acceptedText: { fontSize: 16, fontWeight: '600', color: '#32fc17', textAlign: 'center' },
});
