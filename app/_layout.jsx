import { Stack } from 'expo-router';
import React from 'react';

export default function RootLayout() {
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
          title: route?.params?.name ? `${route.params.name} Notes` : 'Category',
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