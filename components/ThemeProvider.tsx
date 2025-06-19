import { colors, fontFamilies, fontSizes, fontWeights } from '@/theme';
import { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

type Theme = 'light' | 'dark';

interface ThemeContextProps {
  theme: Theme;
  colors: typeof colors.light;
  fonts: {
    families: typeof fontFamilies;
    sizes: typeof fontSizes;
    weights: typeof fontWeights;
  };
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemTheme = useColorScheme() || 'light';
  const [theme, setTheme] = useState<Theme>(systemTheme);

  useEffect(() => {
    setTheme(systemTheme);
  }, [systemTheme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const themeColors = theme === 'light' ? colors.light : colors.dark;

  const value = {
    theme,
    colors: themeColors,
    fonts: {
      families: fontFamilies,
      sizes: fontSizes,
      weights: fontWeights,
    },
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
