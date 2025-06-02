import React from 'react';
import { render } from '@testing-library/react-native';
import AssignScreen from '../src/screens/AssignScreen';
import { ReceiptItem } from '../src/models/types';
import * as Contacts from 'expo-contacts';

// Mock the navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
} as any;

// Mock the route
const mockRoute = {
  params: {
    items: [
      {
        id: '1',
        name: 'Coffee',
        price: 4.50,
        assignedTo: [],
        split: false,
      },
      {
        id: '2',
        name: 'Sandwich',
        price: 8.99,
        assignedTo: [],
        split: false,
      },
    ] as ReceiptItem[],
    tax: 1.28,
    tip: 0,
    merchant: 'Demo Coffee Shop',
  },
} as any;

// Mock expo-contacts
jest.mock('expo-contacts', () => ({
  requestPermissionsAsync: jest.fn(),
  getContactsAsync: jest.fn(),
  Fields: {
    Name: 'name',
    PhoneNumbers: 'phoneNumbers',
  },
}));

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => ({
  Swipeable: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock PersonChip component
jest.mock('../src/components/PersonChip', () => {
  const { Text, TouchableOpacity } = require('react-native');
  
  return function MockPersonChip({ person, isSelected }: any) {
    return (
      <TouchableOpacity testID={`person-chip-${person.id}`}>
        <Text>{person.name}</Text>
      </TouchableOpacity>
    );
  };
});

describe('AssignScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock successful permissions and contacts
    (Contacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });
    
    (Contacts.getContactsAsync as jest.Mock).mockResolvedValue({
      data: [
        { id: 'contact1', name: 'John Doe' },
        { id: 'contact2', name: 'Jane Smith' },
      ],
    });
  });

  it('should render correctly with initial items', () => {
    const { getByText } = render(
      <AssignScreen route={mockRoute} navigation={mockNavigation} />
    );

    expect(getByText('Assign Items')).toBeTruthy();
    expect(getByText('Coffee')).toBeTruthy();
    expect(getByText('$4.50')).toBeTruthy();
    expect(getByText('Sandwich')).toBeTruthy();
    expect(getByText('$8.99')).toBeTruthy();
  });

  it('should show unassigned text for items without assignees', () => {
    const { getAllByText } = render(
      <AssignScreen route={mockRoute} navigation={mockNavigation} />
    );

    const unassignedTexts = getAllByText('Tap to assign');
    expect(unassignedTexts).toHaveLength(2); // Two items, both unassigned
  });

  it('should render add contacts button', () => {
    const { getByText } = render(
      <AssignScreen route={mockRoute} navigation={mockNavigation} />
    );

    expect(getByText('Add Contacts')).toBeTruthy();
  });

  it('should render continue button', () => {
    const { getByText } = render(
      <AssignScreen route={mockRoute} navigation={mockNavigation} />
    );

    expect(getByText('Continue to Payment')).toBeTruthy();
  });
}); 