declare module '@react-native-camera-roll/camera-roll' {
  export interface SaveToCameraRollOptions {
    type?: 'photo' | 'video';
    album?: string;
  }

  const CameraRoll: {
    save: (uri: string, options?: SaveToCameraRollOptions) => Promise<string>;
  };

  export default CameraRoll;
}
