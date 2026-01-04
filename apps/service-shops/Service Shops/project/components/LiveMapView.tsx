import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MapPin, Navigation, Eye } from 'lucide-react-native';

interface LiveMapViewProps {
  isLocationShared: boolean;
  nearbyJobs: Array<{
    id: string;
    category: string;
    location: string;
    distance: string;
    price: number;
    urgent: boolean;
  }>;
  onJobView: (jobId: string) => void;
}

export function LiveMapView({ isLocationShared, nearbyJobs, onJobView }: LiveMapViewProps) {
  if (!isLocationShared) {
    return (
      <View style={styles.container}>
        <View style={styles.mapPlaceholder}>
          <MapPin size={48} color="#D1D5DB" />
          <Text style={styles.placeholderTitle}>Location Required</Text>
          <Text style={styles.placeholderSubtitle}>
            Share your location to see nearby job requests
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapView}>
        <Navigation size={24} color="#05f51d" />
        <Text style={styles.mapTitle}>Live Map View</Text>
        <Text style={styles.mapSubtitle}>Your location is being shared</Text>
        
        <View style={styles.locationPin}>
          <MapPin size={20} color="#FFFFFF" />
        </View>
      </View>

      <View style={styles.jobsHeader}>
        <Text style={styles.jobsTitle}>Nearby Job Requests</Text>
        <Text style={styles.jobsCount}>{nearbyJobs.length} available</Text>
      </View>

      <ScrollView style={styles.jobsList} showsVerticalScrollIndicator={false}>
        {nearbyJobs.map((job) => (
          <TouchableOpacity
            key={job.id}
            style={[styles.jobItem, job.urgent && styles.urgentJob]}
            onPress={() => onJobView(job.id)}>
            <View style={styles.jobContent}>
              <View style={styles.jobInfo}>
                <Text style={styles.jobCategory}>{job.category}</Text>
                <Text style={styles.jobLocation}>📍 {job.location}</Text>
                <Text style={styles.jobDistance}>🚶 {job.distance}</Text>
              </View>
              
              <View style={styles.jobMeta}>
                <Text style={styles.jobPrice}>PKR {job.price.toLocaleString()}</Text>
                {job.urgent && (
                  <View style={styles.urgentBadge}>
                    <Text style={styles.urgentText}>URGENT</Text>
                  </View>
                )}
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.viewButton}
              onPress={() => onJobView(job.id)}>
              <Eye size={16} color="#05f51d" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  mapPlaceholder: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  placeholderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
    marginTop: 12,
  },
  placeholderSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 4,
  },
  mapView: {
    height: 200,
    backgroundColor: '#E5F5E5',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mapTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#19034d',
    marginTop: 8,
  },
  mapSubtitle: {
    fontSize: 12,
    color: '#059669',
    marginTop: 4,
  },
  locationPin: {
    position: 'absolute',
    top: 80,
    backgroundColor: '#05f51d',
    borderRadius: 20,
    padding: 8,
  },
  jobsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  jobsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#19034d',
  },
  jobsCount: {
    fontSize: 12,
    color: '#6B7280',
  },
  jobsList: {
    maxHeight: 250,
  },
  jobItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  urgentJob: {
    backgroundColor: '#FEF2F2',
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  jobContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jobInfo: {
    flex: 1,
  },
  jobCategory: {
    fontSize: 14,
    fontWeight: '600',
    color: '#19034d',
    marginBottom: 2,
  },
  jobLocation: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 1,
  },
  jobDistance: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  jobMeta: {
    alignItems: 'flex-end',
  },
  jobPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#05f51d',
    marginBottom: 4,
  },
  urgentBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  urgentText: {
    fontSize: 9,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  viewButton: {
    marginLeft: 12,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F0FDF4',
  },
});