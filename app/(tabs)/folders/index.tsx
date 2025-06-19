// app/(tabs)/folders/index.tsx
import { useTheme } from '@/components/ThemeProvider';
import { Card } from '@/components/ui/Card';
import React from 'react';
import { ScrollView, Text } from 'react-native';

export default function FoldersScreen() {
  const { colors } = useTheme();

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
      <Card
        title='Coming Soon!'
        description='This section will show your photo albums and folders.'
        className='w-full'
        titleClassName='text-center'
        descriptionClassName='text-center'
      >
        <Text
          className='font-rubik-regular text-base mt-4 text-center'
          style={{ color: colors.foreground }}
        >
          Stay tuned for updates!
        </Text>
      </Card>
    </ScrollView>
  );
}
