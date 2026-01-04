import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();

  // Logo animation values
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  // Background shape animation values
  const shapeX = useSharedValue(0);
  const shapeY = useSharedValue(0);

  const animatedLogoStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const animatedShapeStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: shapeX.value },
      { translateY: shapeY.value },
    ],
    opacity: 0.15,
  }));

  useEffect(() => {
    // Logo entrance animation
    opacity.value = withTiming(1, { duration: 800 });
    scale.value = withSequence(
      withSpring(1.2, { damping: 4, stiffness: 80 }),
      withSpring(1, { damping: 6, stiffness: 90 })
    );

    // Animate background shapes
    shapeX.value = withRepeat(
      withTiming(100, { duration: 4000, easing: Easing.linear }),
      -1,
      true
    );
    shapeY.value = withRepeat(
      withTiming(50, { duration: 5000, easing: Easing.linear }),
      -1,
      true
    );

    // Navigate to role selection
    const timer = setTimeout(() => router.replace('/role-selection'), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Background Shape */}
      <Animated.View style={[styles.shape, animatedShapeStyle]} />

      <Animated.View style={[styles.logoContainer, animatedLogoStyle]}>
        <View style={styles.logo}>
          <Image
            source={require('../assets/images/icon.jpg')}
            style={styles.logoImage}
            resizeMode="cover"
          />
        </View>
        <Text style={styles.tagline}>Your Service Marketplace</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#031942', // solid blue background
    justifyContent: 'center',
    alignItems: 'center',
  },
  shape: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#ffffff',
  },
  logoContainer: { alignItems: 'center' },
  logo: {
    width: 150, // increased size
    height: 150,
    backgroundColor: '#05f51d',
    borderRadius: 75, // perfect round circle
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoImage: {
    width: 130, // increased image size
    height: 130,
    borderRadius: 75, // round image inside the circle
  },
  tagline: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
});