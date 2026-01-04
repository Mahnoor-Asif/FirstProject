import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, FileText } from 'lucide-react-native';

export default function TermsConditionsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#19034d" />
        </TouchableOpacity>
        <Text style={styles.title}>Terms & Conditions</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.iconContainer}>
          <FileText size={48} color="#05f51d" />
          <Text style={styles.lastUpdated}>Last updated: January 2024</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.sectionText}>
            By accessing and using ServicePro, you accept and agree to be bound by the terms 
            and provision of this agreement. If you do not agree to abide by the above, 
            please do not use this service.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Service Provider Responsibilities</Text>
          <Text style={styles.sectionText}>
            As a service provider, you agree to:
            {'\n'}• Provide accurate information about your skills and experience
            {'\n'}• Complete jobs professionally and on time
            {'\n'}• Maintain appropriate licenses and certifications
            {'\n'}• Communicate respectfully with customers
            {'\n'}• Follow safety guidelines and local regulations
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Payment Terms</Text>
          <Text style={styles.sectionText}>
            ServicePro facilitates payments between customers and service providers. 
            Payment processing fees may apply. Providers are responsible for their own 
            tax obligations and must comply with local tax laws.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Account Termination</Text>
          <Text style={styles.sectionText}>
            We reserve the right to terminate or suspend accounts that violate these terms, 
            engage in fraudulent activity, or receive consistently poor ratings. 
            You may also terminate your account at any time.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Limitation of Liability</Text>
          <Text style={styles.sectionText}>
            ServicePro acts as a platform connecting service providers with customers. 
            We are not responsible for the quality of services provided or any disputes 
            that may arise between parties.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Changes to Terms</Text>
          <Text style={styles.sectionText}>
            We reserve the right to modify these terms at any time. Users will be notified 
            of significant changes via email or app notification. Continued use of the service 
            constitutes acceptance of modified terms.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Contact Information</Text>
          <Text style={styles.sectionText}>
            For questions about these Terms & Conditions, contact us at:
            {'\n\n'}Email: legal@servicepro.com
            {'\n'}Phone: +92 300 1234567
            {'\n'}Address: Lahore, Pakistan
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
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
  iconContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#19034d',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
  },
});