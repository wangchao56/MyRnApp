import { useState, useCallback, useEffect } from 'react';
import { Alert, Linking, Platform } from 'react-native';

interface UseScannerOptions {
  onScanSuccess?: (data: string) => void;
  onScanError?: (error: string) => void;
  autoStop?: boolean;
  stopDelay?: number;
}

interface UseScannerReturn {
  scanResult: string | null;
  scanHistory: string[];
  isScanning: boolean;
  error: string | null;
  startScanning: () => void;
  stopScanning: () => void;
  clearHistory: () => void;
}

export function useScanner(options: UseScannerOptions = {}): UseScannerReturn {
  const {
    onScanSuccess,
    onScanError,
    autoStop = true,
    stopDelay = 2000,
  } = options;

  const [scanResult, setScanResult] = useState<string | null>(null);
  const [scanHistory, setScanHistory] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleScanSuccess = useCallback(
    (data: string) => {
      setScanResult(data);
      setScanHistory((prev) => [data, ...prev.slice(0, 49)]);
      setError(null);

      if (onScanSuccess) {
        onScanSuccess(data);
      }

      if (autoStop) {
        setTimeout(() => {
          setIsScanning(false);
        }, stopDelay);
      }
    },
    [autoStop, stopDelay, onScanSuccess]
  );

  const handleScanError = useCallback(
    (errorMessage: string) => {
      setError(errorMessage);
      if (onScanError) {
        onScanError(errorMessage);
      }
    },
    [onScanError]
  );

  const startScanning = useCallback(() => {
    setIsScanning(true);
    setScanResult(null);
    setError(null);
  }, []);

  const stopScanning = useCallback(() => {
    setIsScanning(false);
  }, []);

  const clearHistory = useCallback(() => {
    setScanHistory([]);
    setScanResult(null);
  }, []);

  useEffect(() => {
    return () => {
      setIsScanning(false);
    };
  }, []);

  return {
    scanResult,
    scanHistory,
    isScanning,
    error,
    startScanning,
    stopScanning,
    clearHistory,
  };
}

export function useScannerWithPermission(
  options: UseScannerOptions & { permissionTitle?: string; permissionMessage?: string } = {}
): UseScannerReturn & { hasPermission: boolean; requestPermission: () => Promise<boolean> } {
  const [hasPermission, setHasPermission] = useState(false);
  const scanner = useScanner(options);

  const requestPermission = useCallback(async () => {
    try {
      if (Platform.OS === 'web') {
        setHasPermission(true);
        return true;
      }
      
      // For native platforms without vision camera package installed
      // Mock permission request
      const granted = true; 
      setHasPermission(granted);
      
      if (!granted) {
        Alert.alert(
          options.permissionTitle || 'Camera Permission Required',
          options.permissionMessage || 'Please enable camera access in your device settings to scan QR codes.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:');
                } else {
                  Linking.openSettings();
                }
              },
            },
          ]
        );
      }
      
      return granted;
    } catch (err) {
      console.error('Failed to request camera permission:', err);
      setHasPermission(false);
      return false;
    }
  }, [options.permissionTitle, options.permissionMessage]);

  return {
    ...scanner,
    hasPermission,
    requestPermission,
  };
}

export default useScanner;
