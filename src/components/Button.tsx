import { useState } from 'react'
import { GestureResponderEvent, Pressable, PressableProps, StyleSheet, Text, TextStyle } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { COLORS, FONTSIZE, ROUNDNESS, SPACING } from '~src/utils'

type ButtonProps = PressableProps & {
  variant?: 'primary' | 'secondary' | 'danger' | 'dangerText' | 'dangerFilled' | 'info' | 'infoText' | 'infoFilled' | 'transparent',
  title?: string,
  titleStyle?: TextStyle
  rightIconName?: string
  leftIconName?: string
}

export function Button(props: ButtonProps) {
  const variant = props.variant || 'transparent'
  const [pressin, setPressin] = useState(false)
  function onPressIn(e: GestureResponderEvent) {
    setPressin(true);
    props.onPressIn && props.onPressIn(e)
  }
  function onPressOut(e: GestureResponderEvent) {
    setPressin(false);
    props.onPressOut && props.onPressOut(e);
  }
  return (
    <Pressable
      {...props}
      style={[
        $.base,
        $[variant],
        props.disabled && $.disabled,
        pressin && $.disabled,
        props.style
      ]}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <>
        {props.leftIconName && <MaterialIcon name={props.leftIconName} color={$[variant].color} size={props.titleStyle?.fontSize || FONTSIZE.md} />}
        {props.title && <Text
          style={[
            $[variant],
            $.baseText,
            pressin && $.disabled,
            props.titleStyle
          ]}
        >{props.title}</Text>}
        {props.rightIconName && <MaterialIcon name={props.rightIconName} color={$[variant].color} size={props.titleStyle?.fontSize || FONTSIZE.md} />}
      </>
    </Pressable>
  )
}

const $ = StyleSheet.create({
  base: {
    minWidth: 100,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg * 0.8,
    paddingHorizontal: SPACING.lg * 1.5,
    borderRadius: ROUNDNESS.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: SPACING.md
  },
  baseText: {
    fontSize: FONTSIZE.xs,
    letterSpacing: SPACING.xxs,
    textTransform: 'uppercase',
    backgroundColor: COLORS.transparent
  },
  disabled: { opacity: 0.75 },
  primary: {
    backgroundColor: COLORS.text,
    color: COLORS.background,
  },
  secondary: {
    borderColor: COLORS.textMuted,
    backgroundColor: COLORS.backgroundSecondary,
    color: COLORS.text
  },
  danger: {
    borderColor: COLORS.dangerText,
    backgroundColor: COLORS.dangerBackground,
    color: COLORS.dangerText
  },
  dangerText: {
    borderColor: COLORS.transparent,
    color: COLORS.dangerText
  },
  dangerFilled: {
    borderColor: COLORS.dangerText,
    backgroundColor: COLORS.dangerText,
    color: COLORS.background,
  },
  info: {
    borderColor: COLORS.infoText,
    backgroundColor: COLORS.infoBackground,
    color: COLORS.infoText,
  },
  infoText: {
    borderColor: COLORS.transparent,
    backgroundColor: COLORS.transparent,
    color: COLORS.infoText,
  },
  infoFilled: {
    borderColor: COLORS.infoText,
    backgroundColor: COLORS.infoText,
    color: COLORS.background,
  },
  transparent: {
    borderColor: COLORS.transparent,
    backgroundColor: COLORS.transparent,
    color: COLORS.text,
  }
})
