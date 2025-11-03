export interface ColorPalette {
  green: string;
  yellow: string;
  white: string;
}

export interface SecondaryColorPalette {
  peacefulGreen: string;
  wishYellow: string;
  mountainMist: string;
  clearSky: string;
}

export interface UIColors {
  background: string;
  backgroundSecondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface TextColors {
  primary: string;
  secondary: string;
  light: string;
  white: string;
  onPrimary: string;
  onYellow: string;
}

export interface BorderColors {
  light: string;
  medium: string;
  dark: string;
}

export interface ShadowColors {
  light: string;
  medium: string;
  dark: string;
}

export interface Colors {
  primary: ColorPalette;
  secondary: SecondaryColorPalette;
  ui: UIColors;
  text: TextColors;
  border: BorderColors;
  shadow: ShadowColors;
}

export interface FontFamilies {
  regular: string;
  medium: string;
  bold: string;
  light: string;
}

export interface FontSizes {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  xxxl: number;
  display: number;
}

export interface FontWeights {
  light: '300';
  regular: '400';
  medium: '500';
  semibold: '600';
  bold: '700';
}

export interface LineHeights {
  tight: number;
  normal: number;
  relaxed: number;
}

export interface Typography {
  fonts: FontFamilies;
  sizes: FontSizes;
  weights: FontWeights;
  lineHeights: LineHeights;
}

export interface Spacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  xxxl: number;
}

export interface BorderRadius {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
}

export interface Shadow {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

export interface Shadows {
  sm: Shadow;
  md: Shadow;
  lg: Shadow;
  xl: Shadow;
}

export interface ButtonStyle {
  backgroundColor: string;
  color: string;
  borderRadius: number;
  paddingVertical: number;
  paddingHorizontal: number;
  borderWidth?: number;
  borderColor?: string;
}

export interface ButtonVariants {
  primary: ButtonStyle;
  secondary: ButtonStyle;
  outline: ButtonStyle;
  ghost: Omit<ButtonStyle, 'backgroundColor'> & { backgroundColor: string };
}

export interface CardStyle {
  backgroundColor: string;
  borderRadius: number;
  padding: number;
  shadowColor?: string;
  shadowOffset?: { width: number; height: number };
  shadowOpacity?: number;
  shadowRadius?: number;
  elevation?: number;
  borderWidth?: number;
  borderColor?: string;
}

export interface CardVariants {
  default: CardStyle;
  highlighted: CardStyle;
}

export interface InputStyle {
  backgroundColor: string;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  paddingVertical: number;
  paddingHorizontal: number;
  fontSize: number;
  color: string;
}

export interface InputVariants {
  default: InputStyle;
  focused: Partial<InputStyle>;
  error: Partial<InputStyle>;
}

export interface BadgeStyle {
  backgroundColor: string;
  color: string;
  borderRadius: number;
  paddingVertical: number;
  paddingHorizontal: number;
}

export interface BadgeVariants {
  success: BadgeStyle;
  warning: BadgeStyle;
  neutral: BadgeStyle;
}

export interface Components {
  button: ButtonVariants;
  card: CardVariants;
  input: InputVariants;
  badge: BadgeVariants;
}

export interface ScreenColors {
  headerBackground: string;
  headerText: string;
  background: string;
}

export interface CalendarColors extends Omit<ScreenColors, 'headerBackground' | 'headerText'> {
  todayHighlight: string;
  selectedDate: string;
  streak: string;
}

export interface JournalColors extends Omit<ScreenColors, 'headerBackground' | 'headerText'> {
  headerAccent: string;
  moodPositive: string;
  moodNeutral: string;
}

export interface ProfileColors {
  headerGradientStart: string;
  headerGradientEnd: string;
  sectionBackground: string;
  background: string;
}

export interface Screens {
  home: ScreenColors;
  calendar: CalendarColors;
  journal: JournalColors;
  profile: ProfileColors;
}

export interface Theme {
  colors: Colors;
  typography: Typography;
  spacing: Spacing;
  borderRadius: BorderRadius;
  shadows: Shadows;
  components: Components;
  screens: Screens;
}

// Primary Colors
export const colors: Colors = {
  primary: {
    green: '#40ae49',
    yellow: '#febe10',
    white: '#ffffff',
  },

  secondary: {
    peacefulGreen: '#88c78d',
    wishYellow: '#fcebb4',
    mountainMist: '#d4dcc4',
    clearSky: '#f2f2f2',
  },

  ui: {
    background: '#ffffff',
    backgroundSecondary: '#f2f2f2',
    success: '#40ae49',
    warning: '#febe10',
    error: '#d32f2f',
    info: '#88c78d',
  },

  text: {
    primary: '#2c3e50',
    secondary: '#5a6c7d',
    light: '#8e9eab',
    white: '#ffffff',
    onPrimary: '#ffffff',
    onYellow: '#2c3e50',
  },

  border: {
    light: '#e0e0e0',
    medium: '#d4dcc4',
    dark: '#88c78d',
  },

  shadow: {
    light: 'rgba(64, 174, 73, 0.1)',
    medium: 'rgba(64, 174, 73, 0.2)',
    dark: 'rgba(64, 174, 73, 0.3)',
  },
};

// Typography
export const typography: Typography = {
  fonts: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    light: 'System',
  },

  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 40,
  },

  weights: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// Spacing Scale
export const spacing: Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Border Radius
export const borderRadius: BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

// Shadows
export const shadows: Shadows = {
  sm: {
    shadowColor: colors.primary.green,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: colors.primary.green,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.0,
    elevation: 3,
  },
  lg: {
    shadowColor: colors.primary.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.23,
    shadowRadius: 4.65,
    elevation: 5,
  },
  xl: {
    shadowColor: colors.primary.green,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 7.84,
    elevation: 8,
  },
};

// Component Specific Styles
export const components: Components = {
  button: {
    primary: {
      backgroundColor: colors.primary.green,
      color: colors.text.white,
      borderRadius: borderRadius.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
    },
    secondary: {
      backgroundColor: colors.primary.yellow,
      color: colors.text.onYellow,
      borderRadius: borderRadius.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: colors.primary.green,
      color: colors.primary.green,
      borderRadius: borderRadius.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: colors.primary.green,
      borderRadius: borderRadius.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
    },
  },

  card: {
    default: {
      backgroundColor: colors.ui.background,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      ...shadows.md,
    },
    highlighted: {
      backgroundColor: colors.secondary.clearSky,
      borderRadius: borderRadius.lg,
      borderWidth: 2,
      borderColor: colors.secondary.peacefulGreen,
      padding: spacing.md,
      ...shadows.sm,
    },
  },

  input: {
    default: {
      backgroundColor: colors.ui.background,
      borderWidth: 1,
      borderColor: colors.border.medium,
      borderRadius: borderRadius.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      fontSize: typography.sizes.md,
      color: colors.text.primary,
    },
    focused: {
      borderColor: colors.primary.green,
      borderWidth: 2,
    },
    error: {
      borderColor: colors.ui.error,
    },
  },

  badge: {
    success: {
      backgroundColor: colors.secondary.peacefulGreen,
      color: colors.text.white,
      borderRadius: borderRadius.full,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
    },
    warning: {
      backgroundColor: colors.secondary.wishYellow,
      color: colors.text.onYellow,
      borderRadius: borderRadius.full,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
    },
    neutral: {
      backgroundColor: colors.secondary.mountainMist,
      color: colors.text.primary,
      borderRadius: borderRadius.full,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
    },
  },
};

// Screen-specific color schemes
export const screens: Screens = {
  home: {
    headerBackground: colors.primary.green,
    headerText: colors.text.white,
    background: colors.ui.backgroundSecondary,
  },
  calendar: {
    todayHighlight: colors.primary.green,
    selectedDate: colors.primary.yellow,
    streak: colors.secondary.peacefulGreen,
    background: colors.ui.background,
  },
  journal: {
    headerAccent: colors.secondary.peacefulGreen,
    moodPositive: colors.primary.green,
    moodNeutral: colors.primary.yellow,
    background: colors.ui.background,
  },
  profile: {
    headerGradientStart: colors.primary.green,
    headerGradientEnd: colors.secondary.peacefulGreen,
    sectionBackground: colors.secondary.clearSky,
    background: colors.ui.background,
  },
};

// Export default theme object
const theme: Theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  components,
  screens,
};

export default theme;