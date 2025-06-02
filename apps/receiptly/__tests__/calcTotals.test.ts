import { calcTotals } from '../src/lib/split/calc';
import { ReceiptItem } from '../src/models/types';

describe('calcTotals', () => {
  const mockItems: ReceiptItem[] = [
    {
      id: '1',
      name: 'Coffee',
      price: 10.00,
      assignedTo: ['user1'],
      split: false,
    },
    {
      id: '2',
      name: 'Sandwich',
      price: 15.00,
      assignedTo: ['user1', 'user2'],
      split: true,
    },
    {
      id: '3',
      name: 'Chips',
      price: 5.00,
      assignedTo: ['user2'],
      split: false,
    },
  ];

  it('should calculate totals correctly for single assignees', () => {
    const items: ReceiptItem[] = [
      {
        id: '1',
        name: 'Coffee',
        price: 10.00,
        assignedTo: ['user1'],
        split: false,
      },
      {
        id: '2',
        name: 'Chips',
        price: 5.00,
        assignedTo: ['user2'],
        split: false,
      },
    ];

    const result = calcTotals(items, 2.00, 3.00);
    
    // Total: 15.00 + 2.00 + 3.00 = 20.00
    // Factor: 20.00 / 15.00 = 1.333...
    // user1: 10.00 * 1.333... = 13.33
    // user2: 5.00 * 1.333... = 6.67
    
    expect(result.user1).toBe(13.33);
    expect(result.user2).toBe(6.67);
  });

  it('should split items evenly between multiple assignees', () => {
    const items: ReceiptItem[] = [
      {
        id: '1',
        name: 'Shared Pizza',
        price: 20.00,
        assignedTo: ['user1', 'user2'],
        split: true,
      },
    ];

    const result = calcTotals(items, 0, 0);
    
    // Each person should pay half: 10.00 each
    expect(result.user1).toBe(10.00);
    expect(result.user2).toBe(10.00);
  });

  it('should handle complex multi-assignee scenarios', () => {
    const result = calcTotals(mockItems, 3.00, 2.00);
    
    // Subtotal: 30.00
    // Total with tax and tip: 35.00
    // Factor: 35.00 / 30.00 = 1.1667
    
    // user1: (10.00 + 7.50) * 1.1667 = 20.42
    // user2: (7.50 + 5.00) * 1.1667 = 14.58
    
    expect(result.user1).toBe(20.42);
    expect(result.user2).toBe(14.58);
  });

  it('should handle items with no assignees', () => {
    const items: ReceiptItem[] = [
      {
        id: '1',
        name: 'Unassigned Item',
        price: 10.00,
        assignedTo: [],
        split: false,
      },
    ];

    const result = calcTotals(items, 1.00, 1.00);
    
    // No one assigned, so result should be empty
    expect(Object.keys(result)).toHaveLength(0);
  });

  it('should handle three-way splits', () => {
    const items: ReceiptItem[] = [
      {
        id: '1',
        name: 'Shared Appetizer',
        price: 15.00,
        assignedTo: ['user1', 'user2', 'user3'],
        split: true,
      },
    ];

    const result = calcTotals(items, 0, 0);
    
    // Each person should pay one third: 5.00 each
    expect(result.user1).toBe(5.00);
    expect(result.user2).toBe(5.00);
    expect(result.user3).toBe(5.00);
  });

  it('should round to 2 decimal places', () => {
    const items: ReceiptItem[] = [
      {
        id: '1',
        name: 'Item',
        price: 10.00,
        assignedTo: ['user1'],
        split: false,
      },
    ];

    const result = calcTotals(items, 1.33, 1.33);
    
    // Total: 12.66, Factor: 1.266
    // user1: 10.00 * 1.266 = 12.66
    
    expect(result.user1).toBe(12.66);
  });
}); 