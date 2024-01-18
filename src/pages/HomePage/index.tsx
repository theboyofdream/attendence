import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlatList, Image, Pressable, StyleSheet, View } from "react-native";
import { Button, IconButton, Screen, Text } from "~components";
import { Routes } from "~src/App";
import { COLORS, FONTSIZE, ROUNDNESS, SPACING } from "~src/utils";
import { statusTypes, useAttendanceList, useAuthStore, useMessageHeader, useTypesOfAttendanceStatus } from "~stores";
import { Stats, statsStatusType } from "./Stats";
import { handleCameraPermission } from "./cameraPermission";
import { handleLocationPermission } from "./locationPermission";
import { useEffect, useMemo, useState } from "react";
import { isLocationEnabled, promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';
import { dateFns } from "~utils";
import { useAttendanceMarker } from "~src/stores/useAttendanceMarker";
import { AttendanceList, AttendanceListSkeleton } from "./AttendanceList";

type HomePage = NativeStackScreenProps<Routes, 'home'>
export function HomePage({ navigation }: HomePage) {
  const { user, logout } = useAuthStore();
  const { setMsg } = useMessageHeader()
  const { attendanceMarkedStatus } = useAttendanceMarker();
  const { statusTypes, refreshStatusTypes } = useTypesOfAttendanceStatus()

  const { attendanceList, getAttendanceList } = useAttendanceList()

  const statusTypesObject = useMemo(() => {
    let obj = {} as { [key: number]: statsStatusType }
    statusTypes.forEach(statusType => { obj[statusType.id] = { ...statusType, count: 0 } })
    attendanceList.forEach(list => {
      if (list.punchIn.approvalStatus == list.punchOut.approvalStatus) {
        obj[list.punchIn.approvalStatus].count += 1
        return
      }

      if (obj[list.punchIn.approvalStatus]) {
        obj[list.punchIn.approvalStatus].count += 1
      }
      if (obj[list.punchOut.approvalStatus]) {
        obj[list.punchOut.approvalStatus].count += 1
      }
    })
    return obj;
  }, [statusTypes, attendanceList])

  const [loading, setLoading] = useState(false);

  const [date, setDate] = useState(new Date())
  const month = useMemo(() => dateFns.getMonthInfo(date), [date])
  const year = useMemo(() => date.getFullYear(), [date]);

  async function gotoCameraPage() {
    const cameraPermissionGranted = await handleCameraPermission() === 'granted';
    const locationPermissionGranted = await handleLocationPermission() === 'granted';
    let locationEnabled = await isLocationEnabled();

    if (!locationEnabled) {
      try {
        let result = await promptForEnableLocationIfNeeded();
        if (result && (result === 'already-enabled' || result === 'enabled')) {
          locationEnabled = true;
        }
      } catch (error) {
        setMsg({
          id: 'location',
          title: 'Location disabled',
          description: 'Enable your location for marking attendace.',
          type: 'error'
        })
        return;
      }
    }

    if (cameraPermissionGranted && locationPermissionGranted && locationEnabled) {
      navigation.navigate('camera')
    } else {
      setMsg({
        id: 'permission',
        title: 'Permissions denied!',
        description: 'Check CAMERA and LOCATION permission. Also make sure location is active.',
        type: 'error'
      })
    }
  }

  async function loadAttendance(year: number, month: number) {
    setLoading(true)
    await refreshStatusTypes()
    await getAttendanceList(year, month)
    setLoading(false)
  }

  useEffect(() => {
    loadAttendance(year, month.index)
  }, [date])

  return (
    <Screen style={$.screen}>

      <View style={$.header}>

        <Image source={{ uri: user.picture }} style={$.avatar} />
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

      <Stats loading={loading} statusTypes={Object.values(statusTypesObject)} />

      <View style={{ height: SPACING.lg }} />

      {
        loading &&
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

      {!loading && attendanceList.length > 0 && <FlatList
        ListFooterComponent={<View style={{ height: SPACING.lg * 6 }} />}
        contentContainerStyle={{ gap: SPACING.md }}
        data={attendanceList.reverse()}
        keyExtractor={(item, index) => `${index}`}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          // console.log({ item })
          return (
            <>
              {item.date &&
                <AttendanceList
                  date={item.date.getDate()}
                  monthName={month.shortName}
                  dayName={dateFns.getDayInfo(item.date).shortName}
                  year={year}
                  punchIn={{
                    time: item.punchIn.time ? dateFns.toReadable(item.punchIn.time, 'time') : '',
                    approvalStatusName: statusTypesObject[item.punchIn.approvalStatus].name || ''
                  }}
                  punchOut={{
                    time: item.punchOut.time ? dateFns.toReadable(item.punchOut.time, 'time') : '',
                    approvalStatusName: statusTypesObject[item.punchIn.approvalStatus].name || ''
                  }}
                />
              }
            </>)
        }}
      />}

      {
        !loading && attendanceList.length < 1 &&
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: SPACING.lg }}>
          <Image source={require('src/assets/not-found.png')} style={$.notFoundImage} />
          <Text>Not Found anything!</Text>
        </View>
      }

      {
        (!attendanceMarkedStatus.inTimeMarked || !attendanceMarkedStatus.outTimeMarked) && !loading &&
        <Button
          title={!attendanceMarkedStatus.inTimeMarked ? 'Mark In Time' : !attendanceMarkedStatus.outTimeMarked ? 'Mark Out Time' : 'Already Marked'}
          variant="primary"
          style={$.markAttendanceBtn}
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
  avatar: {
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
  },
  notFoundImage: {
    minWidth: 100,
    minHeight: 100,
    maxWidth: 200,
    maxHeight: 200,
  },
})