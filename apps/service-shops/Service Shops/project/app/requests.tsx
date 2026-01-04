import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { MapPin, X ,ArrowLeft} from 'lucide-react-native';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { theme } from '@/constants/theme';
import { Request, RequestResponse } from '@/types';
import { useRouter } from 'expo-router';
export default function Requests() {
    const router = useRouter();
  const [requests, setRequests] = useState<Request[]>([
    {
      id: '1',
      seekerName: 'John Doe',
      itemRequested: 'Heavy duty hammer',
      location: '123 Main St, City',
      status: 'pending',
    },
    {
      id: '2',
      seekerName: 'Jane Smith',
      itemRequested: 'Paint brushes set',
      location: '456 Oak Ave, City',
      status: 'pending',
    },
  ]);

  const [responseModalVisible, setResponseModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [responseData, setResponseData] = useState({
    price: '',
    deliveryCharge: '',
    deliveryType: 'Delivery' as 'Delivery' | 'Takeaway',
  });

  const handleNo = (request: Request) => {
    setSelectedRequest(request);
    setConfirmModalVisible(true);
  };

  const confirmNo = () => {
    if (selectedRequest) {
      setRequests(requests.map(req =>
        req.id === selectedRequest.id
          ? { ...req, status: 'responded' as const }
          : req
      ));
      setConfirmModalVisible(false);
      setSelectedRequest(null);
    }
  };

  const handleYes = (request: Request) => {
    setSelectedRequest(request);
    setResponseData({
      price: '',
      deliveryCharge: '',
      deliveryType: 'Delivery',
    });
    setResponseModalVisible(true);
  };

  const sendResponse = () => {
    if (!responseData.price || !responseData.deliveryCharge) {
      return;
    }

    if (selectedRequest) {
      const response: RequestResponse = {
        price: parseFloat(responseData.price),
        deliveryCharge: parseFloat(responseData.deliveryCharge),
        deliveryType: responseData.deliveryType,
      };

      setRequests(requests.map(req =>
        req.id === selectedRequest.id
          ? { ...req, status: 'responded' as const, response }
          : req
      ));

      setResponseModalVisible(false);
      setSelectedRequest(null);
    }
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const respondedRequests = requests.filter(r => r.status === 'responded');

  return (
    <View style={styles.container}>
     {/* // <Header title="Incoming Requests" subtitle={`${pendingRequests.length} pending`} /> */}
 <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Incoming Requests</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView style={styles.content}>
        {pendingRequests.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No pending requests</Text>
          </View>
        ) : (
          pendingRequests.map((request) => (
            <Card key={request.id} style={styles.requestCard}>
              <View style={styles.requestHeader}>
                <Text style={styles.seekerName}>{request.seekerName}</Text>
              </View>

              <Text style={styles.itemRequested}>{request.itemRequested}</Text>

              <TouchableOpacity style={styles.locationRow}>
                <MapPin size={16} color={theme.colors.textLight} />
                <Text style={styles.locationText}>{request.location}</Text>
              </TouchableOpacity>

              <View style={styles.actionButtons}>
                <Button
                  title="NO"
                  onPress={() => handleNo(request)}
                  variant="outline"
                  style={styles.actionButton}
                />
                <Button
                  title="YES"
                  onPress={() => handleYes(request)}
                  style={styles.actionButton}
                />
              </View>
            </Card>
          ))
        )}

        {respondedRequests.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Responded Requests</Text>
            {respondedRequests.map((request) => (
              <Card key={request.id} style={styles.requestCard}>
                <View style={styles.requestHeader}>
                  <Text style={styles.seekerName}>{request.seekerName}</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>Responded</Text>
                  </View>
                </View>

                <Text style={styles.itemRequested}>{request.itemRequested}</Text>

                {request.response && (
                  <View style={styles.responseInfo}>
                    <Text style={styles.responseLabel}>
                      Price: Rs-{request.response.price}
                    </Text>
                    <Text style={styles.responseLabel}>
                      Delivery: Rs-{request.response.deliveryCharge} ({request.response.deliveryType})
                    </Text>
                  </View>
                )}
              </Card>
            ))}
          </>
        )}
      </ScrollView>

      <Modal
        visible={confirmModalVisible}
        animationType="fade"
        transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModal}>
            <Text style={styles.confirmTitle}>Are you sure?</Text>
            <Text style={styles.confirmText}>
              This will send a message to the seeker that you don't have this item.
            </Text>
            <View style={styles.confirmActions}>
              <Button
                title="Cancel"
                onPress={() => setConfirmModalVisible(false)}
                variant="outline"
                style={styles.confirmButton}
              />
              <Button
                title="Confirm"
                onPress={confirmNo}
                style={styles.confirmButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={responseModalVisible}
        animationType="slide"
        transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Respond to Request</Text>
              <TouchableOpacity onPress={() => setResponseModalVisible(false)}>
                <X size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.form}>
              <Text style={styles.requestInfo}>
                Item: {selectedRequest?.itemRequested}
              </Text>
              <Text style={styles.requestInfo}>
                Requested by: {selectedRequest?.seekerName}
              </Text>

              <Text style={styles.label}>Price</Text>
              <TextInput
                style={styles.input}
                value={responseData.price}
                onChangeText={(text) => setResponseData({ ...responseData, price: text })}
                placeholder="0.00"
                keyboardType="decimal-pad"
              />

              <Text style={styles.label}>Delivery Charge</Text>
              <TextInput
                style={styles.input}
                value={responseData.deliveryCharge}
                onChangeText={(text) => setResponseData({ ...responseData, deliveryCharge: text })}
                placeholder="0.00"
                keyboardType="decimal-pad"
              />

              <Text style={styles.label}>Delivery Type</Text>
              <View style={styles.deliveryTypeContainer}>
                <TouchableOpacity
                  style={[
                    styles.deliveryTypeButton,
                    responseData.deliveryType === 'Delivery' && styles.deliveryTypeActive,
                  ]}
                  onPress={() => setResponseData({ ...responseData, deliveryType: 'Delivery' })}>
                  <Text
                    style={[
                      styles.deliveryTypeText,
                      responseData.deliveryType === 'Delivery' && styles.deliveryTypeTextActive,
                    ]}>
                    Delivery
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.deliveryTypeButton,
                    responseData.deliveryType === 'Takeaway' && styles.deliveryTypeActive,
                  ]}
                  onPress={() => setResponseData({ ...responseData, deliveryType: 'Takeaway' })}>
                  <Text
                    style={[
                      styles.deliveryTypeText,
                      responseData.deliveryType === 'Takeaway' && styles.deliveryTypeTextActive,
                    ]}>
                    Takeaway
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                onPress={() => setResponseModalVisible(false)}
                variant="outline"
                style={styles.modalButton}
              />
              <Button
                title="Send Info"
                onPress={sendResponse}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl * 2,
  },
  emptyText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textLight,
  },
  requestCard: {
    marginBottom: theme.spacing.md,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  seekerName: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  statusBadge: {
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  statusText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.background,
    fontWeight: '600',
  },
  itemRequested: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  locationText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
    marginLeft: theme.spacing.xs,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  responseInfo: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.sm,
    backgroundColor: '#f9fafb',
    borderRadius: theme.borderRadius.md,
  },
  responseLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmModal: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    width: '80%',
    maxWidth: 400,
  },
  confirmTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  confirmText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.lg,
  },
  confirmActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  confirmButton: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.xl,
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  form: {
    padding: theme.spacing.md,
  },
  requestInfo: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  label: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.md,
  },
  deliveryTypeContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  deliveryTypeButton: {
    flex: 1,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  deliveryTypeActive: {
    backgroundColor: theme.colors.secondary,
    borderColor: theme.colors.secondary,
  },
  deliveryTypeText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  deliveryTypeTextActive: {
    color: theme.colors.background,
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  modalButton: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#19034d',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
  },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
});
