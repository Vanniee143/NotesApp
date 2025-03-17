import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { getNotes } from '@/storage';
import NoteList from '@/components/NoteList';

export default function CategoryDetailScreen() {
  const { name } = useLocalSearchParams();
  const [categoryNotes, setCategoryNotes] = useState([]);

  useEffect(() => {
    loadCategoryNotes();
  }, []);

  const loadCategoryNotes = async () => {
    const notes = await getNotes();
    const filtered = notes.filter(note => note.category === name);
    setCategoryNotes(filtered);
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: `${name} Notes`,
          headerShown: true,
        }} 
      />
      <View style={styles.container}>
        <NoteList 
          notes={categoryNotes} 
          onRefresh={loadCategoryNotes}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
}); 