import { useTheme } from '@/components/ThemeProvider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export default function ViewImageScreen() {
  // Correct way to type useLocalSearchParams for Expo Router
  const params = useLocalSearchParams<{ imageUri?: string }>();
  const [displayedImage, setDisplayedImage] = useState<string | null>(null);
  const { colors } = useTheme();
  const router = useRouter();

  useEffect(() => {
    // Handle both string and array cases safely
    const imageUri = params.imageUri;
    if (!imageUri) {
      console.warn('No imageUri parameter provided');
      return;
    }

    // Handle case where imageUri might be an array
    const uri = Array.isArray(imageUri) ? imageUri[0] : imageUri;
    if (typeof uri === 'string') {
      setDisplayedImage(uri);
    }
  }, [params.imageUri]);

  // Rest of your component remains the same...
  const handleShare = async () => {
    if (!displayedImage) {
      Alert.alert('No Image', 'There is no image to share.');
      return;
    }
    if (!(await Sharing.isAvailableAsync())) {
      Alert.alert(
        'Sharing not available',
        'Sharing is not available on your device.'
      );
      return;
    }
    try {
      await Sharing.shareAsync(displayedImage);
    } catch (error) {
      console.error('Error sharing image:', error);
      Alert.alert('Sharing Failed', 'Could not share the image.');
    }
  };

  const handleAuto = () => {
    Alert.alert('Auto', 'Auto-enhancement feature coming soon!');
  };

  const handleEdit = () => {
    if (!displayedImage) {
      Alert.alert('No Image', 'Please select an image to edit.');
      return;
    }
    router.push({
      pathname: '/EditImageScreen',
      params: { imageUri: displayedImage },
    });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Image',
      'Are you sure you want to delete this image?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            if (!displayedImage) return;

            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert(
                'Permission Denied',
                'Cannot delete without media library access.'
              );
              return;
            }

            Alert.alert(
              'Image Sent to Trash (Placeholder)',
              'Image would be moved to trash.'
            );
            router.back();
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const handleSaveImage = async () => {
    if (!displayedImage) {
      Alert.alert('No Image', 'Nothing to save.');
      return;
    }
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'Sorry, we need access to your photo library to save the image!'
      );
      return;
    }
    try {
      await MediaLibrary.createAssetAsync(displayedImage);
      Alert.alert('Saved!', 'Image saved successfully.');
    } catch (error) {
      console.error('Error saving image:', error);
      Alert.alert('Save Error', 'Failed to save image. Please try again.');
    }
  };

  return (
    <View className='flex-1' style={{ backgroundColor: colors.background }}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: '',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className='px-4'>
              <MaterialCommunityIcons
                name='arrow-left'
                size={24}
                color={colors.foreground}
              />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleSaveImage} className='px-4'>
              <Text
                className='font-rubik-medium text-base'
                style={{ color: colors.primary }}
              >
                Save
              </Text>
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: colors.card,
          },
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {displayedImage ? (
          <Image
            source={{ uri: displayedImage }}
            className='w-[95%] h-[95%] bg-gray-200 rounded-lg border border-gray-300 mb-5'
            resizeMode='contain'
          />
        ) : (
          <View className='flex-1 justify-center items-center p-5'>
            <Text className='font-rubik-regular text-base text-muted-foreground mb-5'>
              No image selected.
            </Text>
          </View>
        )}
      </ScrollView>

      {displayedImage && (
        <View
          className='flex-row justify-around items-center absolute bottom-0 left-0 right-0 h-[70px] border-t'
          style={{
            backgroundColor: colors.card,
            borderTopColor: colors.border,
          }}
        >
          <TouchableOpacity onPress={handleShare} className='items-center p-1'>
            <MaterialCommunityIcons
              name='share-variant'
              size={24}
              color={colors.foreground}
            />
            <Text
              className='font-rubik-regular text-xs mt-1'
              style={{ color: colors.foreground }}
            >
              Share
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleAuto} className='items-center p-1'>
            <MaterialCommunityIcons
              name='auto-fix'
              size={24}
              color={colors.foreground}
            />
            <Text
              className='font-rubik-regular text-xs mt-1'
              style={{ color: colors.foreground }}
            >
              Auto
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleEdit} className='items-center p-1'>
            <MaterialCommunityIcons
              name='pencil-box-multiple-outline'
              size={24}
              color={colors.foreground}
            />
            <Text
              className='font-rubik-regular text-xs mt-1'
              style={{ color: colors.foreground }}
            >
              Edit
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} className='items-center p-1'>
            <MaterialCommunityIcons
              name='delete'
              size={24}
              color={colors.foreground}
            />
            <Text
              className='font-rubik-regular text-xs mt-1'
              style={{ color: colors.foreground }}
            >
              Trash
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 100,
  },
});
