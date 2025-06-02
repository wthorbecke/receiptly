import { Linking } from 'react-native';

interface VenmoPaymentParams {
  recipient: string;
  amount: number;
  note: string;
}

export const buildVenmoURL = (handle: string, amount: number, note: string): string => {
  // Remove @ symbol if present at the start of the handle
  const cleanHandle = handle.startsWith('@') ? handle.slice(1) : handle;
  
  return `venmo://paycharge?txn=pay&recipients=${cleanHandle}&amount=${amount}&note=${encodeURIComponent(note)}`;
};

export const buildVenmoPhoneURL = (phoneNumber: string, amount: number, note: string): string => {
  // Clean phone number - remove all non-digits
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  
  // Venmo supports phone numbers in their deep link
  return `venmo://paycharge?txn=pay&recipients=${cleanPhone}&amount=${amount}&note=${encodeURIComponent(note)}`;
};

export async function openVenmoPayment({ recipient, amount, note }: VenmoPaymentParams): Promise<boolean> {
  // Construct the Venmo deep link URL using the buildVenmoURL function
  const url = buildVenmoURL(recipient, amount, note);
  
  // Check if Venmo is installed
  const canOpen = await Linking.canOpenURL(url);
  
  if (canOpen) {
    await Linking.openURL(url);
    return true;
  }
  
  // If Venmo isn't installed, try opening the web version
  const handle = recipient.startsWith('@') ? recipient.slice(1) : recipient;
  const webUrl = `https://venmo.com/${handle}`;
  await Linking.openURL(webUrl);
  return false;
}

export async function openVenmoPaymentByPhone(phoneNumber: string, amount: number, note: string): Promise<boolean> {
  // Construct the Venmo deep link URL using phone number
  const url = buildVenmoPhoneURL(phoneNumber, amount, note);
  
  // Check if Venmo is installed
  const canOpen = await Linking.canOpenURL(url);
  
  if (canOpen) {
    await Linking.openURL(url);
    return true;
  }
  
  // If Venmo isn't installed, open general Venmo page
  await Linking.openURL('https://venmo.com/');
  return false;
} 