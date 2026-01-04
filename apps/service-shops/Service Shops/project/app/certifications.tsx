import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Upload, ArrowLeft, CheckCircle, Clock } from 'lucide-react-native';

export default function ShopRegistration() {
  const router = useRouter();

  // Shop details
  const [shopName, setShopName] = useState('');
  const [shopAddress, setShopAddress] = useState('');

  // Ownership type
  const [ownershipType, setOwnershipType] = useState<'owned' | 'rented' | null>(null);

  // Documents
  const [registrationDoc, setRegistrationDoc] = useState<string | null>(null);
  const [rentAgreement, setRentAgreement] = useState<string | null>(null);
  const [ntnDoc, setNtnDoc] = useState<string | null>(null);
  const [shopImage, setShopImage] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);

  const pickDocument = async (setDoc: (uri: string) => void) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      setDoc(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!shopName || !shopAddress || !ownershipType) {
      alert('Please fill shop details and select ownership type.');
      return;
    }

    if (ownershipType === 'owned' && !registrationDoc) {
      alert('Please upload the Shop Registration / Ownership document.');
      return;
    }

    if (ownershipType === 'rented' && !rentAgreement) {
      alert('Please upload the Rent Agreement.');
      return;
    }

    try {
      const shopData = {
        shopName,
        shopAddress,
        ownershipType,
        registrationDoc: ownershipType === 'owned' ? registrationDoc : null,
        rentAgreement: ownershipType === 'rented' ? rentAgreement : null,
        ntnDoc,
        shopImage,
      };

      await AsyncStorage.setItem('shopData', JSON.stringify(shopData));
      await AsyncStorage.setItem('hasRegistered', 'true');
      setShowModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    router.replace('/set-password');
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          if (router.canGoBack()) router.back();
          else router.replace('/skills-selection');
        }}
      >
        <ArrowLeft size={24} color="#19034d" />
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Register Your Shop</Text>
        <Text style={styles.subtitle}>
          Provide shop details and upload required documents
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Shop Name */}
          <TextInput
            style={styles.input}
            placeholder="Shop Name"
            value={shopName}
            onChangeText={setShopName}
          />

          {/* Shop Address */}
          <TextInput
            style={styles.input}
            placeholder="Shop Address"
            value={shopAddress}
            onChangeText={setShopAddress}
          />

          {/* Ownership Selection */}
          <Text style={styles.sectionTitle}>Ownership Type</Text>
          <View style={styles.ownershipContainer}>
            <TouchableOpacity
              style={[
                styles.ownershipOption,
                ownershipType === 'owned' && styles.ownershipSelected,
              ]}
              onPress={() => setOwnershipType('owned')}
            >
              <Text style={styles.ownershipText}>Owned</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.ownershipOption,
                ownershipType === 'rented' && styles.ownershipSelected,
              ]}
              onPress={() => setOwnershipType('rented')}
            >
              <Text style={styles.ownershipText}>Rented</Text>
            </TouchableOpacity>
          </View>

          {/* Upload based on ownership */}
          {ownershipType === 'owned' && (
            <>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => pickDocument(setRegistrationDoc)}
              >
                <Upload size={24} color="#19034d" />
                <Text style={styles.uploadButtonText}>
                  Upload Shop Registration / Ownership Proof
                </Text>
              </TouchableOpacity>
              {registrationDoc && <Text style={styles.docText}>Uploaded ✔</Text>}
            </>
          )}

          {ownershipType === 'rented' && (
            <>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => pickDocument(setRentAgreement)}
              >
                <Upload size={24} color="#19034d" />
                <Text style={styles.uploadButtonText}>Upload Rent Agreement</Text>
              </TouchableOpacity>
              {rentAgreement && <Text style={styles.docText}>Uploaded ✔</Text>}
            </>
          )}

          {/* Upload NTN (optional) */}
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => pickDocument(setNtnDoc)}
          >
            <Upload size={24} color="#19034d" />
            <Text style={styles.uploadButtonText}>Upload NTN Certificate (optional)</Text>
          </TouchableOpacity>
          {ntnDoc && <Text style={styles.docText}>Uploaded ✔</Text>}

          {/* Upload Shop Image */}
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => pickDocument(setShopImage)}
          >
            <Upload size={24} color="#19034d" />
            <Text style={styles.uploadButtonText}>Upload Image of Shop</Text>
          </TouchableOpacity>
          {shopImage && <Text style={styles.docText}>Uploaded ✔</Text>}

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Upload required documents based on your ownership type. NTN and Shop Image are optional.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Registration</Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.iconContainer}>
              <CheckCircle size={48} color="#05f51d" />
              <Clock size={24} color="#19034d" style={{ marginLeft: -10, marginTop: 10 }} />
            </View>

            <Text style={styles.modalTitle}>Shop Registration Submitted!</Text>
            <Text style={styles.modalMessage}>
              Your shop details have been received. Please wait up to 24 hours for verification.
            </Text>

            <Pressable style={styles.okButton} onPress={handleModalClose}>
              <Text style={styles.okButtonText}>Okay</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 24, paddingTop: 60 },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  header: { marginBottom: 32 },
  title: { fontSize: 28, fontWeight: '700', color: '#19034d', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666' },
  scrollView: { flex: 1 },
  content: { gap: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#19034d',
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginTop: 20, marginBottom: 10 },
  ownershipContainer: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  ownershipOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  ownershipSelected: { borderColor: '#05f51d', backgroundColor: '#e6ffe6' },
  ownershipText: { fontSize: 16, fontWeight: '600', color: '#19034d' },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#19034d',
    borderRadius: 12,
    paddingVertical: 24,
    gap: 12,
    marginBottom: 10,
  },
  uploadButtonText: { fontSize: 16, color: '#19034d', fontWeight: '600' },
  docText: { marginLeft: 10, color: '#05f51d', fontWeight: '600', marginBottom: 10 },
  infoBox: { backgroundColor: '#f0ebf8', padding: 16, borderRadius: 8, borderLeftWidth: 4, borderLeftColor: '#19034d', marginTop: 10 },
  infoText: { fontSize: 14, color: '#666', lineHeight: 20 },
  footer: { paddingVertical: 20, borderTopWidth: 1, borderTopColor: '#eee' },
  submitButton: { backgroundColor: '#05f51d', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  submitButtonText: { fontSize: 16, fontWeight: '600', color: '#19034d' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContainer: { width: '90%', backgroundColor: '#fff', borderRadius: 20, padding: 24, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, elevation: 8 },
  iconContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#19034d', marginBottom: 8 },
  modalMessage: { fontSize: 15, color: '#555', textAlign: 'center', lineHeight: 22, marginBottom: 20 },
  okButton: { backgroundColor: '#05f51d', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 10 },
  okButtonText: { color: '#19034d', fontWeight: '700', fontSize: 16 },
});
