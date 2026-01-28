import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { CircleCheck as CheckCircle, Play, ArrowRight } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [trainingCompleted, setTrainingCompleted] = useState(false);
  const progressWidth = useSharedValue(33.33);

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const steps = [
    {
      title: 'Registration Complete',
      description: 'Your account has been successfully created',
      completed: true,
    },
    {
      title: 'Training Video',
      description: 'Watch this quick tutorial to get started',
      completed: trainingCompleted,
    },
    {
      title: 'Get Started',
      description: 'You\'re all set to start using ServiceHub',
      completed: false,
    },
  ];

  const handleNext = () => {
    if (currentStep === 1 && !trainingCompleted) {
      // Simulate watching video
      setTrainingCompleted(true);
      progressWidth.value = withTiming(66.66);
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      progressWidth.value = withTiming(100);
    } else {
      router.replace('/(tabs)/');
    }
  };

  const handleWatchVideo = () => {
    // Simulate video completion
    setTimeout(() => {
      setTrainingCompleted(true);
      progressWidth.value = withTiming(66.66);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Getting Started</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View style={[styles.progressFill, animatedProgressStyle]} />
          </View>
          <Text style={styles.progressText}>Step {currentStep + 1} of {steps.length}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.stepContainer}>
          <View style={[
            styles.stepIcon,
            steps[currentStep].completed && styles.stepIconCompleted
          ]}>
            {steps[currentStep].completed ? (
              <CheckCircle size={32} color="#05f51d" />
            ) : (
              <Text style={styles.stepNumber}>{currentStep + 1}</Text>
            )}
          </View>
          
          <Text style={styles.stepTitle}>{steps[currentStep].title}</Text>
          <Text style={styles.stepDescription}>{steps[currentStep].description}</Text>

          {currentStep === 1 && !trainingCompleted && (
            <TouchableOpacity style={styles.videoButton} onPress={handleWatchVideo}>
              <Play size={20} color="#19034d" />
              <Text style={styles.videoButtonText}>Watch Training Video</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <TouchableOpacity 
        style={[
          styles.nextButton,
          currentStep === 1 && !trainingCompleted && styles.disabledButton
        ]} 
        onPress={handleNext}
        disabled={currentStep === 1 && !trainingCompleted}
      >
        <Text style={[
          styles.nextButtonText,
          currentStep === 1 && !trainingCompleted && styles.disabledButtonText
        ]}>
          {currentStep === steps.length - 1 ? 'Get Started' : 'Continue'}
        </Text>
        <ArrowRight size={20} color={currentStep === 1 && !trainingCompleted ? '#999' : '#19034d'} />
      </TouchableOpacity>
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
  header: {
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#19034d',
    marginBottom: 24,
    textAlign: 'center',
  },
  progressContainer: {
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    width: width - 48,
    height: 4,
    backgroundColor: '#e5e5e5',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#05f51d',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  stepContainer: {
    alignItems: 'center',
  },
  stepIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#e5e5e5',
  },
  stepIconCompleted: {
    backgroundColor: '#f0fff1',
    borderColor: '#05f51d',
  },
  stepNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#19034d',
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#19034d',
    marginBottom: 12,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  videoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#05f51d',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  videoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#19034d',
  },
  nextButton: {
    flexDirection: 'row',
    backgroundColor: '#05f51d',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#19034d',
  },
  disabledButtonText: {
    color: '#999',
  },
});