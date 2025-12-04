import { getUser } from '@/src/utils/storage';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';

const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#FFFFFF',
    card: '#FFFFFF',
    text: '#000000',
    border: '#E0E0E0',
    notification: '#58CC02',
  },
};

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [userExists, setUserExists] = useState<boolean | null>(null);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    checkUser();
  }, []);

  // Re-check user whenever segments change (route changes)
  useEffect(() => {
    checkUser();
  }, [segments]);

  const checkUser = async () => {
    try {
      const user = await getUser();
      setUserExists(!!user);
    } catch (error) {
      setUserExists(false);
    }
  };

  useEffect(() => {
    if (userExists === null || !loaded) return;

    const inWelcome = segments[0] === 'welcome';

    if (!userExists && !inWelcome) {
      router.replace('/welcome');
    } else if (userExists && inWelcome) {
      router.replace('/(tabs)');
    }
  }, [userExists, segments, loaded]);

  if (!loaded || userExists === null) {
    return null;
  }

  return (
    <ThemeProvider value={LightTheme}>
      <Stack>
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}