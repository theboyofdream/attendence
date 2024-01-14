import { useEffect, useRef, useState } from "react";
import { Image, Pressable, StatusBar, StyleSheet, View, Animated } from "react-native"
import { Button, Text } from "~components";
import { useDimension } from "~src/hooks";
import { useAuthStore } from "~stores";
import { COLORS, ROUNDNESS, SPACING } from "~utils"

type ProfileProps = {
  visible: boolean;
  setVisibility: (visible: boolean) => void
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)
export function Profile(props: ProfileProps) {
  const { user, logout } = useAuthStore();
  const { width } = useDimension();
  const [profileVisible, setProfileVisibility] = useState(true)

  const hide = () => props.setVisibility(false)

  const opacity = useRef(new Animated.Value(0)).current
  const profilePosition = useRef(new Animated.Value(0)).current

  function animateIn() {
    Animated.sequence([
      Animated.spring(profilePosition, {
        toValue: 0,
        useNativeDriver: false
      }),
      Animated.timing(opacity, {
        toValue: 1,
        delay: 100,
        useNativeDriver: true,
        duration: 300
      })
    ]).start()
    setProfileVisibility(true)
  }
  function animateOut() {
    Animated.sequence([
      Animated.spring(profilePosition, {
        toValue: 200,
        useNativeDriver: false
      }),
      Animated.timing(opacity, {
        toValue: 0,
        useNativeDriver: true,
        duration: 300
      })
    ]).start()
    setTimeout(() => setProfileVisibility(false), 400);
  }

  useEffect(() => {
    if (profileVisible && !props.visible) {
      animateOut()
    } else if (props.visible) {
      animateIn()
    }
  }, [props.visible])

  return (
    <>
      {profileVisible &&
        <>
          <StatusBar backgroundColor={COLORS.textTertiary + '50'} />
          <AnimatedPressable style={[StyleSheet.absoluteFill, $.backdrop, { opacity }]} onPress={hide} />
          <Animated.View style={[$.wrapper, { width: width - (SPACING.lg * 2) }, { transform: [{ translateY: profilePosition }] }]}>
            <View style={$.container}>
              <Image source={{ uri: user.picture }} style={$.image} />
              <View style={{ flex: 1 }}>
                <Text style={$.name} variant="subTitle">{user.firstname} {user.lastname}</Text>
                <Text>Joining Date: {user.dateOfJoining?.toDateString()}</Text>
              </View>
            </View>
            <Button title="logout" leftIconName="logout" variant="dangerFilled" style={$.logoutBtn} onPress={logout} />
          </Animated.View>
        </>
      }
    </>
  )
}


const $ = StyleSheet.create({
  backdrop: {
    backgroundColor: COLORS.textTertiary + '50',
    justifyContent: 'flex-end'
  },
  wrapper: {
    backgroundColor: COLORS.background,
    maxWidth: 400,
    marginBottom: SPACING.lg,
    minHeight: 100,
    borderRadius: ROUNDNESS.md,
    overflow: 'hidden',
    gap: SPACING.lg,
    padding: SPACING.lg * 1.5,
    alignSelf: 'center'
  },
  container: {
    flexDirection: 'row',
    gap: SPACING.lg,
  },
  image: {
    width: 80,
    aspectRatio: 1,
    borderRadius: ROUNDNESS.circle
  },
  name: { textTransform: 'capitalize' },
  logoutBtn: { width: '100%', alignSelf: 'center' }
})