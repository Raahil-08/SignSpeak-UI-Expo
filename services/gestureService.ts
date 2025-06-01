import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

const SERVER_URL = 'http://localhost:5000';

export async function processFrame(frame: string): Promise<any> {
  try {
    const response = await fetch(`${SERVER_URL}/process-frame`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ frame }),
    });

    if (!response.ok) {
      throw new Error('Server response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Error processing frame:', error);
    throw error;
  }
}