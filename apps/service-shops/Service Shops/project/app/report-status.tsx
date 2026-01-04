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
import { ArrowLeft, Clock, CircleCheck as CheckCircle, MessageSquare, RefreshCw } from 'lucide-react-native';

export default function ReportStatusScreen() {
  const router = useRouter();
  const [reportStatus] = useState({
    id: 'RPT-001',
    category: 'App Crashes or Freezes',
    description: 'App crashes when trying to upload photos during job completion',
    status: 'in_progress',
    submittedDate: '2024-01-15',
    lastUpdated: '2024-01-16',
    priority: 'high',
    assignedTo: 'Technical Support Team',
    estimatedResolution: '2-3 business days',
  });

  const statusHistory = [
    {
      id: '1',
      status: 'submitted',
      message: 'Report submitted successfully',
      timestamp: '2024-01-15 10:30 AM',
      completed: true,
    },
    {
      id: '2',
      status: 'acknowledged',
      message: 'Report acknowledged by support team',
      timestamp: '2024-01-15 11:45 AM',
      completed: true,
    },
    {
      id: '3',
      status: 'in_progress',
      message: 'Technical team is investigating the issue',
      timestamp: '2024-01-16 09:15 AM',
      completed: true,
    },
    {
      id: '4',
      status: 'testing',
      message: 'Fix implemented, currently testing',
      timestamp: 'Pending',
      completed: false,
    },
    {
      id: '5',
      status: 'resolved',
      message: 'Issue resolved and deployed',
      timestamp: 'Pending',
      completed: false,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return '#06B6D4';
      case 'in_progress':
        return '#F59E0B';
      case 'resolved':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'Submitted';
      case 'acknowledged':
        return 'Acknowledged';
      case 'in_progress':
        return 'In Progress';
      case 'testing':
        return 'Testing';
      case 'resolved':
        return 'Resolved';
      default:
        return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#19034d" />
        </TouchableOpacity>
        <Text style={styles.title}>Report Status</Text>
        <TouchableOpacity>
          <RefreshCw size={24} color="#19034d" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Report Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.reportId}>Report #{reportStatus.id}</Text>
            <View style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(reportStatus.status) }
            ]}>
              <Text style={styles.statusText}>{getStatusText(reportStatus.status)}</Text>
            </View>
          </View>

          <Text style={styles.reportCategory}>{reportStatus.category}</Text>
          <Text style={styles.reportDescription}>{reportStatus.description}</Text>

          <View style={styles.reportMeta}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Priority:</Text>
              <Text style={[
                styles.metaValue,
                { color: getPriorityColor(reportStatus.priority) }
              ]}>
                {reportStatus.priority.toUpperCase()}
              </Text>
            </View>
            
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Assigned to:</Text>
              <Text style={styles.metaValue}>{reportStatus.assignedTo}</Text>
            </View>
            
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Est. Resolution:</Text>
              <Text style={styles.metaValue}>{reportStatus.estimatedResolution}</Text>
            </View>
          </View>
        </View>

        {/* Status Timeline */}
        <View style={styles.timelineCard}>
          <Text style={styles.timelineTitle}>Status Timeline</Text>
          
          {statusHistory.map((item, index) => (
            <View key={item.id} style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View style={[
                  styles.timelineDot,
                  item.completed && styles.completedDot,
                  !item.completed && styles.pendingDot,
                ]}>
                  {item.completed && <CheckCircle size={16} color="#FFFFFF" />}
                  {!item.completed && <Clock size={16} color="#9CA3AF" />}
                </View>
                {index < statusHistory.length - 1 && (
                  <View style={[
                    styles.timelineLine,
                    item.completed && styles.completedLine,
                  ]} />
                )}
              </View>
              
              <View style={styles.timelineContent}>
                <Text style={[
                  styles.timelineStatus,
                  item.completed && styles.completedStatus,
                ]}>
                  {getStatusText(item.status)}
                </Text>
                <Text style={styles.timelineMessage}>{item.message}</Text>
                <Text style={styles.timelineTimestamp}>{item.timestamp}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Additional Information */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Additional Information</Text>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Submitted:</Text>
            <Text style={styles.infoValue}>{reportStatus.submittedDate}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Last Updated:</Text>
            <Text style={styles.infoValue}>{reportStatus.lastUpdated}</Text>
          </View>
          
          <Text style={styles.infoNote}>
            You will receive email notifications for any status updates. If you have additional information or questions, please contact our support team.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => router.push('/HelpSupport')}>
            <MessageSquare size={20} color="#FFFFFF" />
            <Text style={styles.contactButtonText}>Contact Support</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.newReportButton}
            onPress={() => router.push('/report-problem')}>
            <Text style={styles.newReportButtonText}>Submit New Report</Text>
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
  summaryCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reportId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#19034d',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  reportCategory: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#19034d',
    marginBottom: 8,
  },
  reportDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 16,
  },
  reportMeta: {
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 14,
    color: '#6B7280',
    width: 100,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#19034d',
    flex: 1,
  },
  timelineCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#19034d',
    marginBottom: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedDot: {
    backgroundColor: '#10B981',
  },
  pendingDot: {
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#D1D5DB',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E5E7EB',
    marginTop: 8,
  },
  completedLine: {
    backgroundColor: '#10B981',
  },
  timelineContent: {
    flex: 1,
  },
  timelineStatus: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  completedStatus: {
    color: '#10B981',
  },
  timelineMessage: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 4,
  },
  timelineTimestamp: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#19034d',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    width: 100,
  },
  infoValue: {
    fontSize: 14,
    color: '#19034d',
    fontWeight: '500',
  },
  infoNote: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  actionsContainer: {
    gap: 12,
    marginBottom: 30,
  },
  contactButton: {
    flexDirection: 'row',
    backgroundColor: '#19034d',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  newReportButton: {
    backgroundColor: '#F9FAFB',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  newReportButtonText: {
    color: '#19034d',
    fontSize: 16,
    fontWeight: '600',
  },
});