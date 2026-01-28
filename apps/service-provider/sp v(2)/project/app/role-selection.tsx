import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { UserCheck, Briefcase, Store } from 'lucide-react-native';

export default function RoleSelectionScreen() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState(null);
  const [buttonsDisabled, setButtonsDisabled] = useState(false); // disable other buttons after selection

  // Card scale animations
  const seekerScale = useSharedValue(1);
  const providerScale = useSharedValue(1);
  const shopScale = useSharedValue(1);

  // Animated styles
  const seekerAnimatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: seekerScale.value }] }));
  const providerAnimatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: providerScale.value }] }));
  const shopAnimatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: shopScale.value }] }));

  // Card press handler
  const handleCardPress = (role) => {
    setSelectedRole(role);

    // Animate selected card
    const anim = withSequence(withSpring(1.05), withSpring(1));
    if (role === 'seeker') seekerScale.value = anim;
    else if (role === 'provider') providerScale.value = anim;
    else if (role === 'shop') shopScale.value = anim;

    // Disable other cards visually
    setButtonsDisabled(true);
  };

  // Continue button handler
  const handleContinue = () => {
    if (selectedRole === 'provider') {
      router.push('/login');
    } else {
      alert('Only Service Provider can continue.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
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
        {/* Service Seeker */}
        <Pressable
          onPress={() => handleCardPress('seeker')}
          disabled={true} // completely disabled
          style={{ marginBottom: 16 }}
        >
          <Animated.View
            style={[
              styles.roleCard,
              buttonsDisabled && styles.disabledCard,
              seekerAnimatedStyle,
            ]}
          >
            <UserCheck size={48} color={buttonsDisabled ? '#999' : '#19034d'} />
            <Text style={[styles.roleTitle, buttonsDisabled && styles.disabledText]}>Service Seeker</Text>
            <Text style={[styles.roleDescription, buttonsDisabled && styles.disabledText]}>
              Find and book services for your needs
            </Text>
          </Animated.View>
        </Pressable>

        {/* Service Provider */}
        <Pressable
          onPress={() => handleCardPress('provider')}
          disabled={buttonsDisabled} // disable after click
          style={{ marginBottom: 16 }}
        >
          <Animated.View
            style={[
              styles.roleCard,
              selectedRole === 'provider' && styles.selectedCard, // green highlight
              providerAnimatedStyle,
            ]}
          >
            <Briefcase
              size={48}
              color={selectedRole === 'provider' ? '#05f51d' : '#19034d'}
            />
            <Text style={[styles.roleTitle, selectedRole === 'provider' && styles.selectedText]}>
              Service Provider
            </Text>
            <Text style={styles.roleDescription}>Offer your services and earn money</Text>
          </Animated.View>
        </Pressable>

        {/* Service Shop */}
        <Pressable
          onPress={() => handleCardPress('shop')}
          disabled={true} // completely disabled
        >
          <Animated.View
            style={[
              styles.roleCard,
              buttonsDisabled && styles.disabledCard,
              shopAnimatedStyle,
            ]}
          >
            <Store size={48} color={buttonsDisabled ? '#999' : '#19034d'} />
            <Text style={[styles.roleTitle, buttonsDisabled && styles.disabledText]}>Service Shop</Text>
            <Text style={[styles.roleDescription, buttonsDisabled && styles.disabledText]}>
              Manage your shop and attract more customers
            </Text>
          </Animated.View>
        </Pressable>
      </View>

      {/* Continue Button */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={[styles.nextButton, !selectedRole && styles.disabledButton]}
          onPress={handleContinue}
          disabled={!selectedRole} // only active if a role is selected
        >
          <Text style={[styles.nextButtonText, !selectedRole && styles.disabledButtonText]}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f5fa', paddingHorizontal: 24, paddingTop: 60, alignItems: 'center' },
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
  roleOptions: { width: '100%' },
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
  disabledCard: { opacity: 0.5 },
  roleTitle: { fontSize: 18, fontWeight: '600', color: '#19034d', marginTop: 14, marginBottom: 6 },
  selectedText: { color: '#05f51d' },
  disabledText: { color: '#999' },
  roleDescription: { fontSize: 13, color: '#666', textAlign: 'center' },
  bottomButtonContainer: { position: 'absolute', bottom: 30, alignSelf: 'center' },
  nextButton: {
    backgroundColor: '#05f51d',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 30,
    alignItems: 'center',
  },
  disabledButton: { backgroundColor: '#ccc' },
  nextButtonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  disabledButtonText: { color: '#999' },
});
