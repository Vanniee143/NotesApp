import React from 'react';
import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import NoteCard from './NoteCard';

const PriorityList = ({ notes }) => {
  const navigation = useNavigation();

  return (
    <FlatList
      data={notes}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <NoteCard
          note={item}
          onPress={() => navigation.navigate('Note', { note: item })}
        />
      )}
    />
  );
};

export default PriorityList;