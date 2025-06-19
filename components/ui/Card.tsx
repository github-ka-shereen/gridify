import { cn } from '@/lib'; // Your class merging utility
import React from 'react';
import { Text, View } from 'react-native';

interface CardProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export const Card = ({
  title,
  description,
  children,
  className = '',
  headerClassName = '',
  contentClassName = '',
  titleClassName = '',
  descriptionClassName = '',
}: CardProps) => {
  return (
    <View
      className={cn(
        'rounded-xl shadow-sm border bg-card border-border',
        'shadow-foreground/5 shadow-offset-[0px/2px] shadow-radius-8',
        'elevation-2', // Android shadow
        className
      )}
    >
      {(title || description) && (
        <View className={cn('p-4 border-b border-border', headerClassName)}>
          {title && (
            <Text
              className={cn(
                'font-rubik-bold text-white mb-1 text-lg',
                titleClassName
              )}
            >
              {title}
            </Text>
          )}
          {description && (
            <Text
              className={cn(
                'font-rubik-regular text-sm text-white',
                descriptionClassName
              )}
            >
              {description}
            </Text>
          )}
        </View>
      )}

      <View className={cn('p-4', contentClassName)}>{children}</View>
    </View>
  );
};
