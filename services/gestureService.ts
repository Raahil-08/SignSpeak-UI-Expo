import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

const SERVER_URL = Platform.select({
  web: 'http://localhost:5000',
  default: 'http://10.0.2.2:5000' // Use this for Android emulator
});

export async function processFrame(frame: string): Promise<any> {
  try {
    console.log('Sending frame to server...');
    const response = await fetch(`${SERVER_URL}/process-frame`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ frame }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Server response:', data);
    return data;
  } catch (error) {
    console.error('Error processing frame:', error);
    return { detected: false, error: error.message };
  }
}