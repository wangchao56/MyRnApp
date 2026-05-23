import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

interface ScannerProps {
  onScanSuccess: (data: string) => void;
  onScanError?: (error: string) => void;
  scanning?: boolean;
}

export default function Scanner({ onScanSuccess, onScanError, scanning = true }: ScannerProps) {
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>QR Scanner</Text>
        <Text style={styles.text}>
          Camera scanning is not available on web.
        </Text>
        <Text style={styles.subText}>
          Please use a mobile device to scan QR codes.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>QR Scanner</Text>
      <Text style={styles.text}>
        Scanner component requires react-native-vision-camera.
      </Text>
      <Text style={styles.subText}>
        Please install the camera dependency to use this feature.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  subText: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
  },
});
