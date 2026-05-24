import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, Alert } from 'react-native';
import { Button } from '../Button';
import { Card } from '../Card';
import Scanner from './Scanner.native';

export default function ScannerScreen() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [scanHistory, setScanHistory] = useState<string[]>([]);

  const handleScanSuccess = useCallback((data: string) => {
    console.log('Scan Success:', data);
    setScanResult(data);
    setScanHistory((prev) => [data, ...prev.slice(0, 49)]);
    
    Alert.alert(
      'Scan Success',
      `Scanned data: ${data}`,
      [
        {
          text: 'Continue Scanning',
          onPress: () => {
            setScanResult(null);
            setIsScanning(true);
          },
        },
        {
          text: 'View History',
          style: 'cancel',
        },
      ]
    );
  }, []);

  const handleScanError = useCallback((error: string) => {
    console.error('Scan Error:', error);
    Alert.alert('Scan Error', error);
  }, []);

  const startScanning = useCallback(() => {
    setIsScanning(true);
    setScanResult(null);
  }, []);

  const stopScanning = useCallback(() => {
    setIsScanning(false);
  }, []);

  const clearHistory = useCallback(() => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all scan history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => setScanHistory([]),
        },
      ]
    );
  }, []);

  const copyToClipboard = useCallback((text: string) => {
    Alert.alert('Copied', `Copied to clipboard: ${text}`);
  }, []);

  const renderHistoryItem = useCallback(({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => copyToClipboard(item)}
      onLongPress={() => {
        Alert.alert(
          'Delete Item',
          'Remove this item from history?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => {
                setScanHistory((prev) => prev.filter((h) => h !== item));
              },
            },
          ]
        );
      }}
    >
      <Text style={styles.historyText} numberOfLines={2}>
        {item}
      </Text>
    </TouchableOpacity>
  ), [copyToClipboard]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>QR Scanner</Text>
        {scanResult && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultLabel}>Last Scan:</Text>
            <Text style={styles.resultText} numberOfLines={2}>
              {scanResult}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.scannerContainer}>
        <Scanner
          onScanSuccess={handleScanSuccess}
          onScanError={handleScanError}
          scanning={isScanning}
        />
      </View>

      <View style={styles.controls}>
        <Button
          title={isScanning ? 'Stop Scanning' : 'Start Scanning'}
          onPress={isScanning ? stopScanning : startScanning}
          variant={isScanning ? 'secondary' : 'primary'}
        />
      </View>

      <View style={styles.historySection}>
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>Scan History ({scanHistory.length})</Text>
          {scanHistory.length > 0 && (
            <TouchableOpacity onPress={clearHistory}>
              <Text style={styles.clearButton}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        {scanHistory.length === 0 ? (
          <View style={styles.emptyHistory}>
            <Text style={styles.emptyText}>No scan history yet</Text>
          </View>
        ) : (
          <FlatList
            data={scanHistory}
            renderItem={renderHistoryItem}
            keyExtractor={(item, index) => `${item}-${index}`}
            style={styles.historyList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  resultContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
  },
  resultLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  resultText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  scannerContainer: {
    height: 300,
    backgroundColor: '#000',
  },
  controls: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  historySection: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  clearButton: {
    fontSize: 14,
    color: '#ff3b30',
  },
  historyList: {
    flex: 1,
  },
  historyItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  historyText: {
    fontSize: 14,
    color: '#333',
  },
  emptyHistory: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
});
