import { useMemo, useRef, useState } from "react";
import { ScrollView, StyleSheet, View, ViewStyle, Animated } from "react-native";
import { Skeleton, Text } from "~components";
import { useDimension } from "~src/hooks";
import { statusTypes } from "~stores";
import { COLORS, ROUNDNESS, SPACING } from "~utils";

const indicatorSize = 6;

export type statsStatusType = statusTypes & { count: number }
type StatsProps = {
  loading: boolean;
  statusTypes: statsStatusType[]
}
export function Stats(props: StatsProps) {
  const chunkedStatusTypes = useMemo(() => {
    const chunkSize = 6;
    let result = []
    for (let i = 0; i < props.statusTypes.length; i += chunkSize) {
      result.push(props.statusTypes.slice(i, i + chunkSize));
    }
    return result;
  }, [props.statusTypes])

  const { width } = useDimension();
  const margin = SPACING.lg
  const itemsPerRow = 3
  const totalRowGap = (itemsPerRow - 1) * SPACING.sm
  const rowItemWidth = ((width - totalRowGap) / itemsPerRow) - margin;

  const style: ViewStyle = {
    ...$.statsContainer,
    width: rowItemWidth,
    borderRadius: ROUNDNESS.md
  }

  const pageWidth = (rowItemWidth + (SPACING.lg * 2)) * itemsPerRow;
  const pageIndicator0 = useRef(new Animated.Value(indicatorSize * 2)).current
  const pageIndicator1 = useRef(new Animated.Value(0)).current
  function animatePageIndicator(variableToBeAnimated: Animated.Value, toValue: number) {
    Animated.timing(variableToBeAnimated, {
      toValue: toValue,
      useNativeDriver: false,
      duration: 40
    }).start()
  }

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ margin: 0 }}
        decelerationRate={0}
        snapToAlignment="start"
        snapToInterval={pageWidth}
        onScroll={(e) => {
          const { x } = e.nativeEvent.contentOffset
          animatePageIndicator(pageIndicator0, x >= 0 && x < pageWidth * 0.5 ? indicatorSize * 2 : indicatorSize)
          animatePageIndicator(pageIndicator1, x >= pageWidth * 0.5 && x < pageWidth * 1.5 ? indicatorSize * 2 : indicatorSize)
        }}
      >
        {props.loading &&
          [[1, 2, 3, 4, 5, 6], [7, 8, 9, 10]].map((subArray, index) =>
            <View
              key={index}
              style={[$.statsWrapper, {
                gap: totalRowGap / (itemsPerRow - 1),
                margin: SPACING.md,
                width: (rowItemWidth + (SPACING.lg * 1.5)) * itemsPerRow,
              }]}
            >
              {
                subArray.map(i =>
                  <View style={[style, { justifyContent: 'space-between' }]} key={i}>
                    <Skeleton style={{ width: '60%', height: SPACING.md * 0.8, borderRadius: ROUNDNESS.xs, backgroundColor: COLORS.textMuted + '80' }} />
                    <Skeleton style={{ width: '20%', height: SPACING.lg * 1.2, borderRadius: ROUNDNESS.xs, backgroundColor: COLORS.textMuted + '80' }} />
                  </View>
                )
              }
            </View>
          )
        }
        {!props.loading &&
          chunkedStatusTypes.map((types, index) =>
            <View
              key={index}
              style={[$.statsWrapper, {
                gap: totalRowGap / (itemsPerRow - 1),
                margin: SPACING.md,
                width: (rowItemWidth + (SPACING.lg * 1.5)) * itemsPerRow,
              }]}
            >
              {
                types.map(type =>
                  <View style={style} key={type.id}>
                    <Text variant='caption' style={{ flex: 1 }}>{type.name}</Text>
                    <Text>{type.count || 0}</Text>
                    {/* <Text style={{ color: COLORS.background }}>{type.count || 0}</Text> */}
                  </View>
                )
              }
            </View>
          )
        }
      </ScrollView>
      <View style={{ justifyContent: 'center', alignContent: 'center', flexDirection: 'row', gap: SPACING.xs }}>
        <Animated.View style={[{ width: pageIndicator0 }, $.pageIndicator]} />
        <Animated.View style={[{ width: pageIndicator1 }, $.pageIndicator]} />
      </View>
    </View>
  )
}

const $ = StyleSheet.create({
  statsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statsContainer: {
    minHeight: 80,
    backgroundColor: COLORS.backgroundSecondary.slice(0, -2) + '08',
    // backgroundColor: COLORS.text,
    // borderWidth: 1,
    // borderColor: COLORS.textTertiary,
    padding: SPACING.lg,
    // justifyContent: 'space-between',
  },
  pageIndicator: {
    minWidth: indicatorSize,
    height: indicatorSize,
    borderRadius: 100,
    backgroundColor: COLORS.text
  }
})