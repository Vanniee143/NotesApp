import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const NoteCard = ({ note, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{note.title}</Text>
      {note.image && <Image source={{ uri: note.image }} style={styles.image} />}
      <Text style={styles.content}>{note.content}</Text>
      {note.isPriority && <Text style={styles.priority}>Priority</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    marginTop: 5,
  },
  priority: {
    marginTop: 5,
    color: 'red',
  },
  image: {
    width: '100%',
    height: 100,
    marginTop: 5,
  },
});

export default NoteCard;