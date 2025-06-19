import '@/app/globals.css';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { ThemeProvider, useTheme } from '@/components/ThemeProvider';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'Rubik-Black': require('../assets/fonts/Rubik-Black.ttf'),
    'Rubik-BlackItalic': require('../assets/fonts/Rubik-BlackItalic.ttf'),
    'Rubik-Bold': require('../assets/fonts/Rubik-Bold.ttf'),
    'Rubik-BoldItalic': require('../assets/fonts/Rubik-BoldItalic.ttf'),
    'Rubik-ExtraBold': require('../assets/fonts/Rubik-ExtraBold.ttf'),
    'Rubik-ExtraBoldItalic': require('../assets/fonts/Rubik-ExtraBoldItalic.ttf'),
    'Rubik-Italic': require('../assets/fonts/Rubik-Italic.ttf'),
    'Rubik-Light': require('../assets/fonts/Rubik-Light.ttf'),
    'Rubik-LightItalic': require('../assets/fonts/Rubik-LightItalic.ttf'),
    'Rubik-Medium': require('../assets/fonts/Rubik-Medium.ttf'),
    'Rubik-MediumItalic': require('../assets/fonts/Rubik-MediumItalic.ttf'),
    'Rubik-Regular': require('../assets/fonts/Rubik-Regular.ttf'),
    'Rubik-SemiBold': require('../assets/fonts/Rubik-SemiBold.ttf'),
    'Rubik-SemiBoldItalic': require('../assets/fonts/Rubik-SemiBoldItalic.ttf'),
    'SpaceMono-Regular': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  function AppWrapper() {
    const { theme } = useTheme();
    return (
      <View className={`${theme === 'dark' ? 'dark' : ''} flex-1`}>
        <Stack screenOptions={{ headerShown: false }}>
          {/*
            This is crucial: The `(tabs)` group is now a single screen in the root Stack.
            Its internal navigation (the actual tabs) is defined in `app/(tabs)/_layout.tsx`.
            By setting `headerShown: false` here, you let `app/(tabs)/_layout.tsx` (and its screens)
            control their own headers, preventing a double header.
          */}
          <Stack.Screen name='(tabs)' options={{ headerShown: false }} />

          {/*
            These screens are outside the tabs and will cover the tabs when navigated to.
            They are part of the main navigation stack.
            Ensure these match your actual file names in `app/`.
          */}
          <Stack.Screen
            name='ViewImageScreen'
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='EditImageScreen'
            options={{ headerShown: false }}
          />

          {/* Modal screens */}
          <Stack.Screen
            name='(modals)/settings'
            options={{ presentation: 'modal', headerShown: false }}
          />
          <Stack.Screen
            name='(modals)/trash'
            options={{ presentation: 'modal', headerShown: false }}
          />
        </Stack>
      </View>
    );
  }

  return (
    <ThemeProvider>
      <AppWrapper />
    </ThemeProvider>
  );
}
