import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Wrench, Zap, Check } from 'lucide-react-native';

const categories = [
  {
    id: 1,
    name: 'Electrical',
    icon: Zap,
    color: '#4f46e5',
    subcategories: [
      'Wiring', 
      'Switches and Sockets', 
      'MCB Fuse DB Box', 
      'Lights and Fans',
      'Inverter UPS', 
      'Earthing Grounding', 
      'Motors and Pumps', 
      'Appliance Connection',
      'CCTV Intercom Networking Cables', 
      'Generator and Transformer'
    ],
  },
  {
    id: 2,
    name: 'Plumbing',
    icon: Wrench,
    color: '#059669',
    subcategories: [
      'Pipes', 
      'Taps and Mixers', 
      'Wash Basin Sink', 
      'Toilet WC Commode',
      'Shower and Bathtub', 
      'Water Tank and Pipeline', 
      'Drainage Sewage Lines',
      'Water Heater Connections', 
      'Gas Pipe Fitting', 
      'Fire Sprinkler Pipeline'
    ],
  },
];

export default function ServicesScreen() {
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);

  const toggleCategory = (category: any) => {
    setSelectedCategories(prev => {
      const isSelected = prev.some(item => item.id === category.id);
      if (isSelected) return prev.filter(item => item.id !== category.id);
      return [...prev, category]; // store full object including subcategories
    });
  };

  const handleContinue = () => {
    if (selectedCategories.length === 0) {
      Alert.alert('Error', 'Please select at least one service category');
      return;
    }

    router.push({
      pathname: '/subcategories',
      params: { categories: JSON.stringify(selectedCategories) },
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Choose the service Category</Text>
        <Text style={styles.note}>You can select multiple categories</Text>

        {categories.map(category => {
          const Icon = category.icon;
          const isSelected = selectedCategories.some(item => item.id === category.id);
          return (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryCard, isSelected && styles.selectedCategory]}
              onPress={() => toggleCategory(category)}
            >
              <View style={[styles.iconContainer, { backgroundColor: `${category.color}15` }]}>
                <Icon size={32} color={category.color} />
                {isSelected && (
                  <View style={styles.checkOverlay}>
                    <Check size={16} color="#fff" />
                  </View>
                )}
              </View>
              <Text style={[styles.categoryName, isSelected && styles.selectedCategoryText]}>
                {category.name}
              </Text>
              <Text style={styles.categoryCount}>{category.subcategories.length} services</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <TouchableOpacity
        style={[styles.continueButton, selectedCategories.length === 0 && styles.disabledButton]}
        disabled={selectedCategories.length === 0}
        onPress={handleContinue}
      >
        <Text style={[styles.continueButtonText, selectedCategories.length === 0 && styles.disabledButtonText]}>
          Continue ({selectedCategories.length} selected)
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, padding: 24 },
  title: { fontSize: 18, fontWeight: '600', color: '#333', textAlign: 'center', marginBottom: 4 },
  note: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 24 },
  categoryCard: { backgroundColor: '#f8f9fa', padding: 20, borderRadius: 16, alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: '#e5e5e5' },
  selectedCategory: { backgroundColor: '#f0fff1', borderColor: '#05f51d', borderWidth: 2 },
  iconContainer: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 12, position: 'relative' },
  checkOverlay: { position: 'absolute', top: -4, right: -4, width: 24, height: 24, backgroundColor: '#05f51d', borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
  categoryName: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4 },
  selectedCategoryText: { color: '#05f51d', fontWeight: '700' },
  categoryCount: { fontSize: 12, color: '#666' },
  continueButton: { backgroundColor: '#05f51d', paddingVertical: 16, alignItems: 'center', borderRadius: 12, marginHorizontal: 24, marginBottom: 24 },
  continueButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  disabledButton: { backgroundColor: '#ccc' },
  disabledButtonText: { color: '#999' },
});
