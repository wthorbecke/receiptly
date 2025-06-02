import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Contact } from '../models/types';

interface PersonChipProps {
  person: Contact;
  isSelected: boolean;
  onToggle: (person: Contact) => void;
}

export default function PersonChip({ person, isSelected, onToggle }: PersonChipProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected ? styles.selected : styles.unselected,
      ]}
      onPress={() => onToggle(person)}
    >
      <Text style={[
        styles.text,
        isSelected ? styles.selectedText : styles.unselectedText,
      ]}>
        {person.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  selected: {
    backgroundColor: '#f4511e',
  },
  unselected: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f4511e',
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedText: {
    color: '#fff',
  },
  unselectedText: {
    color: '#f4511e',
  },
}); 