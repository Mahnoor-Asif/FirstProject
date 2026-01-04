// import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
// import { theme } from '@/constants/theme';

// interface ButtonProps {
//   title: string;
//   onPress: () => void;
//   variant?: 'primary' | 'secondary' | 'outline';
//   style?: ViewStyle;
// }

// export default function Button({ title, onPress, variant = 'primary', style }: ButtonProps) {
//   return (
//     <TouchableOpacity
//       style={[
//         styles.button,
//         variant === 'primary' && styles.primary,
//         variant === 'secondary' && styles.secondary,
//         variant === 'outline' && styles.outline,
//         style,
//       ]}
//       onPress={onPress}>
//       <Text
//         style={[
//           styles.text,
//           variant === 'outline' && styles.outlineText,
//         ]}>
//         {title}
//       </Text>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   button: {
//     paddingVertical: theme.spacing.md,
//     paddingHorizontal: theme.spacing.lg,
//     borderRadius: theme.borderRadius.md,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   primary: {
//     backgroundColor: theme.colors.secondary,
//   },
//   secondary: {
//     backgroundColor: theme.colors.primary,
//   },
//   outline: {
//     backgroundColor: 'transparent',
//     borderWidth: 1,
//     borderColor: theme.colors.border,
//   },
//   text: {
//     fontSize: theme.fontSize.md,
//     fontWeight: '600',
//     color: theme.colors.background,
//   },
//   outlineText: {
//     color: theme.colors.text,
//   },
// });
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { theme } from '@/constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  style,
  textStyle,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'outline' && styles.outline,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.text,
          variant === 'outline' && styles.outlineText,
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: theme.colors.secondary,
  },
  secondary: {
    backgroundColor: theme.colors.primary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  text: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.background,
  },
  outlineText: {
    color: theme.colors.text,
  },
});
