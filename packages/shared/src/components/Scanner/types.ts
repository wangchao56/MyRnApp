export interface ScannerProps {
  onScanSuccess: (data: string) => void;
  onScanError?: (error: string) => void;
  fps?: number;
  qrbox?: number;
  aspectRatio?: number;
  disableFlip?: boolean;
  preferredCamera?: 'environment' | 'user';
  scanning?: boolean;
}
