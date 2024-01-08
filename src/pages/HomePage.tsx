import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScrollView, StyleSheet, View, ViewStyle } from "react-native";
import { Button, Screen, Text } from "~components";
import { Routes } from "~src/Router";
import { useDimension } from "~src/hooks";
import { COLORS, ROUNDNESS, SPACING } from "~src/theme";
import { useAuthStore } from "~stores";

type HomePage = NativeStackScreenProps<Routes, 'home'>
export function HomePage({ navigation }: HomePage) {
  const { logout } = useAuthStore();

  const { width } = useDimension();
  const margin = SPACING.lg
  const itemsPerRow = 3
  const totalRowGap = (itemsPerRow - 1) * SPACING.sm
  const rowItemWidth = ((width - totalRowGap) / itemsPerRow) - margin;

  const style: ViewStyle = {
    ...$.statsContainer,
    width: rowItemWidth,
    borderRadius: ROUNDNESS.sm
  }

  return (
    <Screen style={$.screen}>
      <View style={$.header}>
        <Text variant="subTitle">My Attendence</Text>
        <Button variant="dangerText" title="logout" style={{ minWidth: 0 }} titleStyle={{ fontWeight: 'bold' }} onPress={logout} />
      </View>
      <View style={$.nav}>
        <Button leftIconName="chevron-left" style={{ minWidth: 0 }} />
        <Text style={{ fontWeight: 'bold' }}>January, 2023</Text>
        <Button leftIconName="chevron-right" style={{ minWidth: 0 }} />
      </View>
      <View style={[$.statsWrapper, {
        gap: totalRowGap / (itemsPerRow - 1),
        marginVertical: margin / 2
      }]}>
        <View style={style}>
          <Text>Present</Text>
          <Text>0</Text>
        </View>
        <View style={style}>
          <Text>Absent</Text>
          <Text>0</Text>
        </View>
        <View style={style}>
          <Text>Half Day</Text>
          <Text>0</Text>
        </View>
        <View style={style}>
          <Text>Leave</Text>
          <Text>0</Text>
        </View>
        <View style={style}>
          <Text>Fine</Text>
          <Text>0</Text>
        </View>
        <View style={style}>
          <Text>Overtime</Text>
          <Text>0</Text>
        </View>
      </View>
      <Text variant="danger" style={{
        marginHorizontal: SPACING.md
      }}>Pending Approvals</Text>

      <ScrollView style={{ flex: 1 }} />

      <Button
        title="Mark Attendence"
        variant="primary"
        style={{
          position: 'absolute',
          bottom: SPACING.lg,
          right: SPACING.lg
        }}
        leftIconName="photo-camera"
        onPress={() => {
          navigation.navigate('camera')
        }}
      />
    </Screen>
  )
}


const $ = StyleSheet.create({
  screen: {
    paddingHorizontal: SPACING.lg,
  },
  header: {
    marginVertical: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.transparent
  },
  statsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  statsContainer: {
    backgroundColor: COLORS.backgroundSecondary,
    padding: SPACING.lg
  }
})
