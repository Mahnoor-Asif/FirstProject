import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, TriangleAlert as AlertTriangle, Camera, Send } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';

export default function ReportProblemScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);

  const problemCategories = [
    'App Crashes or Freezes',
    'Payment Issues',
    'Job Request Problems',
    'Chat/Messaging Issues',
    'Profile/Account Issues',
    'Location/Map Problems',
    'Notification Issues',
    'Other Technical Issues'
  ];

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleAddAttachment = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*'],
        copyToCacheDirectory: true,
      });
      
      if (!result.canceled && result.assets[0]) {
        const fileName = result.assets[0].name || `Screenshot ${attachments.length + 1}`;
        setAttachments(prev => [...prev, fileName]);
        Alert.alert('Success', 'Screenshot uploaded successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload screenshot');
    }
  };

  const handleSubmitReport = () => {
    if (!selectedCategory || !description.trim()) {
      Alert.alert('Missing Information', 'Please select a category and describe the problem');
      return;
    }

    Alert.alert(
      'Problem Reported',
      'Your problem report has been submitted successfully.',
      [
        {
          text: 'OK',
          onPress: () => router.push('/report-status')
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#19034d" />
        </TouchableOpacity>
        <Text style={styles.title}>Report a Problem</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.introContainer}>
          <AlertTriangle size={48} color="#F59E0B" />
          <Text style={styles.introTitle}>Report an Issue</Text>
          <Text style={styles.introText}>
            Help us improve ServicePro by reporting any problems you encounter
          </Text>
        </View>

        {/* Problem Category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What type of problem are you experiencing?</Text>
          
          <View style={styles.categoriesContainer}>
            {problemCategories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryItem,
                  selectedCategory === category && styles.selectedCategory,
                ]}
                onPress={() => handleCategorySelect(category)}>
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category && styles.selectedCategoryText,
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Describe the problem</Text>
          <TextInput
            style={styles.descriptionInput}
            value={description}
            onChangeText={setDescription}
            placeholder="Please provide as much detail as possible about the issue you're experiencing..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={6}
          />
        </View>

        {/* Attachments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Screenshots (Optional)</Text>
          
          {attachments.map((attachment, index) => (
            <View key={index} style={styles.attachmentItem}>
              <Camera size={16} color="#05f51d" />
              <Text style={styles.attachmentText}>{attachment}</Text>
              <TouchableOpacity onPress={() => setAttachments(prev => prev.filter((_, i) => i !== index))}>
                <Text style={styles.removeAttachment}>×</Text>
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity style={styles.addAttachmentButton} onPress={handleAddAttachment}>
            <Camera size={20} color="#6B7280" />
            <Text style={styles.addAttachmentText}>Add Screenshot</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tipContainer}>
          <Text style={styles.tipTitle}>💡 Tips for Better Support:</Text>
          <Text style={styles.tipText}>• Be specific about when the problem occurs</Text>
          <Text style={styles.tipText}>• Include screenshots if possible</Text>
          <Text style={styles.tipText}>• Mention what you were trying to do</Text>
          <Text style={styles.tipText}>• Note if the problem happens repeatedly</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            (!selectedCategory || !description.trim()) && styles.disabledButton,
          ]}
          onPress={handleSubmitReport}
          disabled={!selectedCategory || !description.trim()}>
          <Send size={20} color="#FFFFFF" />
          <Text style={[
            styles.submitText,
            (!selectedCategory || !description.trim()) && styles.disabledText,
          ]}>
            Submit Report
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#19034d',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  introContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 30,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  introTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#19034d',
    marginTop: 16,
    marginBottom: 8,
  },
  introText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#19034d',
    marginBottom: 16,
  },
  categoriesContainer: {
    gap: 8,
  },
  categoryItem: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedCategory: {
    backgroundColor: '#F0FDF4',
    borderColor: '#05f51d',
  },
  categoryText: {
    fontSize: 14,
    color: '#4B5563',
  },
  selectedCategoryText: {
    color: '#05f51d',
    fontWeight: '600',
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#19034d',
    backgroundColor: '#FFFFFF',
    textAlignVertical: 'top',
    minHeight: 120,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    gap: 8,
  },
  attachmentText: {
    flex: 1,
    fontSize: 14,
    color: '#059669',
  },
  removeAttachment: {
    fontSize: 18,
    color: '#EF4444',
    fontWeight: 'bold',
  },
  addAttachmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    gap: 8,
  },
  addAttachmentText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  tipContainer: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    marginBottom: 20,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 13,
    color: '#92400E',
    marginBottom: 4,
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#05f51d',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
  submitText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  disabledText: {
    color: '#9CA3AF',
  },
});