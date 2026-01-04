import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Play, CircleCheck as CheckCircle, Clock, Star } from 'lucide-react-native';

export default function TrainingVideoScreen() {
  const router = useRouter();
  const [completedVideos, setCompletedVideos] = useState<string[]>(['1']);

  const trainingVideos = [
    {
      id: '1',
      title: 'Getting Started with ServicePro',
      description: 'Learn the basics of using the app and setting up your profile',
      duration: '5:30',
      thumbnail: 'intro',
      completed: true,
    },
    {
      id: '2',
      title: 'Managing Job Requests',
      description: 'How to accept, reject, and counter job offers effectively',
      duration: '7:45',
      thumbnail: 'jobs',
      completed: false,
    },
    {
      id: '3',
      title: 'Communication Best Practices',
      description: 'Tips for professional communication with service seekers',
      duration: '4:20',
      thumbnail: 'communication',
      completed: false,
    },
    {
      id: '4',
      title: 'Building Your Reputation',
      description: 'Strategies to improve ratings and get more job requests',
      duration: '6:15',
      thumbnail: 'reputation',
      completed: false,
    },
    {
      id: '5',
      title: 'Safety Guidelines',
      description: 'Important safety tips for service providers',
      duration: '8:10',
      thumbnail: 'safety',
      completed: false,
    },
  ];

  const handleWatchVideo = (videoId: string, title: string) => {
    Alert.alert(
      'Watch Video',
      `Playing: ${title}`,
      [
        {
          text: 'Mark as Completed',
          onPress: () => {
            setCompletedVideos(prev => [...prev, videoId]);
            const newCompletedVideos = [...completedVideos, videoId];
            if (newCompletedVideos.length === trainingVideos.length) {
              Alert.alert(
                'Training Complete!', 
                'Congratulations! You have completed all training videos. You can now start earning.',
                [
                  {
                    text: 'Go to Dashboard',
                    onPress: () => router.replace('/dashboard')
                  }
                ]
              );
            } else {
              Alert.alert('Video Completed', 'Great! You completed the training video.');
            }
          }
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const completionPercentage = Math.round((completedVideos.length / trainingVideos.length) * 100);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
  <TouchableOpacity onPress={() => router.back()}>
    <ArrowLeft size={24} color="#FFFFFF" />  
  </TouchableOpacity>
  <Text style={styles.title}>Training Videos</Text>
  <View style={{ width: 24 }} />
</View>


      {/* Progress Overview */}
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Training Progress</Text>
          <Text style={styles.progressPercentage}>{completionPercentage}%</Text>
        </View>
        
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${completionPercentage}%` }]} />
        </View>
        
        <Text style={styles.progressText}>
          {completedVideos.length} of {trainingVideos.length} videos completed
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Training Modules</Text>
        
        {trainingVideos.map((video) => (
          <TouchableOpacity
            key={video.id}
            style={[
              styles.videoCard,
              completedVideos.includes(video.id) && styles.completedCard
            ]}
            onPress={() => handleWatchVideo(video.id, video.title)}>
            
            <View style={styles.videoThumbnail}>
              {completedVideos.includes(video.id) ? (
                <CheckCircle size={32} color="#05f51d" />
              ) : (
                <Play size={32} color="#FFFFFF" />
              )}
            </View>
            
            <View style={styles.videoInfo}>
              <Text style={styles.videoTitle}>{video.title}</Text>
              <Text style={styles.videoDescription}>{video.description}</Text>
              
              <View style={styles.videoMeta}>
                <View style={styles.durationContainer}>
                  <Clock size={14} color="#6B7280" />
                  <Text style={styles.videoDuration}>{video.duration}</Text>
                </View>
                
                {completedVideos.includes(video.id) && (
                  <View style={styles.completedBadge}>
                    <CheckCircle size={14} color="#05f51d" />
                    <Text style={styles.completedText}>Completed</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>Pro Tips</Text>
          
          <View style={styles.tipCard}>
            <Star size={20} color="#FFD700" />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Maintain High Ratings</Text>
              <Text style={styles.tipText}>
                Always arrive on time, communicate clearly, and provide quality service to maintain a 4.5+ rating.
              </Text>
            </View>
          </View>
          
          <View style={styles.tipCard}>
            <Play size={20} color="#05f51d" />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Complete All Training</Text>
              <Text style={styles.tipText}>
                Providers who complete all training videos receive 20% more job requests.
              </Text>
            </View>
          </View>
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
   
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingTop: 45, 
  backgroundColor: '#19034d',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  progressContainer: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#19034d',
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#05f51d',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#05f51d',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#19034d',
    marginBottom: 15,
  },
  videoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 15,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  completedCard: {
    borderColor: '#05f51d',
    backgroundColor: '#F0FDF4',
  },
  videoThumbnail: {
    width: 80,
    height: 80,
    backgroundColor: '#19034d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoInfo: {
    flex: 1,
    padding: 16,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#19034d',
    marginBottom: 6,
  },
  videoDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  videoMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  videoDuration: {
    fontSize: 12,
    color: '#6B7280',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  completedText: {
    fontSize: 12,
    color: '#05f51d',
    fontWeight: '600',
  },
  tipsSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  tipCard: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
    gap: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#19034d',
    marginBottom: 6,
  },
  tipText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});