// app/(modals)/trash.tsx
import { useTheme } from '@/components/ThemeProvider';
import { Button } from '@/components/ui/Button'; // Assuming your Button component path
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function TrashScreen() {
  const { colors } = useTheme();

  // Placeholder for trash content or empty state
  const isEmpty = true; // Set to false to see the other state

  return (
    <ScrollView
      className='flex-1 p-4'
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      style={{ backgroundColor: colors.background }}
    >
      {isEmpty ? (
        <View style={styles.emptyContainer}>
          {/* Replace with your actual trash icon image */}
          <Image
            source={require('@/assets/trash_balloons.png')} // Example: put a trash icon image here
            style={styles.emptyImage}
            resizeMode='contain'
          />
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
            Nothing in trash.
          </Text>
          <Text
            style={[styles.emptyDescription, { color: colors.mutedForeground }]}
          >
            Photos & videos you delete will appear here. They'll be removed
            after 30 days.{' '}
            <Text
              style={{ color: colors.primary, textDecorationLine: 'underline' }}
            >
              Learn more.
            </Text>
          </Text>
        </View>
      ) : (
        <View style={styles.contentContainer}>
          <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
            Items in the trash will be removed after 30 days.{' '}
            <Text
              style={{ color: colors.primary, textDecorationLine: 'underline' }}
            >
              Learn more.
            </Text>
          </Text>
          {/* Example: Display a trash item */}
          <View
            style={[
              styles.trashItem,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Image
              source={{ uri: 'https://via.placeholder.com/150' }} // Replace with actual image URI
              style={styles.trashImage}
              resizeMode='cover'
            />
            <View style={styles.itemDetails}>
              <Text style={[styles.itemTitle, { color: colors.foreground }]}>
                Deleted Photo 1
              </Text>
              <Text
                style={[styles.itemSize, { color: colors.mutedForeground }]}
              >
                2.5 MB
              </Text>
            </View>
            <View style={styles.itemActions}>
              <Button
                title='Restore'
                size='sm'
                variant='outline'
                className='mb-2'
                onPress={() => Alert.alert('Restore')}
              />
              <Button
                title='Delete'
                size='sm'
                variant='destructive'
                onPress={() => Alert.alert('Permanently Delete')}
              />
            </View>
          </View>
          {/* Add more trash items here */}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  emptyTitle: {
    fontFamily: 'Rubik-Bold',
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyDescription: {
    fontFamily: 'Rubik-Regular',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  contentContainer: {
    width: '100%',
    paddingBottom: 20,
  },
  infoText: {
    fontFamily: 'Rubik-Regular',
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
  },
  trashItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  trashImage: {
    width: 80,
    height: 80,
    borderRadius: 6,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontFamily: 'Rubik-Medium',
    fontSize: 16,
    marginBottom: 4,
  },
  itemSize: {
    fontFamily: 'Rubik-Regular',
    fontSize: 12,
  },
  itemActions: {
    marginLeft: 10,
    alignItems: 'flex-end',
  },
});
