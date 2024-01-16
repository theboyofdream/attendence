import { Animated, StyleSheet, View } from "react-native";
import { Text } from "./Text";
import { IconButton } from "./IconButton";
import { COLORS, FONTSIZE, SPACING } from "~utils";
import { MessageType, useMessageHeader } from "~stores";
import { useEffect, useRef } from "react";

export function MessageHeader() {
  const { msg, setMsg } = useMessageHeader();
  const positionY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  function animateHeader(animateType: 'in' | 'out' = 'in') {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: animateType === 'in' ? 1 : 0,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(positionY, {
        toValue: animateType === 'in' ? 0 : -1000,
        duration: 300,
        useNativeDriver: true
      })
    ]).start()
  }

  useEffect(() => {
    animateHeader(msg ? 'in' : 'out')
  }, [msg])

  return (
    <Animated.View style={{
      backgroundColor: COLORS.background,
      height: 100,
      flexDirection: 'row',
      padding: SPACING.md,
      display: msg ? 'flex' : 'none'
    }}>
      <View style={{ flex: 1 }}>
        <Text variant="subTitle">{msg?.title}</Text>
        <Text>{msg?.description}</Text>
      </View>
      <IconButton iconName="close" iconStyle={{ size: FONTSIZE.lg }} onPress={() => setMsg(null)} />
    </Animated.View>
  )
}


const $ = (type: MessageType) => StyleSheet.create({
  container: {
  },
  title: {},
  description: {}
})