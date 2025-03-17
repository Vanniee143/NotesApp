import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { getNotes } from '@/storage';
import NoteList from '@/components/NoteList';

export default function CategoryScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const notes = await getNotes();
    const uniqueCategories = [...new Set(notes.filter(note => note.category).map(note => note.category))];
    const categoriesWithCounts = uniqueCategories.map(category => ({
      name: category,
      count: notes.filter(note => note.category === category).length
    }));
    setCategories(categoriesWithCounts);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => router.push({
        pathname: '/category/[name]',
        params: { name: item.name }
      })}
    >
      <Text style={styles.categoryName}>{item.name}</Text>
      <Text style={styles.noteCount}>{item.count} notes</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categories</Text>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={item => item.name}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  categoryItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '500',
  },
  noteCount: {
    color: '#666',
    fontSize: 14,
  },
});