// app/photos/index.tsx (Example snippet)
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert, // For showing permission alerts
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { useTheme } from '@/components/ThemeProvider';
import { Stack, useRouter } from 'expo-router'; // Assuming you still have Stack for header

const { width } = Dimensions.get('window');
const IMAGE_SIZE = (width - 6) / 3; // 3 images per row with 2px margin

export default function ImageGalleryScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      // Request permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(status === 'granted');

      if (status === 'granted') {
        // Get assets from the entire library (not just a specific album by default)
        const media = await MediaLibrary.getAssetsAsync({
          first: 50, // Fetch the first 50 assets
          sortBy: [MediaLibrary.SortBy.creationTime], // Sort by creation time (newest first)
          mediaType: [MediaLibrary.MediaType.photo], // Only photos
        });
        setAssets(media.assets);
      }
      setLoading(false);
    })();
  }, []);

  const renderItem = ({ item }: { item: MediaLibrary.Asset }) => (
    <TouchableOpacity
      className='m-px'
      onPress={() =>
        router.push({
          pathname: '/ViewImageScreen',
          params: { imageUri: item.uri },
        })
      }
    >
      <Image source={{ uri: item.uri }} style={styles.imageThumbnail} />
    </TouchableOpacity>
  );

  if (hasPermission === null) {
    return (
      <View
        className='flex-1 justify-center items-center'
        style={{ backgroundColor: colors.background }}
      >
        <ActivityIndicator size='large' color={colors.primary} />
        <Text className='mt-4 text-base' style={{ color: colors.foreground }}>
          Requesting media library permission...
        </Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View
        className='flex-1 justify-center items-center p-5'
        style={{ backgroundColor: colors.background }}
      >
        <Text
          className='text-lg font-rubik-medium text-center'
          style={{ color: colors.destructive }}
        >
          Permission to access media library denied.
        </Text>
        <Text
          className='mt-4 text-base text-center'
          style={{ color: colors.mutedForeground }}
        >
          Please enable media library permissions in your device settings to use
          this app.
        </Text>
        <TouchableOpacity
          className='mt-5 px-4 py-2 rounded-md'
          style={{ backgroundColor: colors.primary }}
          onPress={() =>
            MediaLibrary.requestPermissionsAsync().then(({ status }) =>
              setHasPermission(status === 'granted')
            )
          }
        >
          <Text className='text-white font-rubik-medium'>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View
        className='flex-1 justify-center items-center'
        style={{ backgroundColor: colors.background }}
      >
        <ActivityIndicator size='large' color={colors.primary} />
        <Text className='mt-4 text-base' style={{ color: colors.foreground }}>
          Loading photos...
        </Text>
      </View>
    );
  }

  return (
    <View className='flex-1' style={{ backgroundColor: colors.background }}>
      {/* The Stack.Screen options are now managed by app/(tabs)/_layout.tsx */}
      {/* You should NOT have a headerRight here, as it would override the dropdown menu */}
      <Stack.Screen
        options={{
          headerShown: true, // Let the parent layout control this, but good to ensure
          title: 'Photos', // This title can be set here or in the tab layout
          // Any headerRight or headerLeft set here will override the _layout.tsx
          // So, ensure you don't have one here if you want the dropdown menu
        }}
      />

      {assets.length === 0 ? (
        <View
          className='flex-1 justify-center items-center p-5'
          style={{ backgroundColor: colors.background }}
        >
          <Text
            className='text-lg font-rubik-medium text-center'
            style={{ color: colors.mutedForeground }}
          >
            No photos found on your device.
          </Text>
        </View>
      ) : (
        <FlatList
          data={assets}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          initialNumToRender={15}
          maxToRenderPerBatch={15}
          windowSize={21}
          contentContainerStyle={styles.flatListContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  imageThumbnail: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    resizeMode: 'cover',
  },
  flatListContainer: {
    padding: 1,
  },
});
