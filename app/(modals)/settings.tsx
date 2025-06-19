// app/(modals)/settings.tsx
import { useTheme } from '@/components/ThemeProvider';
import { Card } from '@/components/ui/Card';
import React from 'react';
import { Platform, StyleSheet, Switch, Text, View } from 'react-native';

export default function SettingsScreen() {
  const { theme, toggleTheme, colors } = useTheme();
  const [groupFaces, setGroupFaces] = React.useState(false);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Card
        title='App Settings'
        className='w-full mb-4'
        headerClassName='border-b-0 p-0' // Remove header default padding/border
        contentClassName='p-4' // Add content padding
      >
        <View style={styles.settingRow}>
          <Text style={[styles.settingText, { color: colors.foreground }]}>
            Group similar faces
          </Text>
          <Switch
            value={groupFaces}
            onValueChange={setGroupFaces}
            thumbColor={Platform.OS === 'android' ? colors.primary : ''}
            trackColor={{ false: colors.muted, true: colors.primaryForeground }}
          />
        </View>
        <Text
          style={[styles.descriptionText, { color: colors.mutedForeground }]}
        >
          See photos of your favorite people.{' '}
          <Text
            style={{ color: colors.primary, textDecorationLine: 'underline' }}
          >
            Learn more.
          </Text>
        </Text>

        <View style={styles.settingRow}>
          <Text style={[styles.settingText, { color: colors.foreground }]}>
            Dark theme
          </Text>
          <Switch
            value={theme === 'dark'}
            onValueChange={toggleTheme}
            thumbColor={Platform.OS === 'android' ? colors.primary : ''}
            trackColor={{ false: colors.muted, true: colors.primaryForeground }}
          />
        </View>
        <Text
          style={[styles.descriptionText, { color: colors.mutedForeground }]}
        >
          {theme === 'dark' ? 'On' : 'Off'}
        </Text>
      </Card>

      <Card
        title='Other Settings'
        className='w-full'
        headerClassName='border-b-0 p-0'
        contentClassName='p-4'
      >
        <Text style={[styles.linkText, { color: colors.foreground }]}>
          Submit feedback
        </Text>
        <Text style={[styles.linkText, { color: colors.foreground }]}>
          Version number{' '}
          <Text style={{ color: colors.mutedForeground }}>
            1.9.2.712403868 release (20747316#R)
          </Text>
        </Text>
        <Text style={[styles.linkText, { color: colors.foreground }]}>
          Open source licenses
        </Text>
        <Text style={[styles.linkText, { color: colors.foreground }]}>
          Privacy policy
        </Text>
        <Text style={[styles.linkText, { color: colors.foreground }]}>
          Terms of service
        </Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  settingText: {
    fontFamily: 'Rubik-Regular',
    fontSize: 16,
  },
  descriptionText: {
    fontFamily: 'Rubik-Light', // Assuming you have a light font weight
    fontSize: 14,
    marginBottom: 16,
  },
  linkText: {
    fontFamily: 'Rubik-Regular',
    fontSize: 16,
    paddingVertical: 10,
  },
});
