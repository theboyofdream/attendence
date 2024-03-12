import { GestureResponderEvent, Pressable, PressableProps, StyleSheet, View, ViewProps } from "react-native";
import { COLORS } from "~utils";


type OverlayProps = PressableProps & {
  zIndex?: number,
}


export function Overlay(props: OverlayProps) {
  return (
    <>
      <Pressable
        {...props}
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: COLORS.backgroundSecondary, zIndex: props.zIndex },
          props.style,
        ]}
      >
        <Pressable style={[{ flex: 1 }, props.style]}>
          {props.children}
        </Pressable>
      </Pressable>
    </>
  )
}