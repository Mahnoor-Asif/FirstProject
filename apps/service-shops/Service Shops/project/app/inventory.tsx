import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Modal, TextInput, Alert } from 'react-native';
import { Plus, Edit, Trash2, X, ArrowLeft } from 'lucide-react-native';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { theme } from '@/constants/theme';
import { InventoryItem } from '@/types';
import { useRouter } from 'expo-router';
import axios from 'axios';   // ✅ Added axios

export default function Inventory() {
  const router = useRouter();

  // ✅ Replace static data with empty list
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    available: true,
  });

  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [confirmSaveVisible, setConfirmSaveVisible] = useState(false);

  // ✅ Change this IP to your system's local IP (e.g., 192.168.x.x)
  const BASE_URL = "http://192.168.0.105:5000/inventory";

  // ✅ Fetch items from backend
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(BASE_URL);
      setItems(res.data);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to load inventory items");
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ name: '', description: '', price: '', available: true });
    setModalVisible(true);
  };

  const openEditModal = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      available: item.available,
    });
    setModalVisible(true);
  };

  // ✅ Save to backend (POST or PUT)
  const confirmSave = async () => {
    try {
      if (editingItem) {
        // Update existing item
        await axios.put(`${BASE_URL}/${editingItem._id}`, {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          available: formData.available,
        });
      } else {
        // Add new item
        await axios.post(BASE_URL, {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          available: formData.available,
        });
      }

      setModalVisible(false);
      setConfirmSaveVisible(false);
      fetchItems(); // Refresh list
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to save item");
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.price) return;
    setConfirmSaveVisible(true);
  };

  // ✅ Delete item from backend
  const handleDelete = async () => {
    try {
      if (itemToDelete) {
        await axios.delete(`${BASE_URL}/${itemToDelete}`);
        fetchItems();
      }
      setItemToDelete(null);
      setConfirmDeleteVisible(false);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to delete item");
    }
  };

  // ✅ Toggle item availability
  const toggleAvailability = async (id: string) => {
    try {
      await axios.patch(`${BASE_URL}/${id}/toggle`);
      fetchItems();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to update availability");
    }
  };

  const requestDelete = (id: string) => {
    setItemToDelete(id);
    setConfirmDeleteVisible(true);
  };

  // (UI section stays the same)
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inventory</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.headerActions}>
        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
          <Plus size={20} color={theme.colors.background} />
          <Text style={styles.addButtonText}>Add Item</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {items.map((item) => (
          <Card key={item._id} style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                {item.description && <Text style={styles.itemDescription}>{item.description}</Text>}
                <Text style={styles.itemPrice}>Rs-{item.price}</Text>
              </View>

              <View style={styles.iconRow}>
                <TouchableOpacity style={styles.iconButton} onPress={() => openEditModal(item)}>
                  <Edit size={20} color={theme.colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={() => requestDelete(item._id)}>
                  <Trash2 size={20} color={theme.colors.error} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.availabilityRow}>
              <Text style={styles.availabilityText}>{item.available ? 'Available' : 'Not Available'}</Text>
              <Switch
                value={item.available}
                onValueChange={() => toggleAvailability(item._id)}
                trackColor={{ false: theme.colors.border, true: theme.colors.secondary }}
              />
            </View>
          </Card>
        ))}
      </ScrollView>

      {/* Keep modals and styles the same */}
      {/* (Delete Confirmation, Save Confirmation, Add/Edit Modal) */}
    </View>
  );
}
