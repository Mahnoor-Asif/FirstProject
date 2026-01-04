import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SKILLS_CATEGORIES } from '@/constants/skills';
import { Check, ArrowLeft } from 'lucide-react-native';

export default function SkillsSelection() {
  const [selectedSkills, setSelectedSkills] = useState<{ category: string; subcategories: string[] }[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const toggleCategory = (category: string) => {
    const existingIndex = selectedSkills.findIndex((s) => s.category === category);
    if (existingIndex >= 0) {
      setSelectedSkills(selectedSkills.filter((s) => s.category !== category));
      if (expandedCategory === category) setExpandedCategory(null);
    } else {
      setSelectedSkills([...selectedSkills, { category, subcategories: [] }]);
      setExpandedCategory(category);
    }
  };

  const toggleSubcategory = (category: string, subcategory: string) => {
    setSelectedSkills((prev) => {
      const categoryIndex = prev.findIndex((s) => s.category === category);
      if (categoryIndex < 0) return prev;

      const updated = [...prev];
      const subcategories = updated[categoryIndex].subcategories;
      if (subcategories.includes(subcategory)) {
        updated[categoryIndex].subcategories = subcategories.filter((s) => s !== subcategory);
      } else {
        updated[categoryIndex].subcategories = [...subcategories, subcategory];
      }
      return updated;
    });
  };

  const handleNext = async () => {
    const hasSubcategories = selectedSkills.some((skill) => skill.subcategories.length > 0);
    if (!hasSubcategories) {
      Alert.alert('Select Skills', 'Please select at least one subcategory');
      return;
    }
    await AsyncStorage.setItem('selectedSkills', JSON.stringify(selectedSkills));
    router.push('/certifications');
  };

  const isCategorySelected = (category: string) =>
    selectedSkills.some((s) => s.category === category);

  const isSubcategorySelected = (category: string, subcategory: string) => {
    const skill = selectedSkills.find((s) => s.category === category);
    return skill?.subcategories.includes(subcategory) || false;
  };

  return (
    <View style={styles.container}>
      {/* 🔙 Header same as login */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          if (router.canGoBack()) router.back();
          else router.replace('/registration');
        }}
      >
        <ArrowLeft size={24} color="#19034d" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>Select Your Skills</Text>
        <Text style={styles.subtitle}>Choose categories and subcategories</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {SKILLS_CATEGORIES.map((item) => (
            <View key={item.category} style={styles.categoryContainer}>
              <TouchableOpacity
                style={[
                  styles.categoryButton,
                  isCategorySelected(item.category) && styles.categoryButtonSelected,
                ]}
                onPress={() => toggleCategory(item.category)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    isCategorySelected(item.category) && styles.categoryTextSelected,
                  ]}
                >
                  {item.category}
                </Text>
                {isCategorySelected(item.category) && <Check size={20} color="#05f51d" />}
              </TouchableOpacity>

              {isCategorySelected(item.category) && (
                <View style={styles.subcategoriesContainer}>
                  {item.subcategories.map((sub) => (
                    <TouchableOpacity
                      key={sub}
                      style={[
                        styles.subcategoryButton,
                        isSubcategorySelected(item.category, sub) && styles.subcategoryButtonSelected,
                      ]}
                      onPress={() => toggleSubcategory(item.category, sub)}
                    >
                      <Text
                        style={[
                          styles.subcategoryText,
                          isSubcategorySelected(item.category, sub) && styles.subcategoryTextSelected,
                        ]}
                      >
                        {sub}
                      </Text>
                      {isSubcategorySelected(item.category, sub) && (
                        <Check size={16} color="#05f51d" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#19034d',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 20,
  },
  categoryContainer: {
    marginBottom: 15,
  },
  categoryButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  categoryButtonSelected: {
    borderColor: '#19034d',
    backgroundColor: '#f0ebf8',
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  categoryTextSelected: {
    color: '#19034d',
  },
  subcategoriesContainer: {
    marginTop: 10,
    marginLeft: 20,
  },
  subcategoryButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  subcategoryButtonSelected: {
    borderColor: '#05f51d',
    backgroundColor: '#f0fff1',
  },
  subcategoryText: {
    fontSize: 14,
    color: '#666',
  },
  subcategoryTextSelected: {
    color: '#19034d',
    fontWeight: '600',
  },
  footer: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  nextButton: {
    backgroundColor: '#05f51d',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#19034d',
  },
});
