/**
 * Enhanced Pressable with hover state support
 */

import React, {useState, useCallback} from 'react';
import {
  Pressable as RNPressable,
  PressableProps as RNPressableProps,
  ViewStyle,
  StyleProp,
  StyleSheet,
} from 'react-native';

interface PressableProps extends Omit<RNPressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  hoverStyle?: StyleProp<ViewStyle>;
  pressedStyle?: StyleProp<ViewStyle>;
}

export const Pressable: React.FC<PressableProps> = ({
  style,
  hoverStyle,
  pressedStyle,
  children,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const handleHoverIn = useCallback(() => setIsHovered(true), []);
  const handleHoverOut = useCallback(() => setIsHovered(false), []);
  const handlePressIn = useCallback(() => setIsPressed(true), []);
  const handlePressOut = useCallback(() => setIsPressed(false), []);

  return (
    <RNPressable
      onHoverIn={handleHoverIn}
      onHoverOut={handleHoverOut}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.base, style, isHovered && hoverStyle, isPressed && pressedStyle]}
      {...props}>
      {children}
    </RNPressable>
  );
};

// Fix RN macOS bug with NULL CGColor for shadows
const styles = StyleSheet.create({
  base: {
    cursor: 'default' as 'auto',
    shadowColor: '#000',
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: {width: 0, height: 0},
  },
});
