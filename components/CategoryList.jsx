import React, { useState, useEffect } from 'react';
import { FlatList, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { getNotes } from '@/storage';

const CategoryList = () => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);

  // Load categories with their note counts
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const notes = await getNotes();
      const uniqueCategories = [...new Set(notes.filter(note => note.category).map(note => note.category))];
      const categoriesWithCounts = uniqueCategories.map(category => ({
        name: category,
        count: notes.filter(note => note.category === category).length
      }));
      setCategories(categoriesWithCounts);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.category}
      onPress={() => router.push({
        pathname: '/category/[name]',
        params: { name: item.name }
      })}
    >
      <View style={styles.categoryContent}>
        <Text style={styles.text}>{item.name}</Text>
        <Text style={styles.count}>{item.count} notes</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => item.name}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  category: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: '500',
  },
  count: {
    fontSize: 14,
    color: '#666',
  },
});

export default CategoryList;