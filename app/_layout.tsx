import '@/app/globals.css'; // Your global Tailwind CSS file
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react'; // Import useEffect
import { View } from 'react-native';
import { ThemeProvider, useTheme } from '@/components/ThemeProvider';

// Prevent the splash screen from auto-hiding while fonts load
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Load your custom fonts
  const [fontsLoaded, fontError] = useFonts({
    // Add fontError for better debugging
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

  // Effect to hide splash screen once fonts are loaded or if there's an error
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // If fonts are not loaded (and no error occurred), keep splash screen visible
  if (!fontsLoaded && !fontError) {
    return null;
  }

  // This component wraps your entire app content with the ThemeProvider
  // and applies the dark/light theme class based on the current theme.
  function AppWrapper() {
    const { theme } = useTheme();
    return (
      // The 'dark' class needs to be on a parent View that wraps all routes
      // so NativeWind can apply dark mode styles to all components within.
      <View className={`${theme === 'dark' ? 'dark' : ''} flex-1`}>
        {/* The Stack component renders your actual routes (e.g., app/index.tsx, app/imagecropper.tsx) */}
        <Stack />
      </View>
    );
  }

  return (
    // The ThemeProvider must wrap the AppWrapper
    <ThemeProvider>
      <AppWrapper />
    </ThemeProvider>
  );
}
