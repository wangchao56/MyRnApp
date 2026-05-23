import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface ScannerProps {
  onScanSuccess: (data: string) => void;
  onScanError?: (error: string) => void;
  fps?: number;
  qrbox?: number;
  aspectRatio?: number;
  disableFlip?: boolean;
  preferredCamera?: 'environment' | 'user';
}

export default function Scanner({
  onScanSuccess,
  onScanError,
  fps = 10,
  qrbox = 250,
  aspectRatio = 1.777778,
  disableFlip = false,
  preferredCamera = 'environment',
}: ScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraId, setCameraId] = useState<string | null>(null);

  useEffect(() => {
    const initScanner = async () => {
      try {
        const scanner = new Html5Qrcode('qr-scanner');
        scannerRef.current = scanner;

        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length) {
          const backCamera = devices.find(
            (d) => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes(preferredCamera)
          );
          const targetCamera = backCamera || devices[devices.length - 1];
          setCameraId(targetCamera.id);

          await scanner.start(
            targetCamera.id,
            {
              fps,
              qrbox,
              aspectRatio,
              disableFlip,
            },
            (decodedText) => {
              onScanSuccess(decodedText);
            },
            (errorMessage) => {
              if (onScanError) {
                onScanError(errorMessage);
              }
            }
          );
          setIsScanning(true);
          setError(null);
        } else {
          setError('No camera found');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize scanner';
        setError(errorMessage);
        if (onScanError) {
          onScanError(errorMessage);
        }
      }
    };

    initScanner();

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [fps, qrbox, aspectRatio, disableFlip, preferredCamera, onScanSuccess, onScanError]);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!isScanning) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Initializing camera...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <div
        id="qr-scanner"
        ref={(el: HTMLDivElement | null) => {
          containerRef.current = el;
        }}
        style={styles.scannerContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  scannerContainer: {
    width: '100%',
    height: '100%',
  },
  loadingText: {
    marginTop: 10,
    color: '#fff',
    fontSize: 16,
  },
  errorText: {
    color: '#ff0000',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
});
