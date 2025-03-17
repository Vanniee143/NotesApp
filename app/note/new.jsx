import React from 'react';
import { View, StyleSheet } from 'react-native';
import NoteEditor from '@/components/NoteEditor';

export default function NewNoteScreen() {
  return (
    <View style={styles.container}>
      <NoteEditor />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
}); 