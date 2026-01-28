import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Check, Zap, Wrench } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

interface Category {
  id: number;
  name: string;
  subcategories: string[];
}

interface Subcategory {
  name: string;
  category: string;
}

export default function SubcategoriesScreen() {
  const router = useRouter();
  const { categories } = useLocalSearchParams();
  const [selectedSubcategories, setSelectedSubcategories] = useState<Subcategory[]>([]);

  const categoryList: Category[] = JSON.parse(categories as string);

  // Flatten all subcategories
  const allSubcategories: Subcategory[] = categoryList.reduce((acc: Subcategory[], category) => [
    ...acc,
    ...category.subcategories.map(sub => ({
      name: sub,
      category: category.name,
    })),
  ], []);

  const toggleSubcategory = (subcat: Subcategory) => {
    setSelectedSubcategories(prev =>
      prev.some(item => item.name === subcat.name)
        ? prev.filter(item => item.name !== subcat.name)
        : [...prev, subcat]
    );
  };

  const handleContinue = () => {
    if (selectedSubcategories.length === 0) return;

    router.push({
      pathname: '/booking-form',
      params: {
        categories: JSON.stringify(categoryList),
        subcategories: JSON.stringify(selectedSubcategories),
      },
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#19034d" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Services</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text style={styles.subtitle}>Select the specific services you need</Text>
        <Text style={styles.note}>You can select multiple services</Text>

        {allSubcategories.map((subcat, idx) => {
          const isSelected = selectedSubcategories.some(item => item.name === subcat.name);
          const Icon = subcat.category === 'Electrical' ? Zap : Wrench;
          const iconColor = subcat.category === 'Electrical' ? '#ffb300' : '#007bff';

          return (
            <TouchableOpacity
              key={idx}
              style={[styles.subcategoryCard, isSelected && styles.selectedSubcategory]}
              onPress={() => toggleSubcategory(subcat)}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon size={20} color={isSelected ? '#05f51d' : iconColor} />
                <Text style={[styles.subcategoryText, isSelected && styles.selectedSubcategoryText]}>
                  {' '}{subcat.name}
                </Text>
              </View>
              {isSelected && (
                <View style={styles.checkIcon}>
                  <Check size={16} color="#19034d" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <TouchableOpacity
        style={[styles.continueButton, selectedSubcategories.length === 0 && styles.disabledButton]}
        disabled={selectedSubcategories.length === 0}
        onPress={handleContinue}
      >
        <Text style={[styles.continueButtonText, selectedSubcategories.length === 0 && styles.disabledButtonText]}>
          Continue ({selectedSubcategories.length} selected)
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#19034d',
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
  subtitle: { fontSize: 16, fontWeight: '500', textAlign: 'center', marginBottom: 4 },
  note: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 24 },
  subcategoryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 12,
  },
  selectedSubcategory: { backgroundColor: '#f0fff1', borderColor: '#05f51d' },
  subcategoryText: { fontSize: 16, fontWeight: '500', color: '#333' },
  selectedSubcategoryText: { color: '#05f51d', fontWeight: '600' },
  checkIcon: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#05f51d', justifyContent: 'center', alignItems: 'center' },
  continueButton: { backgroundColor: '#05f51d', paddingVertical: 16, borderRadius: 12, marginHorizontal: 24, marginBottom: 24, alignItems: 'center' },
  continueButtonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  disabledButton: { backgroundColor: '#ccc' },
  disabledButtonText: { color: '#999' },
});
