import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface Order {
  id: string;
  item_name: string;
  description: string;
  price: number;
  delivery_type: string;
  order_type: string;
  status: string;
  created_at: string;
}

export default function ToolHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, []);

  // Mock Data
  const fetchOrders = async () => {
    const mockData: Order[] = [
      {
        id: '1',
        item_name: 'Electric Drill',
        description: 'High-power drill with 3-speed control',
        price: 150,
        delivery_type: 'Home Delivery',
        order_type: 'inventory',
        status: 'confirmed',
        created_at: '2025-10-30T14:22:00Z',
      },
      {
        id: '2',
        item_name: 'Hammer Set',
        description: 'Pack of 3 hammers (light, medium, heavy)',
        price: 70,
        delivery_type: 'Pickup',
        order_type: 'custom',
        status: 'pending',
        created_at: '2025-10-29T10:45:00Z',
      },
      {
        id: '3',
        item_name: 'Measuring Tape',
        description: '5m Steel tape with automatic lock',
        price: 20,
        delivery_type: 'Home Delivery',
        order_type: 'inventory',
        status: 'confirmed',
        created_at: '2025-10-28T08:30:00Z',
      },
    ];

    setOrders(mockData);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      
      {/* ✅ FULL-WIDTH HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tool History</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* ✅ CONTENT BELOW HEADER */}
      <ScrollView style={styles.content}>
        {orders.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No orders yet</Text>
          </View>
        ) : (
          orders.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              
              {/* Title + Status */}
              <View style={styles.orderHeader}>
                <Text style={styles.orderTitle}>{order.item_name}</Text>

                <Text
                  style={[
                    styles.orderStatus,
                    order.status === 'confirmed'
                      ? styles.statusConfirmed
                      : styles.statusPending,
                  ]}
                >
                  {order.status === 'confirmed' ? '✅' : '⏳'} {order.status.toUpperCase()}
                </Text>
              </View>

              {order.description && (
                <Text style={styles.orderDescription}>{order.description}</Text>
              )}

              {/* Details */}
              <View style={styles.orderDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Price:</Text>
                  <Text style={styles.detailValue}>${order.price}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Delivery:</Text>
                  <Text style={styles.detailValue}>{order.delivery_type}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Source:</Text>
                  <Text style={styles.detailValue}>
                    {order.order_type === 'inventory'
                      ? 'Shop Inventory'
                      : 'Custom Request'}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Date:</Text>
                  <Text style={styles.detailValue}>
                    {formatDate(order.created_at)}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },

  /* ✅ HEADER */
  header: {
    width: '100%',
    backgroundColor: '#19034d',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },

  /* ✅ CONTENT */
  content: { flex: 1, padding: 20 },

  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: { fontSize: 18, color: '#999' },

  /* ✅ ORDER CARD */
  orderCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#32fc17',
  },

  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  orderTitle: { fontSize: 18, fontWeight: '600', color: '#011a30', flex: 1 },

  orderStatus: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusConfirmed: { backgroundColor: '#32fc1720', color: '#32fc17' },
  statusPending: { backgroundColor: '#ffaa0020', color: '#ffaa00' },

  orderDescription: { fontSize: 14, color: '#666', marginBottom: 12 },

  orderDetails: { gap: 8 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between' },
  detailLabel: { fontSize: 14, color: '#666' },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#011a30',
  },
});
