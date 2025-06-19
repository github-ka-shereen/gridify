import { useTheme } from '@/components/ThemeProvider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TabLayout() {
  const { colors } = useTheme();
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  // Corrected Type: 'string' is fine here as router.push accepts string paths
  // However, defining a union type is good for type safety if you only navigate to specific modals
  type AppRoute = '(modals)/settings' | '(modals)/trash';

  const handleMenuItemPress = (screen: AppRoute) => {
    setMenuVisible(false); // Hide menu after selection
    router.push(screen as any); // No need for `as any` if AppRoute is correctly defined
  };

  const DropdownMenu = () => (
    <View
      style={[
        styles.dropdownMenu,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <TouchableOpacity
        onPress={() => handleMenuItemPress('(modals)/settings')}
        style={styles.menuItem}
      >
        <MaterialCommunityIcons
          name='cog'
          size={20}
          color={colors.foreground}
          style={styles.menuIcon}
        />
        <Text style={[styles.menuText, { color: colors.foreground }]}>
          Settings
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleMenuItemPress('(modals)/trash')}
        style={styles.menuItem}
      >
        <MaterialCommunityIcons
          name='delete'
          size={20}
          color={colors.foreground}
          style={styles.menuIcon}
        />
        <Text style={[styles.menuText, { color: colors.foreground }]}>
          Trash
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: 60,
          paddingBottom: 5,
        },
        tabBarLabelStyle: {
          fontFamily: 'Rubik-Medium',
          fontSize: 12,
        },
        headerStyle: {
          backgroundColor: colors.card,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.border,
        },
        headerTitleStyle: {
          color: colors.foreground,
          fontFamily: 'Rubik-Bold',
          fontSize: 22,
        },
        headerTitleAlign: 'left',
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name='photos/index' // Correct: This maps to app/(tabs)/photos/index.tsx
        options={{
          title: 'Gallery', // Header title for the Photos tab
          tabBarLabel: 'Photos',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name='image-multiple'
              color={color}
              size={24}
            />
          ),
          headerRight: () => (
            <View>
              <TouchableOpacity
                onPress={toggleMenu}
                style={styles.headerIconContainer}
              >
                <MaterialCommunityIcons
                  name='dots-vertical'
                  size={24}
                  color={colors.foreground}
                />
              </TouchableOpacity>
              {menuVisible && <DropdownMenu />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name='folders/index' // Correct: This maps to app/(tabs)/folders/index.tsx
        options={{
          title: 'Folders', // Header title for the Folders tab
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name='folder-multiple'
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerIconContainer: {
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 40, // Adjust this value to position correctly below the icon
    right: 10,
    borderRadius: 8,
    borderWidth: 1,
    elevation: 3, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 }, // For iOS shadow
    shadowOpacity: 0.1, // For iOS shadow
    shadowRadius: 4, // For iOS shadow
    minWidth: 150,
    zIndex: 1000, // Ensure it appears above other content
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  menuIcon: {
    marginRight: 10,
  },
  menuText: {
    fontFamily: 'Rubik-Regular',
    fontSize: 16,
  },
});
