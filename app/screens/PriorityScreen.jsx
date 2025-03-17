import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getNotes } from '../storage';
import PriorityList from '../components/PriorityList';

const PriorityScreen = () => {
  const [priorityNotes, setPriorityNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      const notes = await getNotes();
      const priorityNotes = notes.filter(note => note.isPriority);
      setPriorityNotes(priorityNotes);
    };
    fetchNotes();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Priority Notes</Text>
      <PriorityList notes={priorityNotes} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default PriorityScreen;