import React, { useState, useEffect } from 'react';
import { 
  View, Text, TouchableOpacity, ScrollView, StyleSheet, 
  Alert, ActivityIndicator, Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import { SKILLS_CATEGORIES } from '@/constants/skills'; 
import { Check, ArrowLeft } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function SkillsSelection() {
  const router = useRouter();
  const [selectedSkills, setSelectedSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // 1. Fetch the email saved during the Registration step
  useEffect(() => {
    const getSavedEmail = async () => {
      try {
        console.log('📲 Retrieving registrationData from AsyncStorage...');
        const data = await AsyncStorage.getItem('registrationData');
        console.log('📦 registrationData:', data);
        if (data) {
          const parsed = JSON.parse(data);
          console.log('✅ Email extracted:', parsed.email);
          setUserEmail(parsed.email);
        } else {
          console.log('❌ No registrationData found');
          Alert.alert("Error", "Session expired. Please start registration again.");
          router.replace('/registration'); // Redirect back if no email found
        }
      } catch (e) {
        console.error("AsyncStorage Error", e);
      }
    };
    getSavedEmail();
  }, []);

  const toggleCategory = (category: string) => {
    const idx = selectedSkills.findIndex((s: any) => s.category === category);
    if (idx >= 0) {
      setSelectedSkills(selectedSkills.filter((s: any) => s.category !== category));
    } else {
      setSelectedSkills([...selectedSkills, { category, subcategories: [] }]);
    }
  };

  const toggleSubcategory = (category: string, sub: string) => {
    setSelectedSkills((prev: any) => {
      const idx = prev.findIndex((s: any) => s.category === category);
      if (idx < 0) return prev;
      const updated = [...prev];
      const subs = updated[idx].subcategories;
      updated[idx].subcategories = subs.includes(sub) 
        ? subs.filter((x: string) => x !== sub) 
        : [...subs, sub];
      return updated;
    });
  };

  // 2. Connect to Backend & MongoDB
  const handleNext = async () => {
    const hasSubSkills = selectedSkills.some(s => s.subcategories.length > 0);
    
    if (!hasSubSkills) {
      Alert.alert('Selection Required', 'Please select at least one specific skill.');
      return;
    }

    setLoading(true);
    try {
      // API call to update the user record created in Step 1
      const response = await axios.post('http://localhost:5004/api/update-skills', {
        email: userEmail,
        skills: selectedSkills
      });

      if (response.data.success) {
        // Save skills locally for the next screen summary
        await AsyncStorage.setItem('userSkills', JSON.stringify(selectedSkills));
        
        router.push('/certifications');
      } else {
        Alert.alert('Error', response.data.message || 'Failed to save skills.');
      }
    } catch (error: any) {
      console.error("Update Skills Error:", error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Failed to save skills.');
    } finally {
      setLoading(false);
    }
  };

  const isCategorySelected = (cat: string) => selectedSkills.some((s: any) => s.category === cat);
  const isSubSelected = (cat: string, sub: string) => selectedSkills.find((s: any) => s.category === cat)?.subcategories.includes(sub) || false;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ArrowLeft size={24} color="#19034d" />
      </TouchableOpacity>
      
      <View style={styles.header}>
        <Text style={styles.title}>Select Your Skills</Text>
        <Text style={styles.subtitle}>What services will you provide?</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {SKILLS_CATEGORIES.map(cat => (
          <View key={cat.category} style={{ marginBottom: 15 }}>
            <TouchableOpacity 
              activeOpacity={0.7}
              style={[styles.categoryButton, isCategorySelected(cat.category) && styles.categoryButtonSelected]} 
              onPress={() => toggleCategory(cat.category)}
            >
              <Text style={[styles.categoryText, isCategorySelected(cat.category) && styles.categoryTextSelected]}>
                {cat.category}
              </Text>
              {isCategorySelected(cat.category) && <Check size={20} color="#05f51d" />}
            </TouchableOpacity>

            {isCategorySelected(cat.category) && (
              <View style={styles.subContainer}>
                {cat.subcategories.map(sub => (
                  <TouchableOpacity 
                    key={sub} 
                    style={[styles.subButton, isSubSelected(cat.category, sub) && styles.subButtonSelected]} 
                    onPress={() => toggleSubcategory(cat.category, sub)}
                  >
                    <Text style={[styles.subText, isSubSelected(cat.category, sub) && styles.subTextSelected]}>{sub}</Text>
                    {isSubSelected(cat.category, sub) && <Check size={16} color="#05f51d" />}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.nextButton, loading && { opacity: 0.7 }]} 
          onPress={handleNext}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#19034d" />
          ) : (
            <Text style={styles.nextButtonText}>Save & Next</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 24, paddingTop: 50 },
  backButton: { marginBottom: 10, width: 40 },
  header: { marginBottom: 20 },
  title: { fontSize: 26, fontWeight: '800', color: '#19034d' },
  subtitle: { fontSize: 15, color: '#666', marginTop: 4 },
  categoryButton: { padding: 16, borderWidth: 1, borderColor: '#efefef', borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9f9f9' },
  categoryButtonSelected: { backgroundColor: '#fff', borderColor: '#19034d', borderWidth: 2 },
  categoryText: { fontSize: 16, fontWeight: '700', color: '#333' },
  categoryTextSelected: { color: '#19034d' },
  subContainer: { marginLeft: 20, marginTop: 10, borderLeftWidth: 2, borderLeftColor: '#f0f0f0', paddingLeft: 12 },
  subButton: { padding: 12, borderWidth: 1, borderColor: '#eee', borderRadius: 10, backgroundColor: '#fff', marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  subButtonSelected: { borderColor: '#05f51d', backgroundColor: '#f0fff4' },
  subText: { fontSize: 14, color: '#666' },
  subTextSelected: { color: '#19034d', fontWeight: '700' },
  footer: { paddingVertical: 20 },
  nextButton: { backgroundColor: '#05f51d', padding: 18, borderRadius: 14, alignItems: 'center', elevation: 2 },
  nextButtonText: { fontSize: 17, fontWeight: '800', color: '#19034d' }
});