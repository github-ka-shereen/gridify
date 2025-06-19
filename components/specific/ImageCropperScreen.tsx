// components/specific/ImageCropperScreen.tsx
import { Action, manipulateAsync, SaveFormat } from 'expo-image-manipulator'; // Keeping manipulateAsync as requested
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library'; // <--- NEW IMPORT for saving
import { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Button } from '../ui/Button';

// Get screen width for responsive image display
const { width: screenWidth } = Dimensions.get('window');
const IMAGE_DISPLAY_SIZE = screenWidth * 0.8; // 80% of screen width

// Define your default crop configurations
const DEFAULT_CROPS = {
  SQUARE: { width: 500, height: 500, ratio: 1 }, // 1:1
  LANDSCAPE: { width: 800, height: 600, ratio: 4 / 3 }, // 4:3
  PORTRAIT: { width: 600, height: 800, ratio: 3 / 4 }, // 3:4
};

export default function ImageCropperScreen() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'Sorry, we need camera roll permissions to make this work!'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Keeping MediaTypeOptions as per your provided code
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setOriginalImage(result.assets[0].uri);
      setCroppedImage(null);
    }
  };

  const cropImage = async (cropType: keyof typeof DEFAULT_CROPS) => {
    if (!originalImage) {
      Alert.alert('No Image Selected', 'Please select an image to crop first!');
      return;
    }

    const cropConfig = DEFAULT_CROPS[cropType];

    try {
      const imageInfo = await manipulateAsync(originalImage, [], {
        compress: 1,
        format: SaveFormat.PNG,
      });

      const originalWidth = imageInfo.width;
      const originalHeight = imageInfo.height;

      let cropOriginX = 0;
      let cropOriginY = 0;
      let cropSizeWidth = originalWidth;
      let cropSizeHeight = originalHeight;

      if (cropConfig.ratio) {
        if (originalWidth / originalHeight > cropConfig.ratio) {
          cropSizeWidth = originalHeight * cropConfig.ratio;
          cropOriginX = (originalWidth - cropSizeWidth) / 2;
        } else {
          cropSizeHeight = originalWidth / cropConfig.ratio;
          cropOriginY = (originalHeight - cropSizeHeight) / 2;
        }
      }

      const actions: Action[] = [
        {
          crop: {
            originX: Math.round(cropOriginX),
            originY: Math.round(cropOriginY),
            width: Math.round(cropSizeWidth),
            height: Math.round(cropSizeHeight),
          },
        },
      ];

      if (cropConfig.width && cropConfig.height) {
        actions.push({
          resize: {
            width: cropConfig.width,
            height: cropConfig.height,
          },
        });
      }

      const manipulatorResult = await manipulateAsync(originalImage, actions, {
        compress: 1,
        format: SaveFormat.PNG,
      });

      setCroppedImage(manipulatorResult.uri);
    } catch (error) {
      console.error('Error cropping image:', error);
      Alert.alert('Cropping Error', 'Failed to crop image. Please try again.');
    }
  };

  // <--- NEW FUNCTION TO SAVE IMAGE
  const saveCroppedImage = async () => {
    if (!croppedImage) {
      Alert.alert('No Cropped Image', 'Please crop an image first to save!');
      return;
    }

    const { status } = await MediaLibrary.requestPermissionsAsync(); // Request Media Library write permissions
    if (status !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'Sorry, we need access to your photo library to save the image!'
      );
      return;
    }

    try {
      const asset = await MediaLibrary.createAssetAsync(croppedImage);
      Alert.alert('Success!', 'Cropped image saved to your photos!');
      console.log('Image saved as asset:', asset);
    } catch (error) {
      console.error('Error saving image:', error);
      Alert.alert('Save Error', 'Failed to save image. Please try again.');
    }
  };
  // NEW FUNCTION ENDS --->

  return (
    <ScrollView
      className='flex-1 bg-[#f8f8f8]' // Tailwind for scrollView background and flex
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }} // Kept inline for flexGrow and specific padding
    >
      <Text className='font-rubik-bold text-3xl mb-5'>
        Image Viewer & Cropper
      </Text>

      <Button title='Pick a New Image' onPress={pickImage} />

      {originalImage && (
        <View
          className='w-full items-center mt-8 p-4 bg-white rounded-xl shadow-lg' // Combined Tailwind for imageSection
        >
          <Text className='font-rubik-medium text-xl mb-3'>
            Original Image:
          </Text>
          <Image
            source={{ uri: originalImage }}
            style={{
              width: IMAGE_DISPLAY_SIZE,
              height: IMAGE_DISPLAY_SIZE,
              backgroundColor: '#eee',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#ddd',
            }} // Kept inline/StyleSheet for dynamic size and specific border/background
            resizeMode='contain'
          />

          <Text className='font-rubik-medium text-lg mt-6 mb-2'>
            Apply a Crop:
          </Text>
          <View className='flex-row flex-wrap justify-center gap-2.5 w-full'>
            {Object.keys(DEFAULT_CROPS).map((key) => (
              <View key={key} className='m-1'>
                <Button
                  title={`Crop ${key.replace(/([A-Z])/g, ' $1').trim()}`} // Re-added more descriptive title
                  onPress={() => cropImage(key as keyof typeof DEFAULT_CROPS)}
                />
              </View>
            ))}
          </View>
        </View>
      )}

      {croppedImage && (
        <View
          className='w-full items-center mt-8 p-4 bg-white rounded-xl shadow-lg' // Tailwind for imageSection
        >
          <Text className='font-rubik-bold text-xl mb-3'>Cropped Result:</Text>
          <Image
            source={{ uri: croppedImage }}
            style={{
              width: IMAGE_DISPLAY_SIZE,
              height: IMAGE_DISPLAY_SIZE,
              backgroundColor: '#eee',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#ddd',
            }} // Kept inline/StyleSheet for dynamic size and specific border/background
            resizeMode='contain'
          />
          {/* <Button title='Crop Another Way' onPress={() => setCroppedImage(null)} /> */}{' '}
          {/* You can keep or remove this, I'm replacing it with new save button structure */}
          {/* <--- NEW BUTTONS FOR SAVING AND RE-CROPPING */}
          <View className='flex-row justify-center gap-4 mt-4 w-full'>
            <Button
              title='Save to Photos'
              onPress={saveCroppedImage}
            />
            <Button
              title='Reset Crop'
              onPress={() => setCroppedImage(null)}
            />
          </View>
          {/* NEW BUTTONS ENDS ---> */}
        </View>
      )}

      {!originalImage && !croppedImage && (
        <Text className='font-rubik-light text-base mt-10 text-center text-gray-600'>
          Tap "Pick a New Image" to start viewing and cropping!
        </Text>
      )}
    </ScrollView>
  );
}
