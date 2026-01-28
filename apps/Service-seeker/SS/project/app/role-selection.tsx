import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { UserCheck, Briefcase, Store } from 'lucide-react-native';

export default function RoleSelectionScreen() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState(null);

  // Button animation
  const buttonScale = useSharedValue(1);

  // Card scale animations
  const seekerScale = useSharedValue(1);
  const providerScale = useSharedValue(1);
  const shopScale = useSharedValue(1);

  // Animated styles
  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const seekerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: seekerScale.value }],
  }));
  const providerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: providerScale.value }],
  }));
  const shopAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: shopScale.value }],
  }));

  // Card press animations
  const handleCardPress = (role) => {
    setSelectedRole(role);
    const anim = (value) => withSequence(withSpring(1.05), withSpring(1));
    if (role === 'seeker') seekerScale.value = anim();
    else if (role === 'provider') providerScale.value = anim();
    else shopScale.value = anim();
  };

  const handleNext = () => {
    if (selectedRole) {
      buttonScale.value = withSequence(
        withTiming(0.95, { duration: 100 }),
        withTiming(1, { duration: 100 })
      );
      router.push('/login');
    }
  };

  return (
    <View style={styles.container}>
      {/* Round Logo */}
      <View style={styles.logoWrapper}>
        <Image
          source={require('../assets/images/icon.jpg')}
          style={styles.logoImage}
          resizeMode="cover"
        />
      </View>

      <Text style={styles.subtitle}>Select how you want to use Nexora Services</Text>

      {/* Role Cards */}
      <View style={styles.roleOptions}>
        <Pressable onPress={() => handleCardPress('seeker')}>
          <Animated.View
            style={[
              styles.roleCard,
              selectedRole === 'seeker' && styles.selectedCard,
              seekerAnimatedStyle,
            ]}
          >
            <UserCheck size={48} color={selectedRole === 'seeker' ? '#05f51d' : '#19034d'} />
            <Text style={[styles.roleTitle, selectedRole === 'seeker' && styles.selectedText]}>
              Service Seeker
            </Text>
            <Text style={styles.roleDescription}>
              Find and book services for your needs
            </Text>
          </Animated.View>
        </Pressable>

        <Pressable onPress={() => handleCardPress('provider')}>
          <Animated.View
            style={[
              styles.roleCard,
              selectedRole === 'provider' && styles.selectedCard,
              providerAnimatedStyle,
            ]}
          >
            <Briefcase size={48} color={selectedRole === 'provider' ? '#05f51d' : '#19034d'} />
            <Text style={[styles.roleTitle, selectedRole === 'provider' && styles.selectedText]}>
              Service Provider
            </Text>
            <Text style={styles.roleDescription}>
              Offer your services and earn money
            </Text>
          </Animated.View>
        </Pressable>

        <Pressable onPress={() => handleCardPress('shop')}>
          <Animated.View
            style={[
              styles.roleCard,
              selectedRole === 'shop' && styles.selectedCard,
              shopAnimatedStyle,
            ]}
          >
            <Store size={48} color={selectedRole === 'shop' ? '#05f51d' : '#19034d'} />
            <Text style={[styles.roleTitle, selectedRole === 'shop' && styles.selectedText]}>
              Service Shop
            </Text>
            <Text style={styles.roleDescription}>
              Manage your shop and attract more customers
            </Text>
          </Animated.View>
        </Pressable>
      </View>

      {/* Continue Button */}
      <Animated.View style={[styles.bottomButtonContainer, buttonAnimatedStyle]}>
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
    backgroundColor: '#f2f5fa',
    paddingHorizontal: 24,
    paddingTop: 60,
    alignItems: 'center',
  },
  logoWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#05f51d',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#05f51d',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 10,
  },
  logoImage: { width: 80, height: 80, borderRadius: 40 },
  subtitle: { fontSize: 15, color: '#7c7d80', textAlign: 'center', marginBottom: 24 },
  roleOptions: { width: '100%', flex: 1, justifyContent: 'flex-start', gap: 16 },
  roleCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  selectedCard: { borderColor: '#05f51d', backgroundColor: '#f0fff1' },
  roleTitle: { fontSize: 18, fontWeight: '600', color: '#19034d', marginTop: 14, marginBottom: 6 },
  selectedText: { color: '#05f51d' },
  roleDescription: { fontSize: 13, color: '#666', textAlign: 'center' },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
  },
  nextButton: {
    backgroundColor: '#05f51d',
    paddingVertical: 14,
    paddingHorizontal: 60, // <-- smaller width
    borderRadius: 30,
    alignItems: 'center',
  },
  disabledButton: { backgroundColor: '#ccc' },
  nextButtonText: { fontSize: 16, fontWeight: '600', color: '#19034d' },
  disabledButtonText: { color: '#999' },
});