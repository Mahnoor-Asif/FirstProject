import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { UserCheck, Briefcase, Store } from 'lucide-react-native';

export default function RoleSelectionScreen() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'seeker' | 'provider' | 'shop' | null>(null);
  const scale = useSharedValue(1);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleNext = () => {
    if (selectedRole) {
      scale.value = withTiming(0.95, { duration: 100 }, () => {
        scale.value = withTiming(1, { duration: 100 });
      });
      router.push('/login');
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require('../assets/images/icon.jpg')} // ✅ adjust path if needed
        style={styles.logoImage}
        resizeMode="contain"
      />

      {/* Title */}
      {/* <Text style={styles.title}>Choose Your Role</Text> */}
      <Text style={styles.subtitle}>Select how you want to use Nexora Services</Text>

      {/* Role Options */}
      <View style={styles.roleOptions}>
        {/* Service Seeker */}
        <Pressable
          style={[styles.roleCard, selectedRole === 'seeker' && styles.selectedCard]}
          onPress={() => setSelectedRole('seeker')}
        >
          <UserCheck size={48} color={selectedRole === 'seeker' ? '#05f51d' : '#19034d'} />
          <Text style={[styles.roleTitle, selectedRole === 'seeker' && styles.selectedText]}>
            Service Seeker
          </Text>
          <Text style={styles.roleDescription}>
            Find and book services for your needs
          </Text>
        </Pressable>

        {/* Service Provider */}
        <Pressable
          style={[styles.roleCard, selectedRole === 'provider' && styles.selectedCard]}
          onPress={() => setSelectedRole('provider')}
        >
          <Briefcase size={48} color={selectedRole === 'provider' ? '#05f51d' : '#19034d'} />
          <Text style={[styles.roleTitle, selectedRole === 'provider' && styles.selectedText]}>
            Service Provider
          </Text>
          <Text style={styles.roleDescription}>
            Offer your services and earn money
          </Text>
        </Pressable>

        {/* Service Shop */}
        <Pressable
          style={[styles.roleCard, selectedRole === 'shop' && styles.selectedCard]}
          onPress={() => setSelectedRole('shop')}
        >
          <Store size={48} color={selectedRole === 'shop' ? '#05f51d' : '#19034d'} />
          <Text style={[styles.roleTitle, selectedRole === 'shop' && styles.selectedText]}>
            Service Shop
          </Text>
          <Text style={styles.roleDescription}>
            Manage your shop and attract more customers
          </Text>
        </Pressable>
      </View>

      {/* Continue Button fixed at bottom */}
      <Animated.View style={[styles.bottomButtonContainer, animatedButtonStyle]}>
        <TouchableOpacity
          style={[styles.nextButton, !selectedRole && styles.disabledButton]}
          onPress={handleNext}
          disabled={!selectedRole}
        >
          <Text style={[styles.nextButtonText, !selectedRole && styles.disabledButtonText]}>
            Continue
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 60,
    alignItems: 'center',
  },
  logoImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#19034d',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  roleOptions: {
    width: '100%',
    flex: 1,
    justifyContent: 'flex-start',
    gap: 14,
    marginBottom: 20,
  },
  roleCard: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    backgroundColor: '#f0fff1',
    borderColor: '#05f51d',
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#19034d',
    marginTop: 14,
    marginBottom: 6,
  },
  selectedText: {
    color: '#05f51d',
  },
  roleDescription: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
  bottomButtonContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 1,
    left: 24,
    right: 24,
  },
  nextButton: {
    backgroundColor: '#05f51d',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    // marginTop: '100%',
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
