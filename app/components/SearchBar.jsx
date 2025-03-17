import React from 'react';
import { StyleSheet } from 'react-native';
import { Searchbar } from 'react-native-paper';

const SearchBar = ({ onSearch }) => {
  return (
    <Searchbar
      placeholder="Search notes..."
      onChangeText={onSearch}
      style={styles.searchBar}
    />
  );
};

const styles = StyleSheet.create({
  searchBar: {
    borderRadius: 20,
    elevation: 2,
  },
});

export default SearchBar; 