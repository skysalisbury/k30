import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import theme from './theme';

const { colors, typography, spacing, borderRadius, shadows } = theme;

// Define types for our style objects
interface Styles {
  // Container Styles
  container: ViewStyle;
  containerPadded: ViewStyle;
  containerCentered: ViewStyle;

  // Screen Header Styles
  headerGreen: ViewStyle;
  headerTitle: TextStyle;
  headerSubtitle: TextStyle;

  // Card Styles
  card: ViewStyle;
  cardHighlighted: ViewStyle;
  cardGreen: ViewStyle;
  cardYellow: ViewStyle;

  // Section Styles
  section: ViewStyle;
  sectionTitle: TextStyle;
  sectionSubtitle: TextStyle;

  // Text Styles
  textPrimary: TextStyle;
  textSecondary: TextStyle;
  textLight: TextStyle;
  textBold: TextStyle;
  textCenter: TextStyle;
  textWhite: TextStyle;

  // Heading Styles
  h1: TextStyle;
  h2: TextStyle;
  h3: TextStyle;
  h4: TextStyle;

  // Button Styles
  button: ViewStyle;
  buttonPrimary: ViewStyle;
  buttonSecondary: ViewStyle;
  buttonOutline: ViewStyle;
  buttonText: TextStyle;
  buttonTextSecondary: TextStyle;
  buttonTextOutline: TextStyle;
  buttonDisabled: ViewStyle;

  // Input Styles
  input: ViewStyle & TextStyle;
  inputFocused: ViewStyle;
  inputError: ViewStyle;
  inputLabel: TextStyle;
  inputHelper: TextStyle;
  inputErrorText: TextStyle;

  // List Styles
  listItem: ViewStyle;
  listItemWithBorder: ViewStyle;
  listItemTitle: TextStyle;
  listItemSubtitle: TextStyle;

  // Badge/Tag Styles
  badge: ViewStyle;
  badgeSuccess: ViewStyle;
  badgeWarning: ViewStyle;
  badgeNeutral: ViewStyle;
  badgeText: TextStyle;
  badgeTextLight: TextStyle;
  badgeTextDark: TextStyle;

  // Divider
  divider: ViewStyle;
  dividerThick: ViewStyle;

  // Spacing Utilities
  mt0: ViewStyle;
  mt1: ViewStyle;
  mt2: ViewStyle;
  mt3: ViewStyle;
  mt4: ViewStyle;
  mt5: ViewStyle;
  mb0: ViewStyle;
  mb1: ViewStyle;
  mb2: ViewStyle;
  mb3: ViewStyle;
  mb4: ViewStyle;
  mb5: ViewStyle;
  ml0: ViewStyle;
  ml1: ViewStyle;
  ml2: ViewStyle;
  ml3: ViewStyle;
  ml4: ViewStyle;
  mr0: ViewStyle;
  mr1: ViewStyle;
  mr2: ViewStyle;
  mr3: ViewStyle;
  mr4: ViewStyle;
  pt0: ViewStyle;
  pt1: ViewStyle;
  pt2: ViewStyle;
  pt3: ViewStyle;
  pt4: ViewStyle;
  pb0: ViewStyle;
  pb1: ViewStyle;
  pb2: ViewStyle;
  pb3: ViewStyle;
  pb4: ViewStyle;

  // Flex Utilities
  row: ViewStyle;
  column: ViewStyle;
  alignCenter: ViewStyle;
  alignStart: ViewStyle;
  alignEnd: ViewStyle;
  justifyCenter: ViewStyle;
  justifyBetween: ViewStyle;
  justifyAround: ViewStyle;
  justifyStart: ViewStyle;
  justifyEnd: ViewStyle;
  flex1: ViewStyle;

  // Kind30 Specific Brand Elements
  kindnessStreak: ViewStyle;
  streakNumber: TextStyle;
  streakLabel: TextStyle;
  inspirationalQuote: ViewStyle;
  quoteText: TextStyle;
  statsCard: ViewStyle;
  statsNumber: TextStyle;
  statsLabel: TextStyle;
}

export const globalStyles = StyleSheet.create<Styles>({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: colors.ui.background,
  },

  containerPadded: {
    flex: 1,
    backgroundColor: colors.ui.background,
    padding: spacing.md,
  },

  containerCentered: {
    flex: 1,
    backgroundColor: colors.ui.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },

  // Screen Header Styles
  headerGreen: {
    backgroundColor: colors.primary.green,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
  },

  headerTitle: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.text.white,
  },

  headerSubtitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.regular,
    color: colors.text.white,
    opacity: 0.9,
    marginTop: spacing.xs,
  },

  // Card Styles
  card: {
    backgroundColor: colors.ui.background,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.md,
    marginBottom: spacing.md,
  },

  cardHighlighted: {
    backgroundColor: colors.secondary.clearSky,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.secondary.peacefulGreen,
    padding: spacing.md,
    ...shadows.sm,
    marginBottom: spacing.md,
  },

  cardGreen: {
    backgroundColor: colors.primary.green,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.md,
    marginBottom: spacing.md,
  },

  cardYellow: {
    backgroundColor: colors.primary.yellow,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
    marginBottom: spacing.md,
  },

  // Section Styles
  section: {
    marginBottom: spacing.lg,
  },

  sectionTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },

  sectionSubtitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.regular,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },

  // Text Styles
  textPrimary: {
    fontSize: typography.sizes.md,
    color: colors.text.primary,
    lineHeight: typography.sizes.md * typography.lineHeights.normal,
  },

  textSecondary: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    lineHeight: typography.sizes.sm * typography.lineHeights.normal,
  },

  textLight: {
    fontSize: typography.sizes.sm,
    color: colors.text.light,
  },

  textBold: {
    fontWeight: typography.weights.bold,
  },

  textCenter: {
    textAlign: 'center',
  },

  textWhite: {
    color: colors.text.white,
  },

  // Heading Styles
  h1: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },

  h2: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },

  h3: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },

  h4: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },

  // Button Styles
  button: {
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },

  buttonPrimary: {
    backgroundColor: colors.primary.green,
  },

  buttonSecondary: {
    backgroundColor: colors.primary.yellow,
  },

  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary.green,
  },

  buttonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text.white,
  },

  buttonTextSecondary: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text.onYellow,
  },

  buttonTextOutline: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.primary.green,
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  // Input Styles
  input: {
    backgroundColor: colors.ui.background,
    borderWidth: 1,
    borderColor: colors.border.medium,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },

  inputFocused: {
    borderColor: colors.primary.green,
    borderWidth: 2,
  },

  inputError: {
    borderColor: colors.ui.error,
  },

  inputLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },

  inputHelper: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },

  inputErrorText: {
    fontSize: typography.sizes.xs,
    color: colors.ui.error,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },

  // List Styles
  listItem: {
    backgroundColor: colors.ui.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },

  listItemWithBorder: {
    backgroundColor: colors.ui.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.light,
  },

  listItemTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
  },

  listItemSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },

  // Badge/Tag Styles
  badge: {
    borderRadius: borderRadius.full,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    alignSelf: 'flex-start',
  },

  badgeSuccess: {
    backgroundColor: colors.secondary.peacefulGreen,
  },

  badgeWarning: {
    backgroundColor: colors.secondary.wishYellow,
  },

  badgeNeutral: {
    backgroundColor: colors.secondary.mountainMist,
  },

  badgeText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },

  badgeTextLight: {
    color: colors.text.white,
  },

  badgeTextDark: {
    color: colors.text.onYellow,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: colors.border.light,
    marginVertical: spacing.md,
  },

  dividerThick: {
    height: 2,
    backgroundColor: colors.border.medium,
    marginVertical: spacing.md,
  },

  // Spacing Utilities
  mt0: { marginTop: 0 },
  mt1: { marginTop: spacing.xs },
  mt2: { marginTop: spacing.sm },
  mt3: { marginTop: spacing.md },
  mt4: { marginTop: spacing.lg },
  mt5: { marginTop: spacing.xl },

  mb0: { marginBottom: 0 },
  mb1: { marginBottom: spacing.xs },
  mb2: { marginBottom: spacing.sm },
  mb3: { marginBottom: spacing.md },
  mb4: { marginBottom: spacing.lg },
  mb5: { marginBottom: spacing.xl },

  ml0: { marginLeft: 0 },
  ml1: { marginLeft: spacing.xs },
  ml2: { marginLeft: spacing.sm },
  ml3: { marginLeft: spacing.md },
  ml4: { marginLeft: spacing.lg },

  mr0: { marginRight: 0 },
  mr1: { marginRight: spacing.xs },
  mr2: { marginRight: spacing.sm },
  mr3: { marginRight: spacing.md },
  mr4: { marginRight: spacing.lg },

  pt0: { paddingTop: 0 },
  pt1: { paddingTop: spacing.xs },
  pt2: { paddingTop: spacing.sm },
  pt3: { paddingTop: spacing.md },
  pt4: { paddingTop: spacing.lg },

  pb0: { paddingBottom: 0 },
  pb1: { paddingBottom: spacing.xs },
  pb2: { paddingBottom: spacing.sm },
  pb3: { paddingBottom: spacing.md },
  pb4: { paddingBottom: spacing.lg },

  // Flex Utilities
  row: {
    flexDirection: 'row',
  },

  column: {
    flexDirection: 'column',
  },

  alignCenter: {
    alignItems: 'center',
  },

  alignStart: {
    alignItems: 'flex-start',
  },

  alignEnd: {
    alignItems: 'flex-end',
  },

  justifyCenter: {
    justifyContent: 'center',
  },

  justifyBetween: {
    justifyContent: 'space-between',
  },

  justifyAround: {
    justifyContent: 'space-around',
  },

  justifyStart: {
    justifyContent: 'flex-start',
  },

  justifyEnd: {
    justifyContent: 'flex-end',
  },

  flex1: {
    flex: 1,
  },

  // Kind30 Specific Brand Elements
  kindnessStreak: {
    backgroundColor: colors.secondary.peacefulGreen,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.md,
  },

  streakNumber: {
    fontSize: typography.sizes.display,
    fontWeight: typography.weights.bold,
    color: colors.text.white,
  },

  streakLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.text.white,
    marginTop: spacing.xs,
  },

  inspirationalQuote: {
    backgroundColor: colors.secondary.clearSky,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary.green,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    marginVertical: spacing.md,
  },

  quoteText: {
    fontSize: typography.sizes.md,
    fontStyle: 'italic',
    color: colors.text.primary,
    lineHeight: typography.sizes.md * typography.lineHeights.relaxed,
  },

  statsCard: {
    backgroundColor: colors.primary.green,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.md,
  },

  statsNumber: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
    color: colors.text.white,
  },

  statsLabel: {
    fontSize: typography.sizes.sm,
    color: colors.text.white,
    marginTop: spacing.xs,
  },
});

// Export individual theme elements for direct use
export { borderRadius, colors, shadows, spacing, theme, typography };

export default globalStyles;