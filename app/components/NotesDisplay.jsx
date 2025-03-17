import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Alert } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { deleteNote } from '@/storage';

const NotesDisplay = ({ note }) => {
  const router = useRouter();

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteNote(note.id);
              router.back();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete note');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => router.back()}
        />
        <View style={styles.headerButtons}>
          <IconButton
            icon="pencil"
            size={24}
            onPress={() => router.push({
              pathname: '/note/[id]',
              params: { id: note.id }
            })}
          />
          <IconButton
            icon="delete"
            size={24}
            iconColor="red"
            onPress={handleDelete}
          />
        </View>
      </View>
      <ScrollView style={styles.scrollContent}>
        {note.image && (
          <Image 
            source={{ uri: note.image }} 
            style={styles.image}
            resizeMode="cover"
          />
        )}
        <View style={styles.content}>
          <Text style={styles.title}>{note.title || 'Untitled'}</Text>
          <Text style={styles.date}>{formatDate(note.createdAt)}</Text>
          
          <View style={styles.tags}>
            {note.isPriority && (
              <Text style={styles.priorityTag}>Priority</Text>
            )}
            {note.category && (
              <Text style={styles.categoryTag}>{note.category}</Text>
            )}
          </View>

          <Text style={styles.noteContent}>{note.content || 'No content'}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    margin: 0,
  },
  scrollContent: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'poppins-bold',
    marginBottom: 8,
  },
  date: {
    color: '#666',
    marginBottom: 12,
    fontSize: 16,
  },
  tags: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  priorityTag: {
    backgroundColor: '#ff6b6b',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 16,
  },
  categoryTag: {
    backgroundColor: '#4dabf7',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 16,
  },
  noteContent: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default NotesDisplay; 