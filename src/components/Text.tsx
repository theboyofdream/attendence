import { Text as RNText, StyleSheet, TextProps } from "react-native";
import { COLORS, FONTSIZE, SPACING } from "~src/utils";

type style = keyof typeof $;
type TypologyProps = {
  variant?: 'title' | 'subTitle' | 'paragraph' | 'caption' | 'danger' | 'info';
  muted?: boolean;
}

export function Text(props: TextProps & TypologyProps) {
  props.variant = props.variant ?? 'paragraph'
  return (
    <RNText
      {...props}
      style={[
        $.base,
        $[props.variant],
        props.muted && $.muted,
        props.style
      ]}
    />
  )
}

const $ = StyleSheet.create({
  base: {
    color: COLORS.text,
    fontSize: FONTSIZE.xs,
    fontFamily: 'Poppins-Regular'
  },
  title: {
    fontSize: FONTSIZE.lg,
    letterSpacing: SPACING.xxs * 0.5,
    fontFamily: 'Poppins-Medium',
  },
  subTitle: {
    fontSize: FONTSIZE.md,
    letterSpacing: SPACING.xxs * 0.5,
    fontFamily: 'Poppins-Medium',
  },
  paragraph: {},
  caption: {
    fontSize: FONTSIZE.xxs
  },
  danger: {
    color: COLORS.dangerText
  },
  info: {
    color: COLORS.infoText
  },
  muted: {
    color: COLORS.textMuted
  }
})

export const textStyle = $;
