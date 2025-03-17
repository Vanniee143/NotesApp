import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import * as Notifications from 'expo-notifications';

// Configure notifications only if they're available
if (Notifications.setNotificationHandler) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

export default function RootLayout() {
  useEffect(() => {
    async function setupNotifications() {
      if (Notifications.requestPermissionsAsync) {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          console.log('Notification permissions not granted');
        }
      }
    }

    setupNotifications();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="note/[id]" 
        options={{ 
          title: 'Edit Note',
          presentation: 'modal'
        }} 
      />
      <Stack.Screen 
        name="note/new" 
        options={{ 
          title: 'New Note',
          presentation: 'modal'
        }} 
      />
      <Stack.Screen 
        name="note/display/[id]" 
        options={{ 
          title: 'Note Details',
          headerShown: true
        }} 
      />
      <Stack.Screen 
        name="category/[name]" 
        options={({ route }) => ({ 
          title: `${route?.params?.name} Notes`,
          headerShown: true
        })} 
      />
      <Stack.Screen 
        name="screens/CategoryScreen" 
        options={{ 
          title: 'Categories',
          headerShown: true
        }} 
      />
    </Stack>
  );
} 