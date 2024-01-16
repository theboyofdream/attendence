import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { MessageType, useMessageHeader } from "~stores";
import { COLORS, FONTSIZE, SPACING } from "~utils";
import { IconButton } from "./IconButton";
import { Text } from "./Text";

const AnimatedText = Animated.createAnimatedComponent(Text)
const AnimatedIconButton = Animated.createAnimatedComponent(IconButton)
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
        toValue: animateType === 'in' ? 0 : -150,
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
      display: 'flex',
      transform: [
        { translateY: positionY }
      ]
    }}>
      <View style={{ flex: 1 }}>
        <AnimatedText variant="subTitle" style={{ opacity }}> {msg?.title}</AnimatedText>
        <AnimatedText style={{ opacity }}>{msg?.description}</AnimatedText>
      </View>
      <AnimatedIconButton iconName="close" style={{ opacity }} iconStyle={{ size: FONTSIZE.lg }} onPress={() => setMsg(null)} />
    </Animated.View>
  )
}


const $ = (type: MessageType) => StyleSheet.create({
  container: {
  },
  title: {},
  description: {}
})
