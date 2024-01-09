import { StyleSheet, View, ViewStyle } from "react-native";
import { Text } from "~components";
import { useDimension } from "~src/hooks";
import { COLORS, ROUNDNESS, SPACING } from "~src/theme";

export function Stats(){
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
  return(
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
  )
}

const $ = StyleSheet.create({
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