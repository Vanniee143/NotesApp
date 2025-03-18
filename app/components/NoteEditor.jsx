import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, ScrollView, Switch, Text, Image, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as Notifications from 'expo-notifications';
import { saveNote } from '@/storage';
import ReminderPicker from './ReminderPicker';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const NoteEditor = ({ noteId, initialNote }) => {
  const router = useRouter();
  const [title, setTitle] = useState(initialNote?.title || '');
  const [content, setContent] = useState(initialNote?.content || '');
  const [image, setImage] = useState(initialNote?.image || null);
  const [category, setCategory] = useState(initialNote?.category || '');
  const [isPriority, setIsPriority] = useState(initialNote?.isPriority || false);
  const [reminder, setReminder] = useState(initialNote?.reminder ? new Date(initialNote.reminder) : null);
  const [showReminderPicker, setShowReminderPicker] = useState(false);

  useEffect(() => {
    if (noteId) {
      loadNote();
    }
  }, [noteId]);

  // Request notification permissions
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to send notifications was denied');
      }
    })();
  }, []);

  // Set up notification handler
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const noteId = response.notification.request.content.data.noteId;
      if (noteId) {
        router.push({
          pathname: '/note/display/[id]',
          params: { id: noteId }
        });
      }
    });

    return () => subscription.remove();
  }, []);

  const loadNote = async () => {
    const notes = await getNotes();
    const note = notes.find(n => n.id === noteId);
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setImage(note.image);
      setIsPriority(note.isPriority);
      setCategory(note.category);
      setReminder(note.reminder ? new Date(note.reminder) : null);
    }
  };

  const handleSetReminder = async (date) => {
    try {
      if (noteId) {
        await Notifications.cancelScheduledNotificationAsync(noteId);
      }

      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: title || 'Note Reminder',
          body: content?.substring(0, 50) || 'Check your note',
          data: { noteId: noteId || Date.now().toString() },
        },
        trigger: date,
      });
      
      setReminder(date);
      setShowReminderPicker(false);
    } catch (error) {
      console.error('Error setting reminder:', error);
      alert('Failed to set reminder');
    }
  };

  const handleSave = async () => {
    try {
      const newNote = {
        id: noteId || Date.now().toString(),
        title,
        content,
        image,
        category,
        isPriority,
        reminder: reminder?.toISOString(),
        createdAt: Date.now(),
      };
      await saveNote(newNote);
      router.back();
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Failed to save note');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('Failed to pick image');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, styles.contentInput]}
        placeholder="Content"
        value={content}
        onChangeText={setContent}
        multiline
      />

      {image && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.imagePreview} />
          <IconButton
            icon="close"
            size={24}
            onPress={() => setImage(null)}
          />
        </View>
      )}

      <Button
        mode="outlined"
        onPress={pickImage}
        style={styles.button}
      >
        Pick an image
      </Button>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Category:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter category"
          value={category}
          onChangeText={setCategory}
        />
      </View>

      <View style={styles.priorityContainer}>
        <Text style={styles.label}>Priority Note</Text>
        <Switch
          value={isPriority}
          onValueChange={(value) => {
            setIsPriority(value);
          }}
          color="#ff4444"
        />
      </View>

      <View style={styles.reminderSection}>
        <Button
          mode="outlined"
          icon="clock"
          onPress={() => setShowReminderPicker(true)}
        >
          {reminder ? 'Edit Reminder' : 'Set Reminder'}
        </Button>
        {reminder && (
          <View style={styles.reminderInfo}>
            <Text style={styles.reminderText}>
              Reminder set for: {reminder.toLocaleString()}
            </Text>
            <IconButton
              icon="close"
              size={20}
              onPress={() => {
                setReminder(null);
                if (noteId) {
                  Notifications.cancelScheduledNotificationAsync(noteId);
                }
              }}
            />
          </View>
        )}
      </View>

      <Modal
        visible={showReminderPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowReminderPicker(false)}
      >
        <View style={styles.modalContainer}>
          <ReminderPicker
            onSetReminder={handleSetReminder}
            onCancel={() => setShowReminderPicker(false)}
            initialDate={reminder || new Date()}
          />
        </View>
      </Modal>

      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.saveButton}
      >
        Save Note
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
  },
  contentInput: {
    height: 150,
    textAlignVertical: 'top',
  },
  formGroup: {
    marginVertical: 10,
  },
  label: {
    marginBottom: 5,
    fontWeight: '500',
  },
  imageContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 4,
  },
  button: {
    marginVertical: 10,
  },
  saveButton: {
    marginTop: 16,
    marginBottom: 32,
  },
  reminderSection: {
    marginVertical: 10,
  },
  reminderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  reminderText: {
    flex: 1,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
});

export default NoteEditor; 