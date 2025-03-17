import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { getNotes } from '@/storage';
import PriorityList from '@/components/PriorityList';

export default function PriorityScreen() {
  const router = useRouter();
  const [priorityNotes, setPriorityNotes] = useState([]);

  useEffect(() => {
    loadPriorityNotes();
  }, []);

  const loadPriorityNotes = async () => {
    try {
      const notes = await getNotes();
      const priority = notes.filter(note => note.isPriority);
      setPriorityNotes(priority);
    } catch (error) {
      console.error('Error loading priority notes:', error);
    }
  };

  return (
    <View style={styles.container}>
      {priorityNotes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No priority notes found</Text>
        </View>
      ) : (
        <PriorityList 
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
}); 