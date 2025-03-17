import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, ScrollView, Switch, Text, Image, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { IconButton } from 'react-native-paper';
import { saveNote, getNotes } from '@/storage';
import * as ImagePicker from 'expo-image-picker';
import * as Notifications from 'expo-notifications';
import ReminderPicker from './ReminderPicker';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const NoteEditor = ({ noteId }) => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [isPriority, setIsPriority] = useState(false);
  const [category, setCategory] = useState('');
  const [reminder, setReminder] = useState(null);
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
      // Ensure the date is in the future
      if (date.getTime() <= Date.now()) {
        alert('Please select a future date and time');
        return;
      }

      const trigger = new Date(date);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: title || 'Note Reminder',
          body: content?.substring(0, 50) || 'Check your note',
          data: { noteId },
        },
        trigger,
      });
      
      setReminder(date);
      setShowReminderPicker(false);
      alert('Reminder set successfully!');
    } catch (error) {
      console.error('Error setting reminder:', error);
      alert('Failed to set reminder');
    }
  };

  const handleSave = async () => {
    const newNote = {
      id: noteId || Date.now().toString(),
      title,
      content,
      image,
      isPriority,
      category,
      createdAt: Date.now(),
      reminder: reminder ? reminder.toISOString() : null,
    };
    await saveNote(newNote);
    router.back();
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }

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
      alert('Error picking image');
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
          <Image 
            source={{ uri: image }} 
            style={styles.imagePreview}
            resizeMode="cover"
          />
          <Button 
            title="Remove Image" 
            onPress={() => setImage(null)} 
            color="red"
          />
        </View>
      )}
      <Button title="Pick an image" onPress={pickImage} />
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Category:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter category name"
          value={category}
          onChangeText={setCategory}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Priority:</Text>
        <Switch
          value={isPriority}
          onValueChange={setIsPriority}
        />
      </View>

      <View style={styles.reminderSection}>
        <Button
          title={reminder ? `Edit Reminder (${new Date(reminder).toLocaleString()})` : 'Set Reminder'}
          onPress={() => setShowReminderPicker(true)}
          color="#007AFF"
        />
        {reminder && (
          <View style={styles.reminderInfo}>
            <Text style={styles.reminderText}>
              Reminder scheduled for: {new Date(reminder).toLocaleString()}
            </Text>
            <Button
              title="Remove Reminder"
              onPress={() => {
                setReminder(null);
                alert('Reminder removed');
              }}
              color="red"
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
          />
        </View>
      </Modal>

      <Button title="Save Note" onPress={handleSave} />
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
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 4,
  },
  reminderSection: {
    marginVertical: 15,
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  reminderInfo: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 6,
  },
  reminderText: {
    marginBottom: 10,
    color: '#007AFF',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
});

export default NoteEditor; 