import { useEffect, useRef } from "react";
import { Animated, Easing, Pressable, StyleSheet, View } from "react-native";
import { MessageType, useMessageHeader } from "~stores";
import { COLORS, ROUNDNESS, SPACING } from "~utils";
import { Text } from "./Text";
import { Button } from "./Button";

export function MessageHeader() {
  const { msg, setMsg } = useMessageHeader();
  const positionY = useRef(new Animated.Value(-150)).current;

  function animateHeader(animateType: 'in' | 'out' = 'in') {
    Animated.timing(positionY, {
      toValue: animateType === 'in' ? 0 : -150,
      duration: 300,
      useNativeDriver: false
    }).start()
  }

  const $ = styles(msg?.type || 'normal')

  function close() {
    setMsg(null)
  }
  function action() {
    if (msg && msg.action) {
      msg.action(msg.id)
    }
  }

  useEffect(() => {
    animateHeader(msg ? 'in' : 'out')
    let closeTimeout = setTimeout(() => {
      if (msg && msg.type === 'normal') { setMsg(null) }
    }, 3000);
  }, [msg])

  return (
    <Animated.View style={[$.container, { transform: [{ translateY: positionY }] }]}>
      <View style={{ flex: 1 }}>
        <Text variant="subTitle" style={[$.text, { textTransform: 'uppercase' }]}> {msg?.title}</Text>
        <Text style={$.text}>{msg?.description}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Button
            title={"close"}
            titleStyle={{ color: $.text.color, fontWeight: 'bold' }}
            onPress={close}
            style={{ transform: [{ scale: 0.8 }] }}
          />
          {msg && msg.actionName && msg.action &&
            <Button
              title={msg.actionName}
              variant={msg?.type === 'normal' ? 'secondary' : "danger" || 'secondary'}
              titleStyle={{ fontWeight: 'bold' }}
              onPress={action}
              style={{ transform: [{ scale: 0.8 }] }}
            />}
        </View>
      </View>
    </Animated.View>
  )
}


const styles = (type: MessageType) => {
  return StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      maxWidth: 400,
      alignSelf: 'center',
      borderRadius: ROUNDNESS.lg,
      backgroundColor: COLORS[type === 'normal' ? 'text' : 'dangerText'],
      borderWidth: 1,
      borderColor: COLORS[type === 'normal' ? 'background' : 'dangerBackground'] + '80',
      shadowColor: COLORS[type === 'normal' ? 'background' : 'dangerBackground'],
      elevation: 4,
      flexDirection: 'row',
      margin: SPACING.lg,
      padding: SPACING.md,
      paddingLeft: SPACING.lg,
      paddingRight: SPACING.sm
    },
    text: {
      color: COLORS[type === 'normal' ? 'background' : 'dangerBackground'],
    }
  })
}