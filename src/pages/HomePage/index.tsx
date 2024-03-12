import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlatList, Image, Pressable, RefreshControl, StyleSheet, View, Text as RNText, Linking, ToastAndroid } from "react-native";
import { Button, IconButton, Overlay, Screen, Spacer, Text, textStyle } from "~components";
import { Routes } from "~src/App";
import { APP_VERSION, COLORS, FONTSIZE, ROUNDNESS, SPACING, URI } from "~src/utils";
import { attendanceList, statusTypes, useAttendanceList, useAuthStore, useMessageHeader, useTypesOfAttendanceStatus } from "~stores";
import { Stats, statsStatusType } from "./Stats";
import { handleCameraPermission } from "./cameraPermission";
import { handleLocationPermission } from "./locationPermission";
import { useEffect, useMemo, useState } from "react";
import { isLocationEnabled, promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';
import { dateFns } from "~utils";
import { useAttendanceMarker } from "~src/stores/useAttendanceMarker";
import { AttendanceList, AttendanceListSkeleton } from "./AttendanceList";
import { useIsFocused } from "@react-navigation/native";
import axios, { AxiosError } from "axios";
import * as fs from 'react-native-fs'
import SendIntentAndroid from "react-native-send-intent";

// const APP_VERSION = 0.00
type appInfo = {
  id: number;
  name: string;
  message: string;
  version: number;
  uri: string;
}
function parseAppInfoJson(json: { [key: string]: string }): appInfo {
  return {
    id: parseInt(json['pk_apk_version_id']) || 0,
    name: json['apk_category'] || '',
    message: json['msg'] || '',
    version: parseFloat(json['version_no']) || 0,
    uri: json['apk_path'] || ''
  }
}



type HomePage = NativeStackScreenProps<Routes, 'home'>
export function HomePage({ navigation }: HomePage) {
  const { user, logout } = useAuthStore();
  const { setMsg } = useMessageHeader();
  const isScreenFocused = useIsFocused()
  const { attendanceMarkedStatus, setAttendanceMarkedStatus } = useAttendanceMarker();
  const { statusTypes, refreshStatusTypes } = useTypesOfAttendanceStatus()

  const { attendanceList, getAttendanceList, attendanceSummary, getAttendanceSummary } = useAttendanceList()

  const statusTypesObject = useMemo(() => {
    let obj = {} as { [key: number]: statsStatusType }
    statusTypes.forEach(statusType => { obj[statusType.id] = { ...statusType, count: 0 } })

    for (let list of attendanceList) {
      if (list.date?.getDate() == (new Date()).getDate()) {
        setAttendanceMarkedStatus({
          inTimeMarked: list.punchIn.time != null,
          outTimeMarked: list.punchOut.time != null,
          lastModified: new Date()
        })
        break;
      }
    }

    for (let k in attendanceSummary) {
      obj[k].count = attendanceSummary[k]
    }

    return obj;
  }, [statusTypes, attendanceList, attendanceSummary])

  const [loading, setLoading] = useState(false);

  const [date, setDate] = useState(new Date())
  const month = useMemo(() => dateFns.getMonthInfo(date), [date])
  const year = useMemo(() => date.getFullYear(), [date]);
  useEffect(() => {
    if (isScreenFocused) {
      loadAttendance(year, month.index)
    }
  }, [date, isScreenFocused])

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
    if (Object.values(statusTypesObject).length < 1) {
      await refreshStatusTypes()
    }
    await getAttendanceList(year, month)
    await getAttendanceSummary(year, month)
    setLoading(false)
  }

  const [userProfileVisible, setUserProfileVisibility] = useState(false);
  const showUserProfile = () => setUserProfileVisibility(true)
  const hideUserProfile = () => setUserProfileVisibility(false)

  const [selectedAttendanceDetail, setSelectedAttendanceDetail] = useState<attendanceList | null>()
  const [fullScreenImageforPreview, setFullScreenImageforPreview] = useState<string | null>()
  const [appInfo, setAppInfo] = useState<{ error: boolean, message: string, data: appInfo }>({
    error: false,
    message: 'success',
    data: parseAppInfoJson({})
  })
  async function checkForAppUpdate(showToast?: boolean) {
    let error = false, message = 'success', appInfo = parseAppInfoJson({});
    await axios.postForm(URI['app update'], { apk_name: 'dhwajattendence' })
      .then(({ data, status, statusText }) => {
        let res = data as { status: number, message: string, data: { [key: string]: string }/* appInfo */ }
        error = !(status === 200 ? res.status == 200 : false);
        message = status === 200 ? res.message : statusText;
        if (!error) {
          appInfo = parseAppInfoJson(res.data)
        }
      })
      .catch(err => {
        error = true;
        message = (err as AxiosError).message
      })

    if (appInfo.version < APP_VERSION && showToast) {
      ToastAndroid.show('Already app is of latest version.', ToastAndroid.LONG)
    }

    setAppInfo({
      error,
      message,
      data: appInfo
    })
  }
  useEffect(() => {
    checkForAppUpdate()
  }, [])

  const [downloadingUpdate, setDownloadingUpdate] = useState(false)
  const [updateDownloadingProgress, setUpdateDownloadProgress] = useState(0)
  async function downloadUpdate() {
    setDownloadingUpdate(true)
    let filePath = fs.CachesDirectoryPath + `/com.attendence.apk`;
    let download = fs.downloadFile({
      fromUrl: appInfo.data.uri,
      toFile: filePath,
      progress: res => {
        const progress = (res.bytesWritten / res.contentLength) * 100;
        setUpdateDownloadProgress(Math.round(progress))
      },
      progressDivider: 1
    });
    await download.promise.then(result => {
      if (result.statusCode == 200) {
        SendIntentAndroid.openFileChooser(
          {
            fileUrl: `${filePath}`,
            type: "application/vnd.android.package-archive",
          },
          "Install update"
        )
      }
    })
    setDownloadingUpdate(false)
  }

  return (
    <>
      <Screen style={$.screen}>

        <View style={$.header}>
          {/* <IconButton iconName="menu" onPress={showUserProfile} /> */}
          <Button leftIconName="menu" title="menu" onPress={showUserProfile} />
          {/* <Text>Attendance</Text> */}
        </View>


        <View style={$.nav}>
          <IconButton
            iconName="chevron-left"
            onPress={() => setDate(dateFns.addMonth(date, -1))}
            disabled={loading || !dateFns.compareMonth(date, user.dateOfJoining)}
            style={{ opacity: !dateFns.compareMonth(date, user.dateOfJoining) ? 0 : 1 }}
          />
          <Text style={{ fontWeight: 'bold' }}>{month.longName}, {date.getFullYear()}</Text>
          <IconButton
            iconName="chevron-right"
            onPress={() => setDate(dateFns.addMonth(date, 1))}
            disabled={loading || dateFns.compareMonth(date, new Date)}
            style={{ opacity: dateFns.compareMonth(date, new Date) ? 0 : 1 }}
          />
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

        {!loading && attendanceList.length > 0 &&
          <FlatList
            style={{ flex: 1, flexGrow: 1 }}
            ListFooterComponent={<View style={{ height: SPACING.lg * 6 }} />}
            contentContainerStyle={{ gap: SPACING.md, flexGrow: 1, /* backgroundColor: COLORS.text + '08', padding: SPACING.sm, borderRadius: ROUNDNESS.md */ }}
            data={attendanceList.reverse()}
            keyExtractor={(item, index) => `${index}`}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={() => loadAttendance(year, month.index)} />
            }
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
                        approvalStatusName: statusTypesObject[item.punchIn.approvalStatus]?.name || ''
                      }}
                      punchOut={{
                        time: item.punchOut.time ? dateFns.toReadable(item.punchOut.time, 'time') : '',
                        approvalStatusName: statusTypesObject[item.punchIn.approvalStatus]?.name || ''
                      }}
                      onPress={() => setSelectedAttendanceDetail(item)}
                    />
                  }
                </>)
            }}
          />
        }

        {
          !loading && attendanceList.length < 1 &&
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: SPACING.lg, marginBottom: SPACING.lg * 5 }}>
            <Image source={require('assets/illustrations/not-found.png')} style={$.notFoundImage} />
            <Text>Not Found anything!</Text>
            <View>
              <Button title="refresh" variant="secondary" onPress={() => loadAttendance(year, month.index)} />
            </View>
          </View>
        }

        {
          (!attendanceMarkedStatus.inTimeMarked || !attendanceMarkedStatus.outTimeMarked) && !loading &&
          <Button
            title={!attendanceMarkedStatus.inTimeMarked ? 'Mark In Time' : !attendanceMarkedStatus.outTimeMarked ? 'Mark Out Time' : 'Already Marked'}
            variant={!attendanceMarkedStatus.inTimeMarked ? 'infoFilled' : !attendanceMarkedStatus.outTimeMarked ? 'dangerFilled' : 'primary'}
            style={$.markAttendanceBtn}
            leftIconName="photo-camera"
            onPress={gotoCameraPage}
            disabled={loading}
          />
        }
      </Screen>
      {
        userProfileVisible &&
        <Overlay
          style={{ justifyContent: 'flex-end' }}
          onPress={hideUserProfile}
        >
          <View style={{
            backgroundColor: COLORS.background,
            padding: SPACING.lg,

            width: '100%',
            borderTopColor: COLORS.backgroundSecondary,
            borderTopWidth: SPACING.xs,
            elevation: 24,
            // flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: SPACING.lg,
          }}>

            <IconButton
              iconName="close"
              type='icon'
              variant='danger'
              style={{ alignSelf: 'flex-end', }}
              onPress={hideUserProfile}
            />

            <Pressable onPress={() => setFullScreenImageforPreview(user.picture)}>
              <Image
                source={{ uri: user.picture }}
                style={{
                  width: '30%',
                  padding: SPACING.md,
                  alignSelf: 'center',
                  aspectRatio: 1,
                  borderRadius: ROUNDNESS.circle,
                }} />
            </Pressable>

            <View>
              <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
                <Text variant="title" style={{ textTransform: 'capitalize', height: FONTSIZE.lg * 1.2 }}>{user.firstname} {user.lastname}</Text>
                <Text variant="caption" style={{ opacity: 0.5 }}>#{user.id}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                <Text variant="caption" style={{ opacity: 0.5 }}>Joining Date: </Text>
                <Text>{user.dateOfJoining ? dateFns.toReadable(user.dateOfJoining, 'date') : ''}</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text variant="caption" style={{ opacity: 0.5 }}>app version: </Text>
              <Text>{APP_VERSION}</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
              <Button variant='dangerText' title="check for app update" onPress={async () => {
                checkForAppUpdate(true)
              }} />
              <Button variant='danger' leftIconName="logout" title="logout" onPress={logout} /*style={{ alignSelf: 'center' }}*/ />
            </View>

          </View>
        </Overlay>
      }
      {
        selectedAttendanceDetail &&
        <Overlay
          style={{ justifyContent: 'flex-end' }}
          onPress={() => setSelectedAttendanceDetail(null)}
        >
          <View
            style={{
              backgroundColor: COLORS.background,
              padding: SPACING.lg,
              // paddingBottom: SPACING.lg * 3,

              width: '100%',
              borderTopColor: COLORS.backgroundSecondary,
              borderTopWidth: SPACING.xs,
              elevation: 24,
              // flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',

              // alignSelf: 'flex-end',
              // gap: SPACING.lg,
            }}>
            {/* 
            <IconButton
              iconName="close"
              type='icon'
              variant='danger'
              style={{ alignSelf: 'flex-end', }}
              // style={{ position: 'absolute', top: 0, right: 0, margin: SPACING.lg }}
              onPress={() => setSelectedAttendanceDetail(null)}
            /> */}

            <Spacer size={SPACING.lg} />
            {selectedAttendanceDetail.date && <Text variant='title'>{dateFns.toReadable(selectedAttendanceDetail.date, 'date')}</Text>}
            <Spacer size={SPACING.lg} />

            <View style={{ backgroundColor: COLORS.infoBackground, padding: SPACING.sm, paddingVertical: SPACING.lg, borderRadius: ROUNDNESS.lg * 2 }}>
              <View style={[$.row, { paddingHorizontal: SPACING.lg, width: '100%' }]}>
                <Pressable
                  style={{ justifyContent: 'center', alignItems: 'center', gap: SPACING.lg }}
                  onPress={() => {
                    selectedAttendanceDetail.punchIn.pic && setFullScreenImageforPreview('https://sahikarma.com/writable/uploads/attandance/' + selectedAttendanceDetail.punchIn.pic)
                  }}>
                  <Image
                    source={{
                      uri:
                        selectedAttendanceDetail.punchIn.pic ?
                          'https://sahikarma.com/writable/uploads/attandance/' + selectedAttendanceDetail.punchIn.pic :
                          'https://placehold.jp/100x100.png'
                    }}
                    style={{
                      width: 80,
                      aspectRatio: 1,
                      borderRadius: ROUNDNESS.circle,
                    }}
                  />
                  <Button
                    compact
                    title="view"
                    variant='infoFilled'
                    style={{ alignSelf: 'auto' }}
                    onPress={() => {
                      selectedAttendanceDetail.punchIn.pic && setFullScreenImageforPreview('https://sahikarma.com/writable/uploads/attandance/' + selectedAttendanceDetail.punchIn.pic)
                    }}
                  />
                </Pressable>
                <View style={{ flex: 1, }}>
                  <Text variant='title'>Punch IN</Text>
                  <View style={$.row}>
                    <Text variant='info'>Punched in at - </Text>
                    <Text>{selectedAttendanceDetail.punchIn.time && dateFns.toReadable(selectedAttendanceDetail.punchIn.time, 'time')}</Text>
                  </View>
                  <View style={$.row}>
                    <Text variant='info' /*style={{ opacity: 0.3 }}*/>Approval status - </Text>
                    <Text>{statusTypesObject[selectedAttendanceDetail.punchIn.approvalStatus]?.name || ''}</Text>
                  </View>
                  <RNText>
                    <RNText style={{
                      fontSize: FONTSIZE.xs,
                      fontFamily: 'Poppins-Regular',
                      color: COLORS.infoText,
                    }}>Location - </RNText>
                    <Text>{selectedAttendanceDetail.punchIn.location}</Text>
                  </RNText>
                </View>
              </View>
            </View>
            <Spacer size={SPACING.md} />
            <View style={{ backgroundColor: COLORS.infoBackground, padding: SPACING.sm, paddingVertical: SPACING.lg, borderRadius: ROUNDNESS.lg * 2 }}>
              <View style={[$.row, { paddingHorizontal: SPACING.lg, width: '100%' }]}>
                <Pressable
                  style={{ justifyContent: 'center', alignItems: 'center', gap: SPACING.lg }}
                  onPress={() => {
                    selectedAttendanceDetail.punchOut.pic && setFullScreenImageforPreview('https://sahikarma.com/writable/uploads/attandance/' + selectedAttendanceDetail.punchOut.pic)
                  }}>
                  <Image
                    source={{
                      uri:
                        selectedAttendanceDetail.punchOut.pic ?
                          'https://sahikarma.com/writable/uploads/attandance/' + selectedAttendanceDetail.punchOut.pic :
                          'https://placehold.jp/100x100.png'
                    }}
                    style={{
                      width: 80,
                      aspectRatio: 1,
                      borderRadius: ROUNDNESS.circle,
                    }}
                  />
                  <Button
                    compact
                    title="view"
                    variant='infoFilled'
                    style={{ alignSelf: 'auto' }}
                    onPress={() => {
                      selectedAttendanceDetail.punchOut.pic && setFullScreenImageforPreview('https://sahikarma.com/writable/uploads/attandance/' + selectedAttendanceDetail.punchOut.pic)
                    }}
                  />
                </Pressable>
                <View style={{ flex: 1, }}>
                  <Text variant='title'>Punch OUT</Text>
                  <View style={$.row}>
                    <Text variant='info'>Punched out at - </Text>
                    <Text>{selectedAttendanceDetail.punchOut.time && dateFns.toReadable(selectedAttendanceDetail.punchOut.time, 'time')}</Text>
                  </View>
                  <View style={$.row}>
                    <Text variant='info'>Approval status - </Text>
                    <Text>{statusTypesObject[selectedAttendanceDetail.punchOut.approvalStatus]?.name || ''}</Text>
                  </View>
                  <RNText>
                    <RNText style={{
                      fontSize: FONTSIZE.xs,
                      fontFamily: 'Poppins-Regular',
                      color: COLORS.infoText,
                    }}>Location - </RNText>
                    <Text>{selectedAttendanceDetail.punchOut.location}</Text>
                  </RNText>
                </View>
              </View>
            </View>

            <Spacer size={SPACING.lg} />
            <Button variant='danger' leftIconName="close" title="close" style={{ alignSelf: 'center' }} onPress={() => setSelectedAttendanceDetail(null)} />

          </View>
        </Overlay>
      }
      {
        fullScreenImageforPreview &&
        <Overlay zIndex={99} onPress={() => setFullScreenImageforPreview(null)}>
          <Image
            src={fullScreenImageforPreview}
            style={StyleSheet.absoluteFill}
          />
          <Button
            style={{
              position: 'absolute',
              bottom: 0,
              alignSelf: 'center',
              margin: SPACING.lg,
            }}
            variant='dangerFilled'
            title="close"
            onPress={() => setFullScreenImageforPreview(null)}
          />
        </Overlay>
      }
      {
        appInfo.data.version > APP_VERSION &&
        <Overlay zIndex={999} style={{ justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: COLORS.background, padding: SPACING.lg * 2, borderRadius: ROUNDNESS.lg * 2, minWidth: 300, maxWidth: 400, marginHorizontal: SPACING.lg }}>
            <Text variant='title'>Update</Text>
            <Text>{appInfo.data.message}</Text>

            <Spacer size={SPACING.lg} />

            {/* <Text style={{ opacity: 0.5 }}>Download from url - </Text>
            <Pressable onPress={() => Linking.openURL(appInfo.data.uri)}>
              <Text variant='info'>{appInfo.data.uri}</Text>
            </Pressable> */}
            <Pressable onPress={() => Linking.openURL(appInfo.data.uri)} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text variant='info'>Download from browser </Text>
              <IconButton compact iconName="open-in-new" iconStyle={{ color: COLORS.infoText }} onPress={() => Linking.openURL(appInfo.data.uri)} />
            </Pressable>

            {
              downloadingUpdate &&
              <>
                <Spacer size={SPACING.lg} />
                <View style={{ gap: 8, alignItems: 'center' }}>
                  <Text >Downloading {updateDownloadingProgress}%</Text>
                  <View style={{ width: '100%', height: 6, borderRadius: 3, backgroundColor: COLORS.text + '20' }}>
                    <View style={{ width: `${updateDownloadingProgress}%`, height: '100%', borderRadius: 3, backgroundColor: COLORS.infoText }} />
                  </View>
                </View>
              </>
            }

            <Spacer size={SPACING.lg * 2} />

            <Button
              variant='infoFilled'
              title={downloadingUpdate ? "downloading" : "Update"}
              style={{ alignSelf: 'flex-end' }}
              onPress={downloadUpdate}
              disabled={downloadingUpdate}
            />
            <View>

            </View>
          </View>
        </Overlay>
      }
    </>
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
    // justifyContent: 'center',
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
    margin: SPACING.lg * 1.5,
    // alignSelf: 'flex-end'
  },
  notFoundImage: {
    minWidth: 100,
    minHeight: 100,
    maxWidth: 150,
    maxHeight: 150,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.lg
  }
})

