import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Clock, Package as PackageIcon, CheckCircle, XCircle ,ArrowLeft} from 'lucide-react-native';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { theme } from '@/constants/theme';
import { Order } from '@/types';
import { useRouter } from 'expo-router';
type TabType = 'incoming' | 'active' | 'completed' | 'rejected';

export default function Orders() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('incoming');
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD001',
      seekerName: 'John Doe',
      items: [
        { name: 'Power Drill', quantity: 1, price: 50 },
        { name: 'Drill Bits Set', quantity: 1, price: 25 },
      ],
      deliveryType: 'Delivery',
      totalPrice: 75,
      deliveryCharge: 10,
      status: 'incoming',
      date: '2025-10-24',
    },
    {
      id: 'ORD002',
      seekerName: 'Jane Smith',
      items: [
        { name: 'Ladder', quantity: 1, price: 75 },
      ],
      deliveryType: 'Takeaway',
      totalPrice: 75,
      deliveryCharge: 0,
      status: 'active',
      progress: 'Preparing',
      date: '2025-10-24',
    },
    {
      id: 'ORD003',
      seekerName: 'Bob Wilson',
      items: [
        { name: 'Paint Brushes', quantity: 2, price: 30 },
      ],
      deliveryType: 'Delivery',
      totalPrice: 30,
      deliveryCharge: 5,
      status: 'completed',
      progress: 'Delivered',
      date: '2025-10-23',
    },
  ]);

  const handleAccept = (orderId: string) => {
    setOrders(orders.map(order =>
      order.id === orderId
        ? { ...order, status: 'active', progress: 'Preparing' }
        : order
    ));
  };

  const handleReject = (orderId: string) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: 'rejected' } : order
    ));
  };

  const updateProgress = (orderId: string, progress: Order['progress']) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, progress } : order
    ));
  };

  const markAsDelivered = (orderId: string) => {
    setOrders(orders.map(order =>
      order.id === orderId
        ? { ...order, status: 'completed', progress: 'Delivered' }
        : order
    ));
  };

  const getProgressColor = (progress?: string) => {
    switch (progress) {
      case 'Preparing':
        return '#3b82f6';
      case 'Ready':
        return '#f59e0b';
      case 'Delivered':
        return theme.colors.success;
      default:
        return theme.colors.textLight;
    }
  };

  const filteredOrders = orders.filter(order => order.status === activeTab);

  const tabs: { key: TabType; label: string; icon: any }[] = [
    { key: 'incoming', label: 'Incoming', icon: Clock },
    { key: 'active', label: 'Active', icon: PackageIcon },
    { key: 'completed', label: 'Completed', icon: CheckCircle },
    { key: 'rejected', label: 'Rejected', icon: XCircle },
  ];

  return (
    <View style={styles.container}>
      {/* <Header title="Orders" subtitle={`${filteredOrders.length} ${activeTab}`} /> */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} >
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Orders Detail</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                activeTab === tab.key && styles.activeTab,
              ]}
              onPress={() => setActiveTab(tab.key)}>
              <tab.icon
                size={18}
                color={activeTab === tab.key ? theme.colors.secondary : theme.colors.textLight}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.key && styles.activeTabText,
                ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content}>
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No {activeTab} orders</Text>
          </View>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>Order #{order.id}</Text>
                <Text style={styles.orderDate}>{order.date}</Text>
              </View>

              <Text style={styles.seekerName}>{order.seekerName}</Text>

              <View style={styles.itemsList}>
                {order.items.map((item, index) => (
                  <View key={index} style={styles.itemRow}>
                    <Text style={styles.itemText}>
                      {item.quantity}x {item.name}
                    </Text>
                    <Text style={styles.itemPrice}>${item.price}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.orderDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Subtotal:</Text>
                  <Text style={styles.detailValue}>${order.totalPrice}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Delivery Charge:</Text>
                  <Text style={styles.detailValue}>${order.deliveryCharge}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Delivery Type:</Text>
                  <Text style={styles.detailValue}>{order.deliveryType}</Text>
                </View>
                <View style={[styles.detailRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total:</Text>
                  <Text style={styles.totalValue}>
                    ${order.totalPrice + order.deliveryCharge}
                  </Text>
                </View>
              </View>

              {order.status === 'incoming' && (
                <View style={styles.actionButtons}>
                  <Button
                    title="Reject"
                    onPress={() => handleReject(order.id)}
                    variant="outline"
                    style={styles.actionButton}
                  />
                  <Button
                    title="Accept"
                    onPress={() => handleAccept(order.id)}
                    style={styles.actionButton}
                  />
                </View>
              )}

              {order.status === 'active' && (
                <>
                  <View style={styles.progressContainer}>
                    <TouchableOpacity
                      style={[
                        styles.progressChip,
                        order.progress === 'Preparing' && styles.progressChipActive,
                      ]}
                      onPress={() => updateProgress(order.id, 'Preparing')}>
                      <Text
                        style={[
                          styles.progressText,
                          { color: getProgressColor('Preparing') },
                        ]}>
                        Preparing
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.progressChip,
                        order.progress === 'Ready' && styles.progressChipActive,
                      ]}
                      onPress={() => updateProgress(order.id, 'Ready')}>
                      <Text
                        style={[
                          styles.progressText,
                          { color: getProgressColor('Ready') },
                        ]}>
                        Ready
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Button
                    title="Mark as Delivered"
                    onPress={() => markAsDelivered(order.id)}
                    style={{ marginTop: theme.spacing.md }}
                  />
                </>
              )}

              {order.status === 'completed' && order.progress && (
                <View style={styles.statusBadge}>
                  <CheckCircle size={16} color={theme.colors.success} />
                  <Text style={[styles.statusText, { color: theme.colors.success }]}>
                    {order.progress}
                  </Text>
                </View>
              )}

              {order.status === 'rejected' && (
                <View style={[styles.statusBadge, { backgroundColor: '#fee2e2' }]}>
                  <XCircle size={16} color={theme.colors.error} />
                  <Text style={[styles.statusText, { color: theme.colors.error }]}>
                    Rejected
                  </Text>
                </View>
              )}
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.secondary,
  },
  tabText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textLight,
  },
  activeTabText: {
    color: theme.colors.secondary,
    fontWeight: '600',
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
  orderCard: {
    marginBottom: theme.spacing.md,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  orderId: {
    fontSize: theme.fontSize.md,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  orderDate: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
  },
  seekerName: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  itemsList: {
    marginBottom: theme.spacing.md,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.xs,
  },
  itemText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
  },
  itemPrice: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    fontWeight: '600',
  },
  orderDetails: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  detailLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
  },
  detailValue: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
  },
  totalRow: {
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  totalLabel: {
    fontSize: theme.fontSize.md,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  totalValue: {
    fontSize: theme.fontSize.md,
    fontWeight: 'bold',
    color: theme.colors.secondary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  progressChip: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  progressChipActive: {
    backgroundColor: '#f0fdf4',
  },
  progressText: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    backgroundColor: '#d1fae5',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.md,
  },
  statusText: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
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
