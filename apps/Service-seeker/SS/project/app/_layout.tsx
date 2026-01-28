import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';


export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Splash screen first */}
        <Stack.Screen name="splash" />

        {/* Onboarding / Role / Auth Screens */}
        <Stack.Screen name="role-selection" />
        <Stack.Screen name="registration" />
        <Stack.Screen name="login" />
        <Stack.Screen name="set-password" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="subcategories" />
        <Stack.Screen name="booking-form" />
        <Stack.Screen name="provider-matching" />
        <Stack.Screen name="job-tracking" />
        <Stack.Screen name="notifications" />

        {/* Main App Tabs */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* 404 Not Found */}
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
