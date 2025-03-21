import React, { useState, useEffect, useCallback, memo } from 'react';
import { View, FlatList, TouchableOpacity, Text, Image, StyleSheet, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { deleteNote, getNotes } from '@/storage';
import { IconButton } from 'react-native-paper';

// Memoize the note item to prevent unnecessary re-renders
const NoteItem = memo(({ item, onPress, onLongPress, formatDate }) => (
  <TouchableOpacity
    style={[styles.noteItem, item.isPriority && styles.priorityNote]}
    onPress={onPress}
    onLongPress={onLongPress}
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
));

const NoteList = ({ notes: initialNotes, onRefresh }) => {
  const router = useRouter();
  const [noteList, setNoteList] = useState(initialNotes || []);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Format date is memoized to prevent recreating on each render
  const formatDate = useCallback((timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  }, []);

  useEffect(() => {
    if (initialNotes) {
      setNoteList(initialNotes);
    }
  }, [initialNotes]);

  const handleDelete = useCallback(async (id) => {
    try {
      await deleteNote(id);
      setNoteList(prevNotes => prevNotes.filter(note => note.id !== id));
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      Alert.alert('Error', 'Failed to delete note');
    }
  }, [onRefresh]);

  const confirmDelete = useCallback((id) => {
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
  }, [handleDelete]);

  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return; // Prevent multiple refresh calls
    
    setIsRefreshing(true);
    try {
      if (onRefresh) {
        await onRefresh();
      } else {
        const updatedNotes = await getNotes();
        setNoteList(updatedNotes);
      }
    } catch (error) {
      console.error('Error refreshing notes:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, onRefresh]);

  const renderItem = useCallback(({ item }) => (
    <NoteItem
      item={item}
      onPress={() => router.push({
        pathname: '/note/display/[id]',
        params: { id: item.id }
      })}
      onLongPress={() => confirmDelete(item.id)}
      formatDate={formatDate}
    />
  ), [router, confirmDelete, formatDate]);

  const keyExtractor = useCallback((item) => item.id, []);

  return (
    <FlatList
      data={noteList}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      style={styles.container}
      onRefresh={handleRefresh}
      refreshing={isRefreshing}
      contentContainerStyle={styles.listContent}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={5}
      initialNumToRender={10}
      maintainVisibleContentPosition={{
        minIndexForVisible: 0,
        autoscrollToTopThreshold: 10,
      }}
      extraData={noteList.length} // Only re-render when list length changes
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

export default memo(NoteList);
