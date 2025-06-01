import React, { useState, useRef } from 'react';
import { StyleSheet, View, Platform, Pressable } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useTheme } from '@/hooks/useThemeContext';
import ThemedText from './ThemedText';
import Button from './Button';
import { Camera, SwitchCamera, Mic, MicOff, Circle } from 'lucide-react-native';
import Layout from '@/constants/Layout';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  Easing,
  cancelAnimation 
} from 'react-native-reanimated';

interface CameraWithOverlayProps {
  onTextRecognized: (text: string) => void;
  isProcessing: boolean;
  isRecording: boolean;
  onRecordingChange: (recording: boolean) => void;
}

export default function CameraWithOverlay({ 
  onTextRecognized, 
  isProcessing,
  isRecording,
  onRecordingChange
}: CameraWithOverlayProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('front');
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const { colors, theme } = useTheme();
  
  const borderOpacity = useSharedValue(0.5);
  const borderScale = useSharedValue(1);
  const recordingPulse = useSharedValue(1);

  React.useEffect(() => {
    if (isRecording) {
      recordingPulse.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      cancelAnimation(recordingPulse);
      recordingPulse.value = withTiming(1);
    }
  }, [isRecording]);

  const animatedRecordingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: recordingPulse.value }],
    opacity: withTiming(isRecording ? 1 : 0, { duration: 300 }),
  }));

  if (!permission) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ThemedText>Requesting camera permission...</ThemedText>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ThemedText variant="h3" style={styles.permissionText}>
          We need your permission to use the camera
        </ThemedText>
        <Button 
          title="Grant Permission" 
          onPress={requestPermission} 
          variant="primary"
          size="large" 
        />
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'front' ? 'back' : 'front'));
  };
  
  const toggleAudio = () => {
    setAudioEnabled(prev => !prev);
  };

  const toggleRecording = () => {
    onRecordingChange(!isRecording);
    if (!isRecording) {
      onTextRecognized("Hello! This is a sample translation.");
    }
  };

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        facing={facing}
      >
        <View style={styles.overlay}>
          <View style={styles.header}>
            <ThemedText variant="h3" weight="semibold" color="white" style={styles.title}>
              Sign Language Translator
            </ThemedText>
            {isRecording && (
              <View style={styles.recordingIndicator}>
                <Animated.View style={[styles.recordingDot, animatedRecordingStyle]} />
                <ThemedText color="white" style={styles.recordingText}>Recording</ThemedText>
              </View>
            )}
          </View>

          <View style={styles.controls}>
            <Button
              title=""
              variant="secondary"
              style={styles.controlButton}
              onPress={toggleAudio}
              icon={audioEnabled ? 
                <Mic size={24} color={colors.text} /> : 
                <MicOff size={24} color={colors.text} />
              }
            />
            
            <Pressable
              style={[
                styles.recordButton,
                isRecording && styles.recordButtonActive
              ]}
              onPress={toggleRecording}
            >
              <Circle
                size={24}
                color={isRecording ? '#ff4444' : '#ffffff'}
                fill={isRecording ? '#ff4444' : 'transparent'}
              />
            </Pressable>
            
            <Button
              title=""
              variant="secondary"
              style={styles.controlButton}
              onPress={toggleCameraFacing}
              icon={<SwitchCamera size={24} color={colors.text} />}
            />
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: Layout.borderRadius.lg,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: Layout.spacing.lg,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.full,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff4444',
    marginRight: Layout.spacing.sm,
  },
  recordingText: {
    fontSize: 14,
    fontWeight: '500',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Layout.spacing.xl,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  recordButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 3,
    borderColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButtonActive: {
    backgroundColor: 'rgba(255,68,68,0.2)',
    borderColor: '#ff4444',
  },
  permissionText: {
    textAlign: 'center',
    marginBottom: Layout.spacing.xl,
  },
});