import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getNotes } from '../storage';
import NoteList from '../components/NoteList';
import SearchBar from '../components/SearchBar';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      const notes = await getNotes();
      setNotes(notes);
      setFilteredNotes(notes);
    };
    fetchNotes();
  }, []);

  const handleSearch = (query) => {
    const filtered = notes.filter(note => note.title.includes(query));
    setFilteredNotes(filtered);
  };

  return (
    <View style={styles.container}>
      <SearchBar onSearch={handleSearch} />
      <Button title="Add Note" onPress={() => navigation.navigate('Note')} />
      <NoteList notes={filteredNotes} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});

export default HomeScreen;