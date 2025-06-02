import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Contact, ReceiptItem as ReceiptItemType } from '../models/types';
import PersonChip from './PersonChip';

interface ReceiptItemProps {
  item: ReceiptItemType;
  onAssign: (personId: string) => void;
  onSplit: () => void;
  assignedContacts: Contact[];
  allContacts: Contact[];
}

export default function ReceiptItem({ 
  item, 
  onAssign, 
  onSplit,
  assignedContacts,
  allContacts,
}: ReceiptItemProps) {
  const renderRightActions = () => (
    <TouchableOpacity
      style={styles.splitButton}
      onPress={onSplit}
    >
      <Text style={styles.splitButtonText}>Split 50/50</Text>
    </TouchableOpacity>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <View style={styles.container}>
        <View style={styles.itemInfo}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        </View>
        <View style={styles.assignees}>
          {assignedContacts.map(contact => (
            <PersonChip
              key={contact.id}
              person={contact}
              isSelected={item.assignedTo?.includes(contact.id) ?? false}
              onToggle={() => onAssign(contact.id)}
            />
          ))}
        </View>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    flex: 1,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  assignees: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  splitButton: {
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: '100%',
  },
  splitButtonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
}); 