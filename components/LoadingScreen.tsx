import React, { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

export default function LoadingScreen() {
  const glowIntensity = useSharedValue(0);

  useEffect(() => {
    glowIntensity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedTextStyle = useAnimatedStyle(() => ({
    textShadow: Platform.select({
      web: `0 0 ${10 * glowIntensity.value}px rgba(224, 175, 160, ${glowIntensity.value})`,
      default: 'none',
    }),
    opacity: 0.3 + (glowIntensity.value * 0.7),
  }));

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.text, animatedTextStyle]}>
        SignSpeak
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#463f3a',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  text: {
    color: '#f4f3ee',
    fontSize: 48,
    fontFamily: Platform.select({
      web: 'Times New Roman',
      default: 'serif',
    }),
    letterSpacing: 2,
  },
});