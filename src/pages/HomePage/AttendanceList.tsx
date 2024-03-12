import { Pressable, StyleSheet, View } from "react-native";
import { Skeleton, Text } from "~components";
import { COLORS, FONTSIZE, ROUNDNESS, SPACING, dateFns } from "~utils";

type AttendanceListProps = {
  date: number;
  dayName: string;
  monthName: string;
  year: number;
  punchIn: { time: string, approvalStatusName: string },
  punchOut: { time: string, approvalStatusName: string },
  onPress?: () => void
}
export function AttendanceList(props: AttendanceListProps) {
  const { date, monthName, dayName, year, punchIn, punchOut } = props
  return (
    <Pressable style={$.list} onPress={props.onPress} >
      <View style={$.avatar}>
        <Text style={{ fontWeight: 'bold' }}>{date < 10 ? `0${date}` : date}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text>{date < 10 ? `0${date}` : date} {monthName} {year}</Text>
        {/* <Text>{punchIn.time} {punchIn.approvalStatusName}</Text>
        <Text>{punchOut.time} {punchOut.approvalStatusName}</Text> */}
        {
          punchIn.approvalStatusName == punchOut.approvalStatusName ?
            <Text>{punchIn.approvalStatusName}</Text> :
            <Text>{punchIn.approvalStatusName} | {punchOut.approvalStatusName}</Text>
        }
        <Text>{punchIn.time} - {punchOut.time}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text variant="caption" muted>{dayName}</Text>
      </View>
    </Pressable>
  )
}

const $ = StyleSheet.create({
  list: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // paddingHorizontal: SPACING.lg,
    // paddingVertical: SPACING.lg,
    padding: SPACING.lg,
    gap: SPACING.lg,
    borderRadius: ROUNDNESS.md,
    backgroundColor: COLORS.text + '06',
    // borderWidth: 1,
    // borderColor: COLORS.backgroundSecondary,
    // elevation: 1,

    // backgroundColor: COLORS.background,
  },
  avatar: {
    height: FONTSIZE.lg * 2.1,
    aspectRatio: 1,
    // backgroundColor: COLORS.text + '07',
    backgroundColor: COLORS.background,
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
      <View style={{ flex: 1, gap: FONTSIZE.xxs * 0.5 }}>
        <Skeleton style={{ height: FONTSIZE.xxs * 0.8, width: (FONTSIZE.xs * 10) + r(), borderRadius: ROUNDNESS.xs }} />
        <Skeleton style={{ height: FONTSIZE.xxs * 0.8, width: (FONTSIZE.xs * 8) + r(), borderRadius: ROUNDNESS.xs }} />
        <Skeleton style={{ height: FONTSIZE.xxs * 0.8, width: (FONTSIZE.xs * 6) + r(), borderRadius: ROUNDNESS.xs }} />
      </View>
      <Skeleton style={{ height: FONTSIZE.xxs * 0.8, width: FONTSIZE.xs * 1.2, borderRadius: ROUNDNESS.xs }} />
    </View>
  )
}