import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Text } from 'react-native-paper';
import { getNotes } from '@/storage';
import NoteList from '@/components/NoteList';

export default function PriorityScreen() {
  const [priorityNotes, setPriorityNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      loadPriorityNotes();
    }, [])
  );

  const loadPriorityNotes = async () => {
    try {
      setLoading(true);
      const allNotes = await getNotes();
      // Filter notes where isPriority is true and sort by creation date
      const priority = allNotes
        .filter(note => note.isPriority)
        .sort((a, b) => b.createdAt - a.createdAt);
      setPriorityNotes(priority);
    } catch (error) {
      console.error('Error loading priority notes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.centerContent}>
          <Text>Loading...</Text>
        </View>
      ) : priorityNotes.length === 0 ? (
        <View style={styles.centerContent}>
          <Text>No priority notes found</Text>
        </View>
      ) : (
        <NoteList 
          notes={priorityNotes}
          onRefresh={loadPriorityNotes}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 