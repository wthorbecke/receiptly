import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Linking } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { buildVenmoURL, openVenmoPaymentByPhone } from '../lib/payments/venmo';
import { createCashAppLink, createCashAppPhoneLink } from '../lib/payments/cashapp';

type PayScreenRouteProp = RouteProp<RootStackParamList, 'Pay'>;
type PayScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Pay'>;

interface Props {
  route: PayScreenRouteProp;
  navigation: PayScreenNavigationProp;
}

export default function PayScreen({ route, navigation }: Props) {
  const { recipients, merchant } = route.params;

  const handleVenmoPayment = async (recipient: any) => {
    try {
      const note = `${merchant} - Split Bill`;
      
      if (recipient.venmoHandle) {
        // Use Venmo handle if available
        const venmoURL = buildVenmoURL(recipient.venmoHandle, recipient.amount, note);
        const canOpen = await Linking.canOpenURL(venmoURL);
        
        if (canOpen) {
          await Linking.openURL(venmoURL);
        } else {
          // If Venmo isn't installed, try opening the web version
          const handle = recipient.venmoHandle.startsWith('@') ? recipient.venmoHandle.slice(1) : recipient.venmoHandle;
          const webUrl = `https://venmo.com/${handle}`;
          await Linking.openURL(webUrl);
        }
      } else if (recipient.phoneNumber) {
        // Use phone number if venmo handle is not available
        await openVenmoPaymentByPhone(recipient.phoneNumber, recipient.amount, note);
      } else {
        Alert.alert('No Contact Info', 'This person does not have a Venmo handle or phone number configured.');
      }
    } catch (error) {
      console.error('Error opening Venmo:', error);
      Alert.alert('Error', 'Failed to open Venmo payment');
    }
  };

  const handleCashAppPayment = async (recipient: any) => {
    try {
      let cashAppURL: string;
      
      if (recipient.phoneNumber) {
        // Use phone number for Cash App payment
        cashAppURL = await createCashAppPhoneLink(recipient.phoneNumber, recipient.amount);
      } else {
        // Fallback to using name as handle
        const handle = recipient.name.toLowerCase().replace(/\s+/g, '');
        cashAppURL = await createCashAppLink(handle, recipient.amount);
      }
      
      const canOpen = await Linking.canOpenURL(cashAppURL);
      
      if (canOpen) {
        await Linking.openURL(cashAppURL);
      } else {
        // If Cash App isn't installed, open in browser
        await Linking.openURL('https://cash.app/payments');
      }
    } catch (error) {
      console.error('Error opening Cash App:', error);
      Alert.alert('Error', 'Failed to open Cash App payment');
    }
  };

  const formatPhoneNumber = (phoneNumber: string) => {
    // Format phone number for display (e.g., (555) 123-4567)
    const cleaned = phoneNumber.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phoneNumber;
  };

  const renderRecipient = ({ item: recipient }: { item: any }) => (
    <View style={styles.recipientCard}>
      <View style={styles.recipientInfo}>
        <View style={styles.recipientDetails}>
          <Text style={styles.recipientName}>{recipient.name}</Text>
          {recipient.phoneNumber && (
            <Text style={styles.recipientPhone}>{formatPhoneNumber(recipient.phoneNumber)}</Text>
          )}
        </View>
        <Text style={styles.recipientAmount}>${recipient.amount.toFixed(2)}</Text>
      </View>
      
      <View style={styles.paymentButtons}>
        <TouchableOpacity
          style={[styles.paymentButton, styles.venmoButton]}
          onPress={() => handleVenmoPayment(recipient)}
        >
          <Text style={styles.paymentButtonText}>
            {recipient.venmoHandle ? 'Venmo (@)' : 'Venmo (📱)'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.paymentButton, styles.cashAppButton]}
          onPress={() => handleCashAppPayment(recipient)}
        >
          <Text style={styles.paymentButtonText}>
            {recipient.phoneNumber ? 'Cash App (📱)' : 'Cash App'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const totalAmount = recipients.reduce((sum, recipient) => sum + recipient.amount, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Payment Requests</Text>
        <Text style={styles.subtitle}>{merchant}</Text>
        <Text style={styles.totalAmount}>Total: ${totalAmount.toFixed(2)}</Text>
      </View>

      <FlatList
        data={recipients}
        renderItem={renderRecipient}
        keyExtractor={recipient => recipient.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={styles.doneButton}
        onPress={() => navigation.navigate('Camera')}
      >
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f4511e',
  },
  list: {
    flex: 1,
    padding: 16,
  },
  recipientCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  recipientInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recipientDetails: {
    flex: 1,
  },
  recipientName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  recipientPhone: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  recipientAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f4511e',
  },
  paymentButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  paymentButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  venmoButton: {
    backgroundColor: '#3D95CE',
  },
  cashAppButton: {
    backgroundColor: '#00D632',
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  doneButton: {
    backgroundColor: '#f4511e',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 