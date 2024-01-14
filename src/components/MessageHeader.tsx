import { View } from "react-native";
import { Text } from "./Text";
import { Button } from "./Button";
import { IconButton } from "./IconButton";
import { COLORS, FONTSIZE, SPACING } from "~utils";
import { useState } from "react";

export function MessageHeader() {
  const [visible, setVisibility] = useState(false)
  return (
    <View style={{
      backgroundColor: COLORS.background,
      height: 100,
      flexDirection: 'row',
      padding: SPACING.md,
      display: visible ? 'flex' : 'none'
    }}>
      <View style={{ flex: 1 }}>
        <Text variant="subTitle">Title</Text>
        <Text>content</Text>
      </View>
      <IconButton iconName="close" iconStyle={{ size: FONTSIZE.lg }} />
    </View>
  )
}