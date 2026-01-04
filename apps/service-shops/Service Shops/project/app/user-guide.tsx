import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, BookOpen, ChevronDown, ChevronRight } from 'lucide-react-native';

export default function UserGuideScreen() {
  const router = useRouter();
  const [expandedSections, setExpandedSections] = useState<string[]>(['getting-started']);

  const guideContent = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      content: [
        'Complete your profile with accurate information',
        'Upload required documents for verification',
        'Select your skills and service categories',
        'Go online to start receiving job requests',
        'Share your location to get nearby jobs'
      ]
    },
    {
      id: 'managing-jobs',
      title: 'Managing Job Requests',
      content: [
        'Review job details carefully before accepting',
        'Use counter offers for price negotiations',
        'Communicate with customers through in-app chat',
        'Mark jobs as started when you arrive',
        'Complete jobs and request payment'
      ]
    },
    {
      id: 'communication',
      title: 'Customer Communication',
      content: [
        'Respond to messages promptly',
        'Be professional and courteous',
        'Confirm job details before starting',
        'Update customers on your arrival time',
        'Ask for clarification if needed'
      ]
    },
    {
      id: 'payments',
      title: 'Payments & Earnings',
      content: [
        'Set competitive but fair pricing',
        'Accept cash or digital payments',
        'Track your earnings in Payment Records',
        'Payment is released after job completion',
        'View detailed payment history'
      ]
    },
    {
      id: 'ratings',
      title: 'Building Your Reputation',
      content: [
        'Provide quality service consistently',
        'Be punctual and reliable',
        'Maintain professional appearance',
        'Ask satisfied customers for reviews',
        'Address any negative feedback constructively'
      ]
    },
    {
      id: 'safety',
      title: 'Safety Guidelines',
      content: [
        'Always carry proper safety equipment',
        'Follow electrical and plumbing safety codes',
        'Inform customers of any safety concerns',
        'Use appropriate tools for each job',
        'Report any unsafe working conditions'
      ]
    }
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#19034d" />
        </TouchableOpacity>
        <Text style={styles.title}>User Guide</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.introContainer}>
          <BookOpen size={48} color="#05f51d" />
          <Text style={styles.introTitle}>ServicePro User Guide</Text>
          <Text style={styles.introText}>
            Everything you need to know to succeed as a service provider
          </Text>
        </View>

        {guideContent.map((section) => (
          <View key={section.id} style={styles.sectionContainer}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection(section.id)}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {expandedSections.includes(section.id) ? (
                <ChevronDown size={20} color="#19034d" />
              ) : (
                <ChevronRight size={20} color="#19034d" />
              )}
            </TouchableOpacity>

            {expandedSections.includes(section.id) && (
              <View style={styles.sectionContent}>
                {section.content.map((item, index) => (
                  <View key={index} style={styles.contentItem}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.contentText}>{item}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        <View style={styles.helpContainer}>
          <Text style={styles.helpTitle}>Need More Help?</Text>
          <Text style={styles.helpText}>
            Contact our support team for personalized assistance
          </Text>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => router.push('/HelpSupport')}>
            <Text style={styles.contactText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F9FAFB',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#19034d',
  },
  sectionContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  contentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 8,
  },
  bulletPoint: {
    fontSize: 16,
    color: '#05f51d',
    fontWeight: 'bold',
    marginTop: 2,
  },
  contentText: {
    fontSize: 14,
    color: '#4B5563',
    flex: 1,
    lineHeight: 20,
  },
  helpContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    marginBottom: 30,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#19034d',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  contactButton: {
    backgroundColor: '#05f51d',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  contactText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});