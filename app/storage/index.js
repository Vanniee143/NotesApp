import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTES_STORAGE_KEY = 'NOTES_STORAGE_KEY';

export const getNotes = async () => {
  try {
    const notesJson = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
    return notesJson ? JSON.parse(notesJson) : [];
  } catch (error) {
    console.error('Error getting notes:', error);
    return [];
  }
};

export const saveNote = async (note) => {
  try {
    const notes = await getNotes();
    const existingNoteIndex = notes.findIndex(n => n.id === note.id);
    
    if (existingNoteIndex >= 0) {
      notes[existingNoteIndex] = {
        ...notes[existingNoteIndex],
        ...note,
        updatedAt: Date.now(),
      };
    } else {
      notes.push({
        ...note,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
    return true;
  } catch (error) {
    console.error('Error saving note:', error);
    throw new Error('Failed to save note');
  }
};

export const deleteNote = async (noteId) => {
  try {
    const notes = await getNotes();
    const updatedNotes = notes.filter(note => note.id !== noteId);
    await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(updatedNotes));
    return true;
  } catch (error) {
    console.error('Error deleting note:', error);
    throw new Error('Failed to delete note');
  }
};

export default {
  getNotes,
  saveNote,
  deleteNote,
}; 