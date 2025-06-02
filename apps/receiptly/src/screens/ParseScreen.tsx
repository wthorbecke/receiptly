import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { scanImage, recognizeText } from '../lib/ocr/mlkit';
import { processTextract } from '../lib/ocr/textract';
import { ReceiptItem } from '../models/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Parse'>;

export default function ParseScreen({ route, navigation }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<ReceiptItem[]>([]);
  const [merchant, setMerchant] = useState('');
  const [tax, setTax] = useState(0);
  const [tip, setTip] = useState(0);

  useEffect(() => {
    async function parseReceipt() {
      try {
        setLoading(true);
        
        // First try ML Kit OCR
        const blocks = await scanImage(route.params.imageUri);
        const averageConfidence = blocks.reduce((sum, block) => sum + block.confidence, 0) / blocks.length;
        
        let result;
        
        // If confidence is too low, fallback to Textract
        if (averageConfidence < 0.85) {
          console.log(`ML Kit confidence too low (${averageConfidence.toFixed(2)}), falling back to Textract`);
          result = await processTextract(route.params.imageUri);
        } else {
          console.log(`ML Kit confidence good (${averageConfidence.toFixed(2)}), using ML Kit results`);
          // For now, use the legacy recognizeText function which processes ML Kit results
          result = await recognizeText(route.params.imageUri);
        }
        
        setItems(result.items.map((item, index) => ({
          ...item,
          id: `item-${index}`,
          assignedTo: [],
          split: false,
        })));
        setMerchant(result.merchant);
        setTax(result.tax);
        setTip(result.tip);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to parse receipt');
      } finally {
        setLoading(false);
      }
    }

    parseReceipt();
  }, [route.params.imageUri]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#f4511e" />
        <Text style={styles.loadingText}>Analyzing receipt...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.merchant}>{merchant}</Text>
        </View>
        {items.map(item => (
          <View key={item.id} style={styles.item}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
          </View>
        ))}
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax:</Text>
            <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tip:</Text>
            <Text style={styles.summaryValue}>${tip.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total:</Text>
            <Text style={styles.summaryValue}>
              ${(items.reduce((sum, item) => sum + item.price, 0) + tax + tip).toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Assign', {
          items,
          tax,
          tip,
          merchant,
        })}
      >
        <Text style={styles.buttonText}>Confirm Items</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  merchant: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemName: {
    flex: 1,
    fontSize: 16,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  summary: {
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#f4511e',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    color: '#f44336',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
}); 