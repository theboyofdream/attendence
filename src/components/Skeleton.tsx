import { useEffect, useRef } from "react";
import { Animated, ViewProps } from "react-native";
import { COLORS } from "~utils";

type SkeletonProps = ViewProps & {
  opacity?: [number, number];
  duration?: number
}

export function Skeleton(props: SkeletonProps) {
  const opacity = props.opacity || [0.4, 0.8]
  const duration = props.duration || 500
  const animatedOpacity = useRef(new Animated.Value(opacity[0])).current;

  useEffect(function animate() {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedOpacity, {
          toValue: opacity[1],
          useNativeDriver: true,
          duration: duration
        }),
        Animated.timing(animatedOpacity, {
          toValue: opacity[0],
          useNativeDriver: true,
          duration
        })
      ])
    ).start();
  }, [])

  return (
    <Animated.View {...props} style={[{ opacity: animatedOpacity }, { backgroundColor: COLORS.skeleton }, props.style]} />
  )
}