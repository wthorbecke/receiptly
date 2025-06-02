import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { Receipt } from '../models/types';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function saveReceipt(receipt: Receipt): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'receipts'), {
      ...receipt,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving receipt:', error);
    throw new Error('Failed to save receipt');
  }
}

export async function getReceipts(): Promise<Receipt[]> {
  try {
    const receiptsQuery = query(
      collection(db, 'receipts'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(receiptsQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
    } as Receipt));
  } catch (error) {
    console.error('Error fetching receipts:', error);
    throw new Error('Failed to fetch receipts');
  }
} 