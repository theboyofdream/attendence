import { useState } from 'react'
import { GestureResponderEvent, Pressable, PressableProps, StyleSheet, Text, TextStyle } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { COLORS, FONTSIZE, ROUNDNESS } from '~src/utils'

type IconButtonProps = PressableProps & {
  variant?: 'primary' | 'secondary' | 'danger' | 'dangerFilled' | 'info' | 'infoFilled' | 'transparent',
  iconName?: string,
  iconStyle?: TextStyle & { size?: number },
  letter?: string,
  letterStyle?: TextStyle,
  type?: 'icon' | 'letter',
  compact?: boolean
}

export function IconButton(props: IconButtonProps) {
  const variant = props.variant || 'transparent'
  const type = props.type || 'icon'
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
        props.compact && $.compact,
        props.disabled && $.disabled,
        pressin && $.disabled,
        props.style
      ]}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >

      {
        type === 'letter' && props.letter &&
        <Text
          style={[
            $[variant],
            $.baseText,
            pressin && $.disabled,
            props.letterStyle
          ]}
        >{props.letter}</Text>
      }
      {
        type === 'icon' && props.iconName &&
        <MaterialIcon
          name={props.iconName}
          color={props.iconStyle?.color || $[variant].color}
          size={props.iconStyle?.size || $.baseText.fontSize}
        />
      }
    </Pressable>
  )
}

const $ = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: ROUNDNESS.md,
    borderWidth: 1,
    width: FONTSIZE.lg * 2,
    height: FONTSIZE.lg * 2
  },
  compact: {
    width: FONTSIZE.lg,
    height: FONTSIZE.lg
  },
  baseText: {
    fontSize: FONTSIZE.lg,
    textTransform: 'uppercase',
    backgroundColor: COLORS.transparent
  },
  disabled: { opacity: 0.75 },
  primary: {
    backgroundColor: COLORS.text,
    color: COLORS.background,
  },
  secondary: {
    // borderColor: COLORS.transparent,
    borderColor: COLORS.backgroundSecondary,
    backgroundColor: COLORS.backgroundSecondary,
    color: COLORS.text
  },
  danger: {
    // borderColor: COLORS.dangerText,
    borderColor: COLORS.dangerBackground,
    backgroundColor: COLORS.dangerBackground,
    color: COLORS.dangerText
  },
  dangerFilled: {
    borderColor: COLORS.dangerText,
    backgroundColor: COLORS.dangerText,
    color: COLORS.background,
  },
  info: {
    // borderColor: COLORS.infoText,
    borderColor: COLORS.infoBackground,
    backgroundColor: COLORS.infoBackground,
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
