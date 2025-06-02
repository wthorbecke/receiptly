import { ReceiptItem } from '../../models/types';

interface PerUserTotals {
  [userId: string]: number;
}

export function calcTotals(
  items: Array<ReceiptItem>,
  tax: number,
  tip: number
): PerUserTotals {
  const perUser: PerUserTotals = {};
  const subtotal = items.reduce((s, i) => s + i.price, 0);

  items.forEach(item => {
    if (item.assignedTo) {
      item.assignedTo.forEach(personId => {
        perUser[personId] = (perUser[personId] || 0) + item.price / item.assignedTo!.length;
      });
    }
  });

  // Calculate the factor to distribute tax and tip proportionally
  const factor = (subtotal + tax + tip) / subtotal;

  // Apply the factor to each person's share and round to 2 decimal places
  Object.keys(perUser).forEach(personId => {
    perUser[personId] = +(perUser[personId] * factor).toFixed(2);
  });

  return perUser;
} 