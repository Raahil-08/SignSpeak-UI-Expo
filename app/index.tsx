import { Redirect } from 'expo-router';
import { TranslationProvider } from '@/context/TranslationContext';

export default function Index() {
  // Redirect to the tabs navigation
  return (
    <TranslationProvider>
      <Redirect href="/(tabs)" />
    </TranslationProvider>
  );
}