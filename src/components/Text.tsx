import { Text as RNText, StyleSheet, TextProps } from "react-native";
import { COLORS, FONTSIZE } from "~src/theme";

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
    fontSize: FONTSIZE.xs
  },
  title: {
    fontSize: FONTSIZE.lg,
    fontWeight: 'bold'
  },
  subTitle: {
    fontSize: FONTSIZE.md,
    fontWeight: 'bold'
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
