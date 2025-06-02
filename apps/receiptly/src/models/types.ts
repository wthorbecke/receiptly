export interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  assignedTo?: string[];
  split?: boolean;
}

export interface Contact {
  id: string;
  name: string;
  phoneNumber?: string;
  venmoHandle?: string;
}

export interface Receipt {
  id: string;
  merchant: string;
  date: string;
  items: ReceiptItem[];
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
  imageUri: string;
  receipt_raw: string;
  receipt_json: Record<string, any>;
  createdAt: Date;
}

export interface PaymentRecipient {
  id: string;
  name: string;
  amount: number;
  venmoHandle?: string;
  items: ReceiptItem[];
}

export interface OCRResult {
  text: string;
  confidence: number;
  boundingBox: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
} 