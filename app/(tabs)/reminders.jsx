import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { getNotes } from '@/storage';
import { IconButton } from 'react-native-paper';
import * as Notifications from 'expo-notifications';

export default function RemindersScreen() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      loadReminders();
      
      // Only set up notification listener if notifications are available
      let notificationSubscription;
      if (Notifications.addNotificationResponseReceivedListener) {
        notificationSubscription = Notifications.addNotificationResponseReceivedListener(response => {
          const noteId = response.notification.request.content.data.noteId;
          if (noteId) {
            router.push({
              pathname: '/note/display/[id]',
              params: { id: noteId }
            });
          }
        });
      }

      return () => {
        if (notificationSubscription) {
          notificationSubscription.remove();
        }
      };
    }, [])
  );

  const loadReminders = async () => {
    try {
      setLoading(true);
      const notes = await getNotes();
      const notesWithReminders = notes
        .filter(note => note.reminder)
        .sort((a, b) => new Date(a.reminder) - new Date(b.reminder));
      setReminders(notesWithReminders);
    } catch (error) {
      console.error('Error loading reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.reminderItem}>
      <View style={styles.reminderContent}>
        <Text style={styles.title}>{item.title || 'Untitled'}</Text>
        <Text style={styles.reminderTime}>
          {new Date(item.reminder).toLocaleString()}
        </Text>
      </View>
      <IconButton
        icon="arrow-right"
        size={24}
        onPress={() => router.push({
          pathname: '/note/display/[id]',
          params: { id: item.id }
        })}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.emptyContainer}>
          <Text>Loading...</Text>
        </View>
      ) : reminders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No reminders set</Text>
        </View>
      ) : (
        <FlatList
          data={reminders}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={styles.list}
          onRefresh={loadReminders}
          refreshing={loading}
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
  list: {
    flex: 1,
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reminderContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  reminderTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
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