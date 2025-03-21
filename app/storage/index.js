import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTES_STORAGE_KEY = '@notes';

export const getNotes = async () => {
  try {
    const notesJson = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
    return notesJson ? JSON.parse(notesJson) : [];
  } catch (error) {
    console.error('Error loading notes:', error);
    return [];
  }
};

export const saveNote = async (note) => {
  try {
    const notes = await getNotes();
    const noteIndex = notes.findIndex(n => n.id === note.id);
    
    if (noteIndex >= 0) {
      notes[noteIndex] = {
        ...notes[noteIndex],
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
    const filteredNotes = notes.filter(note => note.id !== noteId);
    await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(filteredNotes));
    return true;
  } catch (error) {
    console.error('Error deleting note:', error);
    throw new Error('Failed to delete note');
  }
};

const storage = {
  getNotes,
  saveNote,
  deleteNote,
};

export default storage; 