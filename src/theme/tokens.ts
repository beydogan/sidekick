/**
 * Design Tokens - Single source of truth
 * macOS-native aesthetic for App Store Connect management
 */

export const colors = {
  // Backgrounds
  sidebar: '#F5F5F7',
  sidebarBorder: '#E5E5E7',
  content: '#FFFFFF',

  // Selection & Interaction
  selection: 'rgba(0, 0, 0, 0.06)',
  selectionHover: 'rgba(0, 0, 0, 0.04)',
  activeAccent: '#007AFF',

  // Text
  textPrimary: '#1D1D1F',
  textSecondary: '#86868B',
  textTertiary: '#AEAEB2',

  // UI Elements
  border: '#E5E5E7',
  borderLight: '#F0F0F2',
  divider: '#D2D2D7',

  // Dropdown
  dropdownBackground: '#FFFFFF',
  dropdownShadow: 'rgba(0, 0, 0, 0.15)',
  dropdownBorder: '#E5E5E7',

  // Icons
  iconDefault: '#86868B',
  iconSelected: '#1D1D1F',

  // Semantic
  primary: '#007AFF',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radii = {
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  round: 9999,
} as const;

export const typography = {
  title: {
    fontSize: 20,
    fontWeight: '600' as const,
    letterSpacing: -0.4,
  },
  headline: {
    fontSize: 17,
    fontWeight: '600' as const,
    letterSpacing: -0.4,
  },
  body: {
    fontSize: 13,
    fontWeight: '400' as const,
    letterSpacing: -0.08,
  },
  bodyMedium: {
    fontSize: 13,
    fontWeight: '500' as const,
    letterSpacing: -0.08,
  },
  caption: {
    fontSize: 11,
    fontWeight: '400' as const,
    letterSpacing: 0.06,
  },
  menuItem: {
    fontSize: 13,
    fontWeight: '400' as const,
    letterSpacing: -0.08,
  },
  menuItemSelected: {
    fontSize: 13,
    fontWeight: '500' as const,
    letterSpacing: -0.08,
  },
} as const;

export const layout = {
  sidebarWidth: 240,
  aiSidebarWidth: 320,
  globalHeaderHeight: 36,
  sidebarPadding: 12,
  menuItemHeight: 32,
  contentPadding: 24,
} as const;

export const zIndex = {
  base: 0,
  dropdown: 100,
  modal: 200,
  toast: 300,
} as const;
