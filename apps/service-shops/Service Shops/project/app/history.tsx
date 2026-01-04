import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Calendar, Filter, X } from 'lucide-react-native';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { theme } from '@/constants/theme';
import { Order } from '@/types';

type FilterStatus = 'all' | 'completed' | 'rejected';

export default function History() {
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>('all');
  const [selectedDate, setSelectedDate] = useState<string>('all');

  const [orders] = useState<Order[]>([
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
    {
      id: 'ORD004',
      seekerName: 'Alice Brown',
      items: [
        { name: 'Hammer', quantity: 1, price: 35 },
        { name: 'Nails', quantity: 1, price: 10 },
      ],
      deliveryType: 'Takeaway',
      totalPrice: 45,
      deliveryCharge: 0,
      status: 'completed',
      progress: 'Delivered',
      date: '2025-10-22',
    },
    {
      id: 'ORD005',
      seekerName: 'Charlie Davis',
      items: [
        { name: 'Wrench Set', quantity: 1, price: 60 },
      ],
      deliveryType: 'Delivery',
      totalPrice: 60,
      deliveryCharge: 8,
      status: 'rejected',
      date: '2025-10-22',
    },
    {
      id: 'ORD006',
      seekerName: 'Diana Evans',
      items: [
        { name: 'Screwdriver Set', quantity: 1, price: 40 },
      ],
      deliveryType: 'Takeaway',
      totalPrice: 40,
      deliveryCharge: 0,
      status: 'completed',
      progress: 'Delivered',
      date: '2025-10-21',
    },
  ]);

  const uniqueDates = ['all', ...Array.from(new Set(orders.map(o => o.date)))];

  const filteredOrders = orders.filter(order => {
    const statusMatch = selectedStatus === 'all' || order.status === selectedStatus;
    const dateMatch = selectedDate === 'all' || order.date === selectedDate;
    return statusMatch && dateMatch;
  });

  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const viewDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailsModalVisible(true);
  };

  const applyFilters = () => {
    setFilterModalVisible(false);
  };

  const resetFilters = () => {
    setSelectedStatus('all');
    setSelectedDate('all');
  };

  return (
    <View style={styles.container}>
      <Header title="Order History" subtitle={`${filteredOrders.length} records`} />

      <View style={styles.filterBar}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}>
          <Filter size={20} color={theme.colors.primary} />
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>

        {(selectedStatus !== 'all' || selectedDate !== 'all') && (
          <TouchableOpacity
            style={styles.resetButton}
            onPress={resetFilters}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content}>
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No orders found</Text>
          </View>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderId}>Order #{order.id}</Text>
                  <Text style={styles.seekerName}>{order.seekerName}</Text>
                </View>
                <View style={styles.statusContainer}>
                  <View
                    style={[
                      styles.statusBadge,
                      order.status === 'completed'
                        ? styles.statusCompleted
                        : styles.statusRejected,
                    ]}>
                    <Text
                      style={[
                        styles.statusText,
                        order.status === 'completed'
                          ? styles.statusTextCompleted
                          : styles.statusTextRejected,
                      ]}>
                      {order.status === 'completed' ? 'Completed' : 'Rejected'}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.dateRow}>
                <Calendar size={14} color={theme.colors.textLight} />
                <Text style={styles.dateText}>{order.date}</Text>
              </View>

              <View style={styles.itemsSummary}>
                <Text style={styles.itemsText}>
                  {order.items.length} item(s) • {order.deliveryType}
                </Text>
                <Text style={styles.totalText}>
                  Rs-{order.totalPrice + order.deliveryCharge}
                </Text>
              </View>

              <Button
                title="View Details"
                onPress={() => viewDetails(order)}
                variant="outline"
                style={{ marginTop: theme.spacing.md }}
              />
            </Card>
          ))
        )}
      </ScrollView>

      <Modal
        visible={filterModalVisible}
        animationType="slide"
        transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Orders</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <X size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Status</Text>
              <View style={styles.filterOptions}>
                {(['all', 'completed', 'rejected'] as FilterStatus[]).map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.filterOption,
                      selectedStatus === status && styles.filterOptionActive,
                    ]}
                    onPress={() => setSelectedStatus(status)}>
                    <Text
                      style={[
                        styles.filterOptionText,
                        selectedStatus === status && styles.filterOptionTextActive,
                      ]}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Date</Text>
              <ScrollView style={styles.dateList}>
                {uniqueDates.map((date) => (
                  <TouchableOpacity
                    key={date}
                    style={[
                      styles.dateOption,
                      selectedDate === date && styles.dateOptionActive,
                    ]}
                    onPress={() => setSelectedDate(date)}>
                    <Text
                      style={[
                        styles.dateOptionText,
                        selectedDate === date && styles.dateOptionTextActive,
                      ]}>
                      {date === 'all' ? 'All Dates' : date}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.modalActions}>
              <Button
                title="Apply Filters"
                onPress={applyFilters}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={detailsModalVisible}
        animationType="slide"
        transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Order Details</Text>
              <TouchableOpacity onPress={() => setDetailsModalVisible(false)}>
                <X size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            {selectedOrder && (
              <ScrollView style={styles.detailsContent}>
                <View style={styles.detailsRow}>
                  <Text style={styles.detailsLabel}>Order ID:</Text>
                  <Text style={styles.detailsValue}>{selectedOrder.id}</Text>
                </View>

                <View style={styles.detailsRow}>
                  <Text style={styles.detailsLabel}>Customer:</Text>
                  <Text style={styles.detailsValue}>{selectedOrder.seekerName}</Text>
                </View>

                <View style={styles.detailsRow}>
                  <Text style={styles.detailsLabel}>Date:</Text>
                  <Text style={styles.detailsValue}>{selectedOrder.date}</Text>
                </View>

                <View style={styles.detailsRow}>
                  <Text style={styles.detailsLabel}>Status:</Text>
                  <Text style={styles.detailsValue}>
                    {selectedOrder.status === 'completed' ? 'Completed' : 'Rejected'}
                  </Text>
                </View>

                <Text style={styles.detailsSectionTitle}>Items</Text>
                {selectedOrder.items.map((item, index) => (
                  <View key={index} style={styles.detailsItemRow}>
                    <Text style={styles.detailsItemText}>
                      {item.quantity}x {item.name}
                    </Text>
                    <Text style={styles.detailsItemPrice}>Rs-{item.price}</Text>
                  </View>
                ))}

                <View style={styles.detailsDivider} />

                <View style={styles.detailsRow}>
                  <Text style={styles.detailsLabel}>Subtotal:</Text>
                  <Text style={styles.detailsValue}>Rs-{selectedOrder.totalPrice}</Text>
                </View>

                <View style={styles.detailsRow}>
                  <Text style={styles.detailsLabel}>Delivery Charge:</Text>
                  <Text style={styles.detailsValue}>Rs-{selectedOrder.deliveryCharge}</Text>
                </View>

                <View style={styles.detailsRow}>
                  <Text style={styles.detailsLabel}>Delivery Type:</Text>
                  <Text style={styles.detailsValue}>{selectedOrder.deliveryType}</Text>
                </View>

                <View style={[styles.detailsRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total:</Text>
                  <Text style={styles.totalValue}>
                    Rs-{selectedOrder.totalPrice + selectedOrder.deliveryCharge}
                  </Text>
                </View>
              </ScrollView>
            )}
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
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  filterButtonText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  resetButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  resetButtonText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.error,
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
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  orderId: {
    fontSize: theme.fontSize.md,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  seekerName: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    marginTop: 2,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  statusCompleted: {
    backgroundColor: '#d1fae5',
  },
  statusRejected: {
    backgroundColor: '#fee2e2',
  },
  statusText: {
    fontSize: theme.fontSize.xs,
    fontWeight: '600',
  },
  statusTextCompleted: {
    color: theme.colors.success,
  },
  statusTextRejected: {
    color: theme.colors.error,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  dateText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
  },
  itemsSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemsText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
  },
  totalText: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.secondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
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
  filterSection: {
    padding: theme.spacing.md,
  },
  filterLabel: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  filterOptions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  filterOption: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  filterOptionActive: {
    backgroundColor: theme.colors.secondary,
    borderColor: theme.colors.secondary,
  },
  filterOptionText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
  },
  filterOptionTextActive: {
    color: theme.colors.background,
    fontWeight: '600',
  },
  dateList: {
    maxHeight: 200,
  },
  dateOption: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  dateOptionActive: {
    backgroundColor: theme.colors.secondary,
    borderColor: theme.colors.secondary,
  },
  dateOptionText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  dateOptionTextActive: {
    color: theme.colors.background,
    fontWeight: '600',
  },
  modalActions: {
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  detailsContent: {
    padding: theme.spacing.md,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  detailsLabel: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textLight,
  },
  detailsValue: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontWeight: '600',
  },
  detailsSectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  detailsItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  detailsItemText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
  },
  detailsItemPrice: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    fontWeight: '600',
  },
  detailsDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
  totalRow: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  totalLabel: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  totalValue: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.secondary,
  },
});
