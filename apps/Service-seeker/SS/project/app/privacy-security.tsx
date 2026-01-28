import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { ArrowLeft, FileText, Shield } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function HelpSupportScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>('terms');

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy & Security</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'terms' && styles.activeTab]}
          onPress={() => setActiveTab('terms')}
        >
          <Text style={[styles.tabText, activeTab === 'terms' && styles.activeTabText]}>
            Terms & Conditions
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'privacy' && styles.activeTab]}
          onPress={() => setActiveTab('privacy')}
        >
          <Text style={[styles.tabText, activeTab === 'privacy' && styles.activeTabText]}>
            Privacy Policy
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'terms' ? (
          <>
            <View style={styles.iconContainer}>
              <FileText size={48} color="#05f51d" />
              <Text style={styles.lastUpdated}>Last updated: January 2024</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
              <Text style={styles.sectionText}>
                By accessing and using ServicePro, you accept and agree to be bound by these
                terms. If you do not agree, please do not use this service.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>2. Service Shops Responsibilities</Text>
              <Text style={styles.sectionText}>
                • Provide accurate information about your skills{'\n'}• Complete jobs
                professionally and on time{'\n'}• Maintain valid licenses and certifications{'\n'}
                • Communicate respectfully with customers{'\n'}• Follow safety guidelines and local laws
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>3. Payment Terms</Text>
              <Text style={styles.sectionText}>
                ServicePro facilitates payments between customers and service Shopss. Payment
                processing fees may apply. Shopss are responsible for their tax obligations.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>4. Account Termination</Text>
              <Text style={styles.sectionText}>
                We may suspend or terminate accounts that violate terms, engage in fraud, or
                receive poor ratings. You may close your account anytime.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>5. Contact</Text>
              <Text style={styles.sectionText}>
                Email: legal@servicepro.com{'\n'}Phone: +92 300 1234567{'\n'}Address: Lahore, Pakistan
              </Text>
            </View>
          </>
        ) : (
          <>
            <View style={styles.iconContainer}>
              <Shield size={48} color="#05f51d" />
              <Text style={styles.lastUpdated}>Last updated: January 2024</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>1. Information We Collect</Text>
              <Text style={styles.sectionText}>
                We collect details such as your name, email, phone, and preferences when you
                create an account or contact support.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>2. How We Use It</Text>
              <Text style={styles.sectionText}>
                To provide and improve our services, process transactions, and communicate with
                you about updates or promotions.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>3. Data Security</Text>
              <Text style={styles.sectionText}>
                We use strong encryption and security measures to protect your data, though no
                system is completely immune from breaches.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>4. Your Rights</Text>
              <Text style={styles.sectionText}>
                You may request to access, modify, or delete your personal data by contacting
                us at support@servicepro.com.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>5. Contact Us</Text>
              <Text style={styles.sectionText}>
                Email: support@servicepro.com{'\n'}Phone: +92 300 1234567{'\n'}Address: Lahore, Pakistan
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },

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

  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 10,
  },
  tabButton: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 10 },
  tabText: { color: '#555', fontSize: 15, fontWeight: '500' },
  activeTab: { backgroundColor: '#05f51d' },
  activeTabText: { color: '#19034d', fontWeight: '700' },

  content: { paddingHorizontal: 20, paddingBottom: 30 },
  iconContainer: { alignItems: 'center', marginBottom: 30 },
  lastUpdated: { fontSize: 13, color: '#6B7280', marginTop: 10 },

  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#19034d', marginBottom: 8 },
  sectionText: { fontSize: 14, color: '#444', lineHeight: 22 },
});
