import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlatList, Image, Pressable, StyleSheet, View } from "react-native";
import { Button, IconButton, Screen, Text } from "~components";
import { Routes } from "~src/App";
import { COLORS, FONTSIZE, ROUNDNESS, SPACING } from "~src/utils";
import { useAuthStore } from "~stores";
import { Stats } from "./Stats";
import { handleCameraPermission } from "./cameraPermission";
import { handleLocationPermission } from "./locationPermission";
import { useEffect, useMemo, useState } from "react";
import { isLocationEnabled, promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';
import { dateFns } from "~utils";
import { useAttendanceMarkedStatus } from "~src/stores/useAttendanceMarkedStatus";
import { AttendanceList, AttendanceListSkeleton } from "./AttendanceList";

type HomePage = NativeStackScreenProps<Routes, 'home'>
export function HomePage({ navigation }: HomePage) {
  const { user, logout } = useAuthStore();
  const { attendanceMarkedStatus } = useAttendanceMarkedStatus();
  const [date, setDate] = useState(new Date())
  const month = useMemo(() => dateFns.getMonthInfo(date), [date])
  const year = useMemo(() => date.getFullYear(), [date]);

  async function gotoCameraPage() {
    const cameraPermissionGranted = await handleCameraPermission() === 'granted';
    const locationPermissionGranted = await handleLocationPermission() === 'granted';
    let locationEnabled = await isLocationEnabled();

    if (!locationEnabled) {
      let result = await promptForEnableLocationIfNeeded();
      if (result === 'already-enabled' || result === 'enabled') {
        locationEnabled = true;
      }
    }

    if (cameraPermissionGranted && locationPermissionGranted && locationEnabled) {
      navigation.navigate('camera')
    }
  }

  return (
    <Screen style={$.screen}>

      <View style={$.header}>

        <Image source={{ uri: user.picture }} style={$.image} />
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
            <Text variant="title" style={{ textTransform: 'capitalize' }}>{user.firstname} {user.lastname}</Text>
            <Text variant="caption" muted>#{user.id}</Text>
          </View>
          <Text variant="caption">Joining Date: {user.dateOfJoining?.toLocaleDateString()}</Text>
        </View>
        <IconButton iconName="logout" onPress={logout} />
      </View>


      <View style={$.nav}>
        <Button leftIconName="chevron-left" style={{ minWidth: 0 }} onPress={() => setDate(dateFns.addMonth(date, -1))} />
        <Text style={{ fontWeight: 'bold' }}>{month.longName}, {date.getFullYear()}</Text>
        <Button leftIconName="chevron-right" style={{ minWidth: 0 }} onPress={() => setDate(dateFns.addMonth(date, 1))} />
      </View>

      <Stats />

      <Text variant="danger" style={{ margin: SPACING.md }}>Pending Approvals</Text>


      {
        month.daysArray.length < 1 &&
        <FlatList
          ListFooterComponent={<View style={{ height: SPACING.lg * 6 }} />}
          contentContainerStyle={{ gap: SPACING.md }}
          data={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
          keyExtractor={(item) => `${item}`}
          showsVerticalScrollIndicator={false}
          renderItem={() => <AttendanceListSkeleton />
          }
        />
      }

      <FlatList
        ListFooterComponent={<View style={{ height: SPACING.lg * 6 }} />}
        contentContainerStyle={{ gap: SPACING.md }}
        data={month.daysArray}
        keyExtractor={(item) => `${item}`}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <AttendanceList
            date={item}
            monthName={month.shortName}
            dayName={dateFns.getDayInfo(new Date(year, month.index, item)).longName}
            year={year}
          />
        )}
      />

      {
        (!attendanceMarkedStatus.inTimeMarked || !attendanceMarkedStatus.outTimeMarked) &&
        <Button
          title={!attendanceMarkedStatus.inTimeMarked ? 'Mark In Time' : !attendanceMarkedStatus.outTimeMarked ? 'Mark Out Time' : 'Already Marked'}
          // variant="infoFilled"
          variant="dangerFilled"
          // variant="primary"
          style={$.markAttendanceBtn}
          // titleStyle={{ fontSize: FONTSIZE.md }}
          leftIconName="photo-camera"
          onPress={gotoCameraPage}
        />
      }
    </Screen>
  );

}

const $ = StyleSheet.create({
  screen: {
    paddingHorizontal: SPACING.lg,
  },
  header: {
    marginVertical: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md
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
  image: {
    width: 40,
    aspectRatio: 1,
    borderRadius: ROUNDNESS.lg,
  },
  markAttendanceBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    margin: SPACING.lg,
    marginRight: SPACING.lg * 1.5,
    alignSelf: 'flex-end'
  }
})