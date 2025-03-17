import React from 'react';
import { Text } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import Colors from '@/constants/Colors';

export function ThemedText({ style, ...props }) {
  const colorScheme = useColorScheme();
  
  return (
    <Text 
      style={[
        { color: Colors[colorScheme ?? 'light'].text },
        style
      ]} 
      {...props} 
    />
  );
} 