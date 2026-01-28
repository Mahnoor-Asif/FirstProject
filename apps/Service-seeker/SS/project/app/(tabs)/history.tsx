import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { CircleCheck as CheckCircle, Circle as XCircle, Clock, Star, Calendar, ArrowRight } from 'lucide-react-native';
import { getJobHistory } from '../../utils/historyStorage';

export default function HistoryScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'completed' | 'cancelled'>('all');
  const [historyJobs, setHistoryJobs] = useState<any[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      let jobs = getJobHistory();

      // Add 3 cancelled example jobs for display
      jobs = [
  ...jobs,
  { id: 101, service: 'Plumbing', subcategory: 'Pipe Fix', provider: 'Ali', status: 'cancelled', amount: 500, date: '2025-10-10', rating: 4, cancelReason: 'Customer changed schedule' },
  { id: 102, service: 'Electrician', subcategory: 'Wiring', provider: 'Sara', status: 'cancelled', amount: 600, date: '2025-10-11', rating: 5, cancelReason: 'Provider was unavailable' },
  { id: 103, service: 'Cleaning', subcategory: 'House', provider: 'Ahmed', status: 'cancelled', amount: 400, date: '2025-10-12', rating: 4, cancelReason: 'Emergency at customer side' },
];


      setHistoryJobs(jobs);
    }, [])
  );

  const filteredJobs = historyJobs.filter(job => {
    if (filter === 'all') return true;
    return job.status === filter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={20} color="#05f51d" />;
      case 'cancelled':
        return <XCircle size={20} color="#dc2626" />;
      default:
        return <Clock size={20} color="#f59e0b" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#05f51d';
      case 'cancelled': return '#dc2626';
      default: return '#f59e0b';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={12}
        color={index < rating ? '#f59e0b' : '#e5e5e5'}
        fill={index < rating ? '#f59e0b' : 'transparent'}
      />
    ));
  };

  const handleRebook = (job: any) => {
    Alert.alert(
      'Rebook Service',
      `Rebook ${job.service} with ${job.provider}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Rebook', 
          onPress: () => {
            setTimeout(() => {
              Alert.alert(
                'Booking Confirmed',
                `${job.provider} has accepted your booking request!`,
                [
                  { 
                    text: 'Track Job', 
                    onPress: () => {
                      const mockProvider = {
                        id: 1,
                        name: job.provider,
                        photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
                        rating: 4.8,
                        reviews: 127,
                      };
                      
                      router.push({
                        pathname: '/job-tracking',
                        params: {
                          provider: JSON.stringify(mockProvider),
                          categories: JSON.stringify([{ name: job.service }]),
                          subcategories: JSON.stringify([{ name: job.subcategory }]),
                          bookingType: 'now',
                          amount: job.amount.toString(),
                          description: 'Rebooked service',
                        }
                      });
                    }
                  }
                ]
              );
            }, 2000);
            
            Alert.alert('Request Sent', 'Rebook request sent to provider. Please wait for confirmation...');
          }
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Subtitle */}
      <View style={styles.filterContainer}>
       <Text style={[styles.headerSubtitle, { marginTop: 20 }]}>
  All your past service requests
</Text>


        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'all' && styles.activeFilterTab]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>All</Text>
            <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>
              ({historyJobs.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'completed' && styles.activeFilterTab]}
            onPress={() => setFilter('completed')}
          >
            <Text style={[styles.filterText, filter === 'completed' && styles.activeFilterText]}>Completed</Text>
            <Text style={[styles.filterText, filter === 'completed' && styles.activeFilterText]}>
              ({historyJobs.filter(j => j.status === 'completed').length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'cancelled' && styles.activeFilterTab]}
            onPress={() => setFilter('cancelled')}
          >
            <Text style={[styles.filterText, filter === 'cancelled' && styles.activeFilterText]}>Cancelled</Text>
            <Text style={[styles.filterText, filter === 'cancelled' && styles.activeFilterText]}>
              ({historyJobs.filter(j => j.status === 'cancelled').length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Job List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredJobs.map((job) => (
          <TouchableOpacity key={job.id} style={styles.jobCard}>
            <View style={styles.jobHeader}>
              <View style={styles.jobTitleSection}>
                <Text style={styles.jobService}>{job.service}</Text>
                <Text style={styles.jobSubcategory}>{job.subcategory}</Text>
              </View>
              <View style={styles.statusSection}>
                {getStatusIcon(job.status)}
                <Text style={[styles.statusText, { color: getStatusColor(job.status) }]}>
                  {job.status.replace('_', ' ')}
                </Text>
              </View>
            </View>

            <View style={styles.jobDetails}>
              <View style={styles.detailRow}>
                <Calendar size={16} color="#666" />
                <Text style={styles.detailText}>{job.date}</Text>
              </View>
              <View style={styles.detailRow}>
                <View style={styles.providerInfo}>
                  <Text style={styles.providerName}>{job.provider}</Text>
                  {job.rating && (
                    <View style={styles.ratingContainer}>
                      {renderStars(job.rating)}
                      <Text style={styles.ratingText}>({job.rating})</Text>
                    </View>
                  )}
                </View>
              </View>
              {job.review && (
                <Text style={styles.reviewText}>"{job.review}"</Text>
              )}

              
            </View>

            <View style={styles.jobFooter}>
             <Text>
  <Text style={{ color: 'black' }}>Visit Charges:{'\n'}</Text>
  <Text style={styles.amount}>PKR {job.amount}</Text>
</Text>

              {job.status === 'completed' && (
                <TouchableOpacity 
                  style={styles.rebookButton}
                  onPress={() => handleRebook(job)}
                >
                  <Text style={styles.rebookButtonText}>Rebook</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        ))}

        {filteredJobs.length === 0 && (
          <View style={styles.emptyState}>
            <Clock size={48} color="#ccc" />
            <Text style={styles.emptyStateTitle}>No {filter} jobs</Text>
            <Text style={styles.emptyStateText}>
              Your {filter === 'all' ? '' : filter + ' '}service history will appear here
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  filterContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  filterTabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingHorizontal: 2,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  activeFilterTab: {
    backgroundColor: '#05f51d',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
  },
  activeFilterText: {
    color: '#19034d',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  jobCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  jobTitleSection: {
    flex: 1,
  },
  jobService: {
    fontSize: 18,
    fontWeight: '600',
    color: '#19034d',
    marginBottom: 4,
  },
  jobSubcategory: {
    fontSize: 14,
    color: '#666',
  },
  statusSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  jobDetails: {
    gap: 12,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#333',
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  providerName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
  },
  reviewText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#05f51d',
  },
  rebookButton: {
    backgroundColor: '#05f51d',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  rebookButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#19034d',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#19034d',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
