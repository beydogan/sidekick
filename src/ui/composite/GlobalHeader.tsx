/**
 * GlobalHeader - App-wide header with AI assistant toggle
 */

import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Sparkles} from 'lucide-react-native';
import {colors, layout, spacing} from '../../theme';
import {Pressable} from '../primitives';

interface GlobalHeaderProps {
  aiVisible: boolean;
  onToggleAI: () => void;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  aiVisible,
  onToggleAI,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.dragRegion} />
      <Pressable
        style={[styles.aiButton, aiVisible && styles.aiButtonActive]}
        hoverStyle={styles.aiButtonHover}
        onPress={onToggleAI}>
        <Sparkles
          size={14}
          color={aiVisible ? colors.activeAccent : colors.textSecondary}
          strokeWidth={2}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: layout.globalHeaderHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.md,
    backgroundColor: colors.sidebar,
    borderBottomWidth: 1,
    borderBottomColor: colors.sidebarBorder,
  },
  dragRegion: {
    flex: 1,
  },
  aiButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiButtonHover: {
    backgroundColor: colors.selection,
  },
  aiButtonActive: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
});
