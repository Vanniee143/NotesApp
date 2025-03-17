import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import NoteEditor from '@/components/NoteEditor';

export default function EditNotePage() {
  const { id } = useLocalSearchParams();
  
  return <NoteEditor noteId={id} />;
} 