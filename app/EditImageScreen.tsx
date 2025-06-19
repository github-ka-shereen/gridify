// app/EditImageScreen.tsx
import { useTheme } from '@/components/ThemeProvider';
import { Button } from '@/components/ui/Button';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  Action,
  FlipType,
  manipulateAsync,
  SaveFormat,
} from 'expo-image-manipulator'; // <--- ADD FlipType here
import * as MediaLibrary from 'expo-media-library';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
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
const IMAGE_DISPLAY_SIZE = screenWidth * 0.9;

export default function EditImageScreen() {
  const { imageUri } = useLocalSearchParams();
  const [currentImageUri, setCurrentImageUri] = useState<string | null>(null);
  const [originalLoadedImageUri, setOriginalLoadedImageUri] = useState<
    string | null
  >(null);
  const [activeTool, setActiveTool] = useState<
    'none' | 'crop' | 'rotate' | 'filter'
  >('none');
  const { colors } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (typeof imageUri === 'string') {
      setCurrentImageUri(imageUri);
      setOriginalLoadedImageUri(imageUri);
    }
  }, [imageUri]);

  const applyManipulation = async (actions: Action[]) => {
    if (!currentImageUri) {
      Alert.alert('No Image', 'Nothing to manipulate.');
      return;
    }

    try {
      const result = await manipulateAsync(currentImageUri, actions, {
        compress: 1,
        format: SaveFormat.PNG,
      });
      setCurrentImageUri(result.uri);
    } catch (error) {
      console.error('Error applying manipulation:', error);
      Alert.alert('Error', 'Failed to apply changes. Please try again.');
    }
  };

  const handleRotate = async () => {
    await applyManipulation([{ rotate: 90 }]);
  };

  const handleFlip = async (direction: 'horizontal' | 'vertical') => {
    // FIX: Use FlipType.Horizontal or FlipType.Vertical
    await applyManipulation([
      {
        flip:
          direction === 'horizontal' ? FlipType.Horizontal : FlipType.Vertical,
      },
    ]);
  };

  const handleCrop = async (
    cropPreset: 'square' | 'portrait' | 'landscape' | 'reset'
  ) => {
    if (!originalLoadedImageUri) {
      Alert.alert(
        'No Image',
        'Cannot perform crop: original image not loaded.'
      );
      return;
    }

    try {
      const originalImageInfo = await manipulateAsync(
        originalLoadedImageUri,
        [],
        { compress: 1, format: SaveFormat.PNG }
      );
      const originalWidth = originalImageInfo.width;
      const originalHeight = originalImageInfo.height;

      if (cropPreset === 'reset') {
        setCurrentImageUri(originalLoadedImageUri);
        return;
      }

      let targetRatio;
      switch (cropPreset) {
        case 'square':
          targetRatio = 1;
          break;
        case 'portrait':
          targetRatio = 3 / 4;
          break;
        case 'landscape':
          targetRatio = 4 / 3;
          break;
        default:
          targetRatio = originalWidth / originalHeight; // Should not happen with defined presets
      }

      let cropWidth = originalWidth;
      let cropHeight = originalHeight;

      if (originalWidth / originalHeight > targetRatio) {
        cropWidth = originalHeight * targetRatio;
      } else {
        cropHeight = originalWidth / targetRatio;
      }

      const originX = (originalWidth - cropWidth) / 2;
      const originY = (originalHeight - cropHeight) / 2;

      const result = await manipulateAsync(
        originalLoadedImageUri,
        [
          {
            crop: {
              originX: Math.round(originX),
              originY: Math.round(originY),
              width: Math.round(cropWidth),
              height: Math.round(cropHeight),
            },
          },
        ],
        { compress: 1, format: SaveFormat.PNG }
      );

      setCurrentImageUri(result.uri);
    } catch (error) {
      console.error('Error during cropping:', error);
      Alert.alert('Crop Error', 'Failed to crop image. Please try again.');
    }
  };

  const applyFilter = async (filterType: string) => {
    if (!currentImageUri) return;
    Alert.alert('Filter Applied', `Applied ${filterType} filter.`);
    // In a real scenario, you'd integrate a proper image filtering library
    // or apply specific `expo-image-manipulator` adjustments if available.
  };

  const handleSaveCopy = async () => {
    if (!currentImageUri) {
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
      await MediaLibrary.createAssetAsync(currentImageUri);
      Alert.alert('Saved!', 'Image saved successfully.');
      router.back();
    } catch (error) {
      console.error('Error saving image:', error);
      Alert.alert('Save Error', 'Failed to save image. Please try again.');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const renderFilterPreview = (
    filterName: string,
    uri: string,
    onPress: () => void
  ) => (
    <TouchableOpacity onPress={onPress} className='items-center mx-2'>
      <Image
        source={{ uri: uri }}
        className='w-[70px] h-[70px] rounded-full mb-1 bg-gray-200 border border-gray-300'
      />
      <Text
        className='font-rubik-regular text-xs'
        style={{ color: colors.foreground }}
      >
        {filterName}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className='flex-1' style={{ backgroundColor: colors.background }}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: '',
          headerLeft: () => (
            <TouchableOpacity onPress={handleCancel} className='px-4'>
              <Text
                className='font-rubik-medium text-base'
                style={{ color: colors.primary }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleSaveCopy} className='px-4'>
              <Text
                className='font-rubik-medium text-base'
                style={{ color: colors.primary }}
              >
                Save Copy
              </Text>
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: colors.card,
            // Removed borderBottomWidth and borderBottomColor from here
            // to avoid TypeScript errors with headerStyle prop.
          },
        }}
      />

      <ScrollView contentContainerStyle={styles.imageContainer}>
        {currentImageUri ? (
          <Image
            source={{ uri: currentImageUri }}
            className='w-[90%] h-[90%] bg-gray-200 rounded-lg border border-gray-300'
            resizeMode='contain'
          />
        ) : (
          <View className='flex-1 justify-center items-center'>
            <Text className='font-rubik-regular text-base text-muted-foreground'>
              No image to edit.
            </Text>
          </View>
        )}
      </ScrollView>

      <View
        className='py-4 border-t'
        style={{ backgroundColor: colors.card, borderTopColor: colors.border }}
      >
        <View className='flex-row justify-around pb-2'>
          <TouchableOpacity
            onPress={() => setActiveTool('rotate')}
            className='items-center px-2 py-1'
            style={
              activeTool === 'rotate'
                ? { borderBottomColor: colors.primary, borderBottomWidth: 2 }
                : {}
            }
          >
            <MaterialCommunityIcons
              name='rotate-right'
              size={24}
              color={
                activeTool === 'rotate' ? colors.primary : colors.foreground
              }
            />
            <Text
              className='font-rubik-regular text-xs mt-1'
              style={{
                color:
                  activeTool === 'rotate' ? colors.primary : colors.foreground,
              }}
            >
              Rotate
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTool('crop')}
            className='items-center px-2 py-1'
            style={
              activeTool === 'crop'
                ? { borderBottomColor: colors.primary, borderBottomWidth: 2 }
                : {}
            }
          >
            <MaterialCommunityIcons
              name='crop'
              size={24}
              color={activeTool === 'crop' ? colors.primary : colors.foreground}
            />
            <Text
              className='font-rubik-regular text-xs mt-1'
              style={{
                color:
                  activeTool === 'crop' ? colors.primary : colors.foreground,
              }}
            >
              Crop
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTool('filter')}
            className='items-center px-2 py-1'
            style={
              activeTool === 'filter'
                ? { borderBottomColor: colors.primary, borderBottomWidth: 2 }
                : {}
            }
          >
            <MaterialCommunityIcons
              name='filter-outline'
              size={24}
              color={
                activeTool === 'filter' ? colors.primary : colors.foreground
              }
            />
            <Text
              className='font-rubik-regular text-xs mt-1'
              style={{
                color:
                  activeTool === 'filter' ? colors.primary : colors.foreground,
              }}
            >
              Filters
            </Text>
          </TouchableOpacity>
        </View>

        {activeTool === 'rotate' && (
          <View
            className='flex-row flex-wrap justify-center px-2 py-2 border-t'
            style={{ borderColor: colors.border }}
          >
            <Button
              title='Rotate 90°'
              onPress={handleRotate}
              className='mx-1 my-1'
            />
            <Button
              title='Flip Horizontal'
              onPress={() => handleFlip('horizontal')}
              className='mx-1 my-1'
            />
            <Button
              title='Flip Vertical'
              onPress={() => handleFlip('vertical')}
              className='mx-1 my-1'
            />
          </View>
        )}

        {activeTool === 'crop' && (
          <View
            className='flex-row flex-wrap justify-center px-2 py-2 border-t'
            style={{ borderColor: colors.border }}
          >
            <Button
              title='Square (1:1)'
              onPress={() => handleCrop('square')}
              className='mx-1 my-1'
            />
            <Button
              title='Portrait (3:4)'
              onPress={() => handleCrop('portrait')}
              className='mx-1 my-1'
            />
            <Button
              title='Landscape (4:3)'
              onPress={() => handleCrop('landscape')}
              className='mx-1 my-1'
            />
            <Button
              title='Reset Crop'
              onPress={() => handleCrop('reset')}
              className='mx-1 my-1'
            />
          </View>
        )}

        {activeTool === 'filter' && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className='py-2 border-t'
            style={{ borderColor: colors.border }}
          >
            {renderFilterPreview('Original', originalLoadedImageUri || '', () =>
              setCurrentImageUri(originalLoadedImageUri)
            )}
            {renderFilterPreview(
              'Vivid',
              'https://via.placeholder.com/100?text=Vivid',
              () => applyFilter('Vivid')
            )}
            {renderFilterPreview(
              'Playa',
              'https://via.placeholder.com/100?text=Playa',
              () => applyFilter('Playa')
            )}
            {renderFilterPreview(
              'Honey',
              'https://via.placeholder.com/100?text=Honey',
              () => applyFilter('Honey')
            )}
            {renderFilterPreview(
              'Isla',
              'https://via.placeholder.com/100?text=Isla',
              () => applyFilter('Isla')
            )}
            {/* Add more filter previews as needed, ensure you have image URIs for them */}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
});
