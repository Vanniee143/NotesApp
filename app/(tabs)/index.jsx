import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { FAB, Button } from 'react-native-paper';
import { getNotes } from '@/storage';
import NoteList from '@/components/NoteList';
import SearchBar from '@/components/SearchBar';

export default function NotesScreen() {
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      loadNotes();
    }, [])
  );

  const loadNotes = async () => {
    const fetchedNotes = await getNotes();
    // Sort notes by creation date, newest first
    const sortedNotes = fetchedNotes.sort((a, b) => b.createdAt - a.createdAt);
    setNotes(sortedNotes);
    setFilteredNotes(sortedNotes);
  };

  const handleSearch = (query) => {
    const filtered = notes.filter(note => 
      note.title.toLowerCase().includes(query.toLowerCase()) ||
      note.content.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredNotes(filtered);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <SearchBar onSearch={handleSearch} />
        </View>
      </View>
      <NoteList 
        notes={filteredNotes} 
        onRefresh={loadNotes}
      />
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => router.push('/note/new')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 8,
  },
  searchContainer: {
    flex: 1,
  },
  categoriesButton: {
    borderRadius: 20,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
