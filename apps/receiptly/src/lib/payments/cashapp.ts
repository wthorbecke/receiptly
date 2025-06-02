import { Linking } from 'react-native';

interface CashAppPaymentParams {
  amount: number;
  note: string;
  customerId?: string;
}

interface CashAppResponse {
  payment_link: string;
  payment_id: string;
}

export async function createCashAppLink(handle: string, amount: number): Promise<string> {
  // For demo purposes, return a simple Cash App URL
  // In a real implementation, this would call the Square Cash App Pay API
  return `https://cash.app/$${handle}/${amount}`;
}

export async function createCashAppPhoneLink(phoneNumber: string, amount: number): Promise<string> {
  // Clean phone number - remove all non-digits
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  
  // Cash App supports phone numbers but for demo we'll create a payment request URL
  // In a real implementation, you'd use the Square Cash App Pay API
  return `https://cash.app/payments/send?amount=${amount}&recipient=${cleanPhone}`;
}

export async function createPayment({ amount, note, customerId }: CashAppPaymentParams): Promise<string> {
  const apiKey = process.env.CASH_APP_API_KEY;
  const clientId = process.env.CASH_APP_CLIENT_ID;

  if (!apiKey || !clientId) {
    throw new Error('Cash App API credentials not configured');
  }

  try {
    const response = await fetch('https://api.cash.app/partner/network-api/operations/create-a-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'X-Client-Id': clientId,
      },
      body: JSON.stringify({
        amount: {
          amount: amount.toFixed(2),
          currency: 'USD',
        },
        description: note,
        customer_id: customerId,
        idempotency_key: `payment_${Date.now()}`,
      }),
    });

    if (!response.ok) {
      throw new Error(`Cash App API error: ${response.status}`);
    }

    const data: CashAppResponse = await response.json();
    return data.payment_link;
  } catch (error) {
    console.error('Cash App payment creation failed:', error);
    throw new Error('Failed to create Cash App payment');
  }
}

export async function openCashAppPayment(paymentLink: string): Promise<void> {
  const canOpen = await Linking.canOpenURL(paymentLink);
  
  if (canOpen) {
    await Linking.openURL(paymentLink);
  } else {
    // If Cash App isn't installed, open in browser
    await Linking.openURL(`https://cash.app/payments`);
  }
} 