import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getNotes } from '@/storage';
import NotesDisplay from '@/components/NotesDisplay';

export default function NoteDisplayPage() {
  const { id } = useLocalSearchParams();
  const [note, setNote] = useState(null);
  const router = useRouter();

  useEffect(() => {
    loadNote();
  }, [id]);

  const loadNote = async () => {
    const notes = await getNotes();
    const foundNote = notes.find(n => n.id === id);
    if (foundNote) {
      setNote(foundNote);
    } else {
      // Note not found (possibly deleted)
      router.back();
    }
  };

  if (!note) {
    return null;
  }

  return (
    <View style={styles.container}>
      <NotesDisplay note={note} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
}); 