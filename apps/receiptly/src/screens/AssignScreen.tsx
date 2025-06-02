import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Contacts from 'expo-contacts';
import { Swipeable } from 'react-native-gesture-handler';
import { RootStackParamList } from '../App';
import { ReceiptItem, Contact } from '../models/types';
import PersonChip from '../components/PersonChip';
import { calcTotals } from '../lib/split/calc';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';

type AssignScreenRouteProp = RouteProp<RootStackParamList, 'Assign'>;
type AssignScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Assign'>;

interface Props {
  route: AssignScreenRouteProp;
  navigation: AssignScreenNavigationProp;
}

export default function AssignScreen({ route, navigation }: Props) {
  const { items: initialItems, tax, tip, merchant } = route.params;
  const [items, setItems] = useState<ReceiptItem[]>(initialItems);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    // Filter contacts based on search query
    if (searchQuery.trim() === '') {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (contact.phoneNumber && contact.phoneNumber.includes(searchQuery))
      );
      setFilteredContacts(filtered);
    }
  }, [contacts, searchQuery]);

  const loadContacts = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please allow access to contacts to assign items to people.');
        return;
      }

      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
      });

      // Convert to our Contact format and cache
      const formattedContacts: Contact[] = data.map(contact => {
        // Extract the first phone number if available
        const phoneNumber = contact.phoneNumbers && contact.phoneNumbers.length > 0 
          ? contact.phoneNumbers[0].number 
          : undefined;

        return {
          id: contact.id || '',
          name: contact.name || 'Unknown',
          phoneNumber,
          venmoHandle: '', // Will be set when user configures payment details
        };
      });

      setContacts(formattedContacts);
    } catch (error) {
      console.error('Error loading contacts:', error);
      Alert.alert('Error', 'Failed to load contacts');
    }
  };

  const pickContacts = async () => {
    try {
      setLoading(true);
      // Simply reload all contacts - in a real app you might show a contact selection modal
      await loadContacts();
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const openAssignModal = (itemId: string) => {
    setSelectedItemId(itemId);
    setModalVisible(true);
  };

  const togglePersonAssignment = (itemId: string, personId: string) => {
    setItems(prevItems =>
      prevItems.map(item => {
        if (item.id === itemId) {
          const assignedTo = item.assignedTo || [];
          const isAssigned = assignedTo.includes(personId);
          
          return {
            ...item,
            assignedTo: isAssigned
              ? assignedTo.filter(id => id !== personId)
              : [...assignedTo, personId],
          };
        }
        return item;
      })
    );
  };

  const splitItemEvenly = (itemId: string) => {
    if (contacts.length < 2) {
      Alert.alert('Not enough contacts', 'Add at least 2 contacts to split items.');
      return;
    }

    const firstTwoContacts = contacts.slice(0, 2).map(c => c.id);
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? { ...item, assignedTo: firstTwoContacts, split: true }
          : item
      )
    );
  };

  const renderSwipeActions = (itemId: string) => (
    <TouchableOpacity
      style={styles.swipeAction}
      onPress={() => splitItemEvenly(itemId)}
    >
      <Text style={styles.swipeActionText}>Split 50/50</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: ReceiptItem }) => {
    const assignedPeople = contacts.filter(contact => 
      item.assignedTo?.includes(contact.id)
    );

    return (
      <Swipeable renderRightActions={() => renderSwipeActions(item.id)}>
        <TouchableOpacity
          style={styles.itemRow}
          onPress={() => openAssignModal(item.id)}
        >
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
          </View>
          <View style={styles.assignedPeople}>
            {assignedPeople.length > 0 ? (
              assignedPeople.map(person => (
                <PersonChip
                  key={person.id}
                  person={person}
                  isSelected={true}
                  onToggle={() => {}}
                />
              ))
            ) : (
              <Text style={styles.unassignedText}>Tap to assign</Text>
            )}
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  const canProceed = items.every(item => item.assignedTo && item.assignedTo.length > 0);

  const handleContinue = () => {
    // Calculate per-person totals using the split calculation
    const totals = calcTotals(items, tax, tip);
    
    // Convert to recipients format expected by Pay screen
    const recipients = Object.entries(totals).map(([personId, amount]) => {
      const contact = contacts.find(c => c.id === personId);
      return {
        id: personId,
        name: contact?.name || 'Unknown',
        amount,
        phoneNumber: contact?.phoneNumber,
        venmoHandle: contact?.venmoHandle,
      };
    });

    navigation.navigate('Pay', {
      recipients,
      merchant,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Assign Items</Text>
        <Text style={styles.subtitle}>Assign receipt items to people</Text>
        <TouchableOpacity style={styles.addContactButton} onPress={pickContacts}>
          <Text style={styles.addContactText}>
            {loading ? 'Loading...' : 'Add Contacts'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
      />

      <TouchableOpacity
        style={[styles.continueButton, !canProceed && styles.disabledButton]}
        onPress={handleContinue}
        disabled={!canProceed}
      >
        <Text style={styles.continueButtonText}>Continue to Payment</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Assign: {items.find(i => i.id === selectedItemId)?.name}
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButton}>Done</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search contacts by name or phone..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCorrect={false}
              clearButtonMode="while-editing"
            />
          </View>
          
          <FlatList
            data={filteredContacts}
            renderItem={({ item: contact }) => {
              const isSelected = items
                .find(i => i.id === selectedItemId)
                ?.assignedTo?.includes(contact.id) || false;
              
              return (
                <PersonChip
                  person={contact}
                  isSelected={isSelected}
                  onToggle={() => selectedItemId && togglePersonAssignment(selectedItemId, contact.id)}
                />
              );
            }}
            keyExtractor={contact => contact.id}
            style={styles.contactsList}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  addContactButton: {
    backgroundColor: '#2196f3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addContactText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  itemRow: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
  },
  assignedPeople: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    maxWidth: 150,
  },
  unassignedText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  swipeAction: {
    backgroundColor: '#4caf50',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
  },
  swipeActionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: '#f4511e',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 16,
    color: '#f4511e',
    fontWeight: '600',
  },
  contactsList: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    padding: 16,
  },
  searchInput: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
}); 