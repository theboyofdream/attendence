import { StyleSheet, View } from "react-native";
import { Skeleton, Text } from "~components";
import { COLORS, FONTSIZE, ROUNDNESS, SPACING, dateFns } from "~utils";

type AttendanceListProps = {
  date: number;
  monthName: string;
  dayName: string;
  year: number;
}
export function AttendanceList(props: AttendanceListProps) {
  const { date, monthName, dayName, year } = props
  return (
    <View style={$.list}>
      <View style={$.avatar}>
        <Text style={{ fontWeight: 'bold' }}>{date < 10 ? `0${date}` : date}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text>{date < 10 ? `0${date}` : date} {monthName} {year}</Text>
        <Text variant="caption" muted>{dayName}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text>Present | Approval Pending</Text>
        <Text>in time - out time</Text>
      </View>
    </View>
  )
}

const $ = StyleSheet.create({
  list: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
    gap: SPACING.lg,
    borderRadius: ROUNDNESS.sm,
  },
  avatar: {
    height: FONTSIZE.lg * 1.8,
    aspectRatio: 1,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 100,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export function AttendanceListSkeleton() {
  let r = () => (Math.round(Math.random() * 20) - 10)
  return (
    <View style={[$.list]}>
      <Skeleton style={[$.avatar, { backgroundColor: COLORS.skeleton }]} />
      <View style={{ flex: 1, gap: FONTSIZE.xxs * 0.8 }}>
        <Skeleton style={{ height: FONTSIZE.xxs, width: (FONTSIZE.xs * 10) + r(), borderRadius: ROUNDNESS.xs }} />
        <Skeleton style={{ height: FONTSIZE.xxs, width: (FONTSIZE.xs * 6) + r(), borderRadius: ROUNDNESS.xs }} />
      </View>
      {/* <View style={{ flex: 1, alignItems: 'flex-end', gap: FONTSIZE.xxs * 0.8 }}>
        <Skeleton style={{ height: FONTSIZE.xxs, width: FONTSIZE.xs * 8, borderRadius: ROUNDNESS.xs }} />
        <Skeleton style={{ height: FONTSIZE.xxs, width: FONTSIZE.xs * 8, borderRadius: ROUNDNESS.xs }} />
      </View> */}
    </View>
  )
}