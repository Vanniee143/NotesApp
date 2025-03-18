import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text, Image, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { deleteNote } from '@/storage';
import { IconButton } from 'react-native-paper';

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
      style={[styles.noteItem, item.isPriority && styles.priorityNote]}
      onPress={() => router.push({
        pathname: '/note/display/[id]',
        params: { id: item.id }
      })}
      onLongPress={() => confirmDelete(item.id)} // Long press to delete
    >
      <View style={styles.noteContent}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{item.title || 'Untitled'}</Text>
          {item.isPriority && (
            <IconButton
              icon="star"
              size={20}
              color="#ff4444"
              style={styles.priorityIcon}
            />
          )}
        </View>
        
        {item.image && (
          <Image 
            source={{ uri: item.image }} 
            style={styles.noteImage}
            resizeMode="cover"
          />
        )}
        
        <Text style={styles.preview} numberOfLines={2}>
          {item.content || 'No content'}
        </Text>
        
        <View style={styles.noteFooter}>
          {item.category && (
            <Text style={styles.category}>{item.category}</Text>
          )}
          <Text style={styles.date}>
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
  priorityNote: {
    borderLeftWidth: 4,
    borderLeftColor: '#ff4444',
  },
  noteContent: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  priorityIcon: {
    margin: 0,
  },
  preview: {
    color: '#666',
    marginTop: 8,
  },
  noteImage: {
    width: '100%',
    height: 200,
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    alignItems: 'center',
  },
  category: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
  },
  date: {
    color: '#999',
    fontSize: 12,
  },
});

export default NoteList;
