import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Platform, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/hooks/useThemeContext';
import ThemedText from '@/components/ThemedText';
import CameraWithOverlay from '@/components/CameraWithOverlay';
import AnimatedTranslation from '@/components/AnimatedTranslation';
import { useTranslation } from '@/context/TranslationContext';
import Layout from '@/constants/Layout';

const { height } = Dimensions.get('window');

export default function TranslateScreen() {
  const { colors } = useTheme();
  const { addTranslation, currentTranslation, setCurrentTranslation } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const handleTextRecognized = (text: string) => {
    setIsProcessing(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      setCurrentTranslation(text);
      addTranslation(text);
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="auto" />
      
      <View style={styles.content}>
        <View style={styles.cameraSection}>
          <CameraWithOverlay 
            onTextRecognized={handleTextRecognized}
            isProcessing={isProcessing}
            isRecording={isRecording}
            onRecordingChange={setIsRecording}
          />
        </View>
        
        <View style={[styles.translationSection, { backgroundColor: colors.card }]}>
          <ThemedText variant="h3" weight="semibold" style={styles.sectionTitle}>
            Translation Output
          </ThemedText>
          
          {currentTranslation ? (
            <AnimatedTranslation 
              text={currentTranslation}
              onComplete={() => {}}
            />
          ) : (
            <View style={styles.placeholderContainer}>
              <ThemedText color="secondary" style={styles.placeholder}>
                {isRecording 
                  ? "Recording... Sign language will be translated here"
                  : "Start recording to see sign language translation"}
              </ThemedText>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  content: {
    flex: 1,
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
  },
  cameraSection: {
    flex: Platform.OS === 'web' ? 0.6 : 0.7,
    borderRadius: Layout.borderRadius.lg,
    overflow: 'hidden',
    margin: Layout.spacing.md,
  },
  translationSection: {
    flex: Platform.OS === 'web' ? 0.4 : 0.3,
    margin: Layout.spacing.md,
    marginTop: 0,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.lg,
  },
  sectionTitle: {
    marginBottom: Layout.spacing.md,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.spacing.xl,
  },
  placeholder: {
    textAlign: 'center',
    lineHeight: 24,
  },
});