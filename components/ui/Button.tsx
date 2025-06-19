import React from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../ThemeProvider';
import { cn } from '../../lib';

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title?: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
  textClassName?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  loaderColor?: string;
  children?: React.ReactNode;
}

const fontSizeMap: Record<ButtonSize, number> = {
  sm: 14,
  md: 16,
  lg: 18,
};

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  className = '',
  textClassName = '',
  style,
  textStyle,
  loaderColor,
  children,
}: ButtonProps) => {
  const { colors } = useTheme();
  const isDisabled = disabled || loading;

  const getLoaderColor = () => {
    if (loaderColor) return loaderColor;
    switch (variant) {
      case 'primary':
        return colors.primaryForeground || '#ffffff';
      case 'secondary':
        return colors.secondaryForeground || '#ffffff';
      case 'destructive':
        return '#ffffff';
      case 'outline':
      case 'ghost':
        return colors.primary || '#000000';
      default:
        return '#ffffff';
    }
  };

  const variantClasses = cn(
    'rounded-lg flex-row items-center justify-center',
    {
      'bg-primary': variant === 'primary',
      'bg-secondary': variant === 'secondary',
      'bg-destructive': variant === 'destructive',
      'border border-border bg-transparent': variant === 'outline',
      'bg-transparent': variant === 'ghost',
    },
    isDisabled && 'opacity-50',
    className
  );

  const sizeClasses = cn({
    'px-3 py-1.5': size === 'sm',
    'px-4 py-2': size === 'md',
    'px-6 py-3': size === 'lg',
  });

  const textClasses = cn(
    'font-rubik-medium',
    {
      'text-white':
        variant === 'primary' ||
        variant === 'secondary' ||
        variant === 'destructive',
      'text-foreground': variant === 'outline' || variant === 'ghost',
    },
    textClassName
  );

  return (
    <TouchableOpacity
      className={cn(variantClasses, sizeClasses)}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={style}
    >
      {loading && (
        <ActivityIndicator
          color={getLoaderColor()}
          size={size === 'lg' ? 'large' : 'small'}
          className='mr-2'
        />
      )}
      {!loading && icon && <View className='mr-2'>{icon}</View>}

      {children ? (
        children
      ) : (
        <Text
          className={textClasses}
          style={{
            fontSize: fontSizeMap[size],
            fontFamily: 'Rubik-Medium',
            ...textStyle,
          }}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
