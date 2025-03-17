import React from 'react';
import { View, StyleSheet } from 'react-native';
import NoteEditor from '../components/NoteEditor';

const NoteScreen = ({ route, navigation }) => {
  const { note } = route.params || {};

  return (
    <View style={styles.container}>
      <NoteEditor note={note} navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});

export default NoteScreen;