import AsyncStorage from '@react-native-async-storage/async-storage';
const NOTES_KEY = 'notes';

export const getNotes = async () => {
  try {
    const notesJson = await AsyncStorage.getItem(NOTES_KEY);
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
      // Update existing note
      notes[existingNoteIndex] = {
        ...notes[existingNoteIndex],
        ...note,
        updatedAt: Date.now(),
      };
    } else {
      // Add new note
      notes.push({
        ...note,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    return true;
  } catch (error) {
    console.error('Error saving note:', error);
    return false;
  }
};

export const deleteNote = async (noteId) => {
  try {
    const notes = await getNotes();
    const updatedNotes = notes.filter(note => note.id !== noteId);
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(updatedNotes));
    return true;
  } catch (error) {
    console.error('Error deleting note:', error);
    return false;
  }
}; 