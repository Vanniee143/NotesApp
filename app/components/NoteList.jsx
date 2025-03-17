import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text, Image, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { deleteNote } from '@/storage';

const NoteList = ({ notes, onRefresh }) => {
  const router = useRouter();
  const [noteList, setNoteList] = useState(notes);

  useEffect(() => {
    setNoteList(notes);
  }, [notes]);

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const handleDelete = async (id) => {
    try {
      await deleteNote(id);
      const updatedNotes = noteList.filter(note => note.id !== id);
      setNoteList(updatedNotes);
      if (onRefresh) {
        onRefresh(); // Refresh parent component's list
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      Alert.alert('Error', 'Failed to delete note');
    }
  };

  const confirmDelete = (id) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => handleDelete(id) 
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.noteItem}
      onPress={() => router.push({
        pathname: '/note/display/[id]',
        params: { id: item.id }
      })}
      onLongPress={() => confirmDelete(item.id)} // Long press to delete
    >
      {item.image && (
        <Image 
          source={{ uri: item.image }} 
          style={styles.noteImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.noteContent}>
        <Text style={styles.noteTitle}>{item.title || 'Untitled'}</Text>
        <Text style={styles.notePreview} numberOfLines={2}>
          {item.content || 'No content'}
        </Text>
        <View style={styles.noteFooter}>
          {item.isPriority && (
            <Text style={styles.priorityTag}>Priority</Text>
          )}
          {item.category && (
            <Text style={styles.categoryTag}>{item.category}</Text>
          )}
          <Text style={styles.dateText}>
            {formatDate(item.createdAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={noteList}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      style={styles.container}
      onRefresh={onRefresh}
      refreshing={false}
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 80,
  },
  noteItem: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  noteImage: {
    width: '100%',
    height: 200,
  },
  noteContent: {
    padding: 16,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  notePreview: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  noteFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  priorityTag: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: '500',
  },
  categoryTag: {
    color: '#2196F3',
    fontSize: 12,
  },
  dateText: {
    color: '#999',
    fontSize: 12,
    marginLeft: 'auto',
  },
});

export default NoteList;
