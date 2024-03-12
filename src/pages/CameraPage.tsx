import Geolocation, { GeolocationResponse } from "@react-native-community/geolocation";
import { useAppState } from "@react-native-community/hooks";
import { useIsFocused } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AxiosError } from "axios";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Image as RNImage, Pressable, StyleSheet, View } from "react-native";
import { Image } from "react-native-compressor";
import { Camera, useCameraDevice, useCameraFormat } from "react-native-vision-camera";
import { Button, IconButton, Text } from "~components";
import { Routes } from "~src/App";
import { useDimension } from "~src/hooks";
import { markAttendanceParams, useAttendanceMarker, useMessageHeader } from "~src/stores";
import { COLORS, FONTSIZE, ROUNDNESS, SPACING, URI, dateFns, fetcher } from "~src/utils";
import { useAuthStore } from "~stores";

type CameraPageProps = NativeStackScreenProps<Routes, 'camera'>;
export function CameraPage({ navigation }: CameraPageProps) {
  const { user } = useAuthStore()
  const { width, height } = useDimension();
  const { setMsg } = useMessageHeader()
  const { markAttendance, attendanceMarkedStatus } = useAttendanceMarker()

  const [submitting, setSubmitting] = useState(false)
  const [refreshing, setRefreshing] = useState(false);

  const [geolocation, setGeolocation] = useState<GeolocationResponse | null>();
  const [address, setAddress] = useState('')
  let getAddress = async () => {
    let error = false;
    let message = 'success'
    let address = '';
    if (geolocation) {
      await fetcher.postForm(URI["get address"], {
        user_id: user.id,
        franchise_id: user.franchiseId,
        latitude: geolocation.coords.latitude,
        longitude: geolocation.coords.longitude
      })
        .then(({ status, statusText, data }) => {
          const json = data as {
            status: number,
            message: string
            data: string
          }
          error = !(status === 200 ? (json.status == 200 || json.status == 404) : false);
          message = status < 500 ? json.message : statusText;
          address = json.data
          // console.log(json)
        })
        .catch(e => {
          error = true
          message = (e as AxiosError).message
        })
        .finally(() => {
          if (error) {
            setMsg({
              id: 'address error',
              title: 'Unable to get address',
              description: message,
              type: 'error',
            })
          }

        })
    }
    setAddress(address)
  }
  useEffect(() => {
    getAddress();
  }, [geolocation])
  const [isFakeLocation, setIsFakeLocation] = useState(false)
  const [datetime, setDatetime] = useState<Date | null>(null)

  const [detectedUser, setDetectedUser] = useState(`${user.firstname} ${user.lastname}`)

  const device = useCameraDevice('front')
  const appState = useAppState();
  const appIsFocused = useIsFocused();
  const cameraIsActive = appState === 'active' && appIsFocused;
  const cameraRef = useRef<Camera>(null);

  async function getDateTime(latitude: number, longitude: number) {
    const { status, statusText, data } = await fetcher.get(`${URI.datetime}?latitude=${latitude}&longitude=${longitude}`)
    if (status === 200) {
      // console.log({ datetime: data })
      setDatetime(new Date(data['dateTime']))
    } else {
      setDatetime(new Date());
    }
  }

  const [cameraDimension, setCameraDimension] = useState({ width: width - 10, height: height - 10 });
  useEffect(function onLoad() {
    setTimeout(() => {
      setCameraDimension({
        width,
        height
      })
    }, 500);
  }, [])

  const [image, setImage] = useState<string | null>(null)

  async function init() {
    setRefreshing(true)
    if (geolocation || datetime) {
      setGeolocation(null)
      setDatetime(null)

    }
    Geolocation.getCurrentPosition(async position => {
      if (position && position['mocked'] == true) {
        setIsFakeLocation(true)
        setMsg({
          id: 'mocked',
          title: 'fake location detected',
          description: 'You seem to using fake location app. Please disable.',
          type: 'error'
        })
      };
      setGeolocation(position)
      await getDateTime(position.coords.latitude, position.coords.longitude)
    }, console.error)
    setRefreshing(false)
  }

  const submitBtnDisabled = !cameraIsActive || !geolocation || (attendanceMarkedStatus.inTimeMarked && attendanceMarkedStatus.outTimeMarked) || submitting || refreshing
  function closePreview() {
    setImage(null)
  }

  async function capture() {
    let picInfo = await cameraRef.current?.takePhoto({ qualityPrioritization: 'quality' })
    if (picInfo && picInfo.path) {
      const compressedImagePath = await Image.compress(`file://${picInfo.path}`);
      setImage(compressedImagePath)
    }
  }

  async function submit() {
    setSubmitting(true)

    if (image && geolocation && datetime) {
      let params: markAttendanceParams = {
        location: {
          address: address,
          latitude: geolocation.coords.latitude,
          longitude: geolocation.coords.longitude,
        },
        imageUri: image,
        datetime: datetime
      }
      let success = false
      if (!attendanceMarkedStatus.inTimeMarked) {
        success = await markAttendance(params, 'in time')
      } else if (!attendanceMarkedStatus.outTimeMarked) {
        success = await markAttendance(params, 'out time')
      }
      success && back()
    }
    setSubmitting(false)
  }

  function back() {
    navigation.canGoBack() && navigation.goBack();
  }

  return (
    <>
      <IconButton
        iconName="arrow-back"
        type='icon'
        variant='primary'
        // style={{ position: 'absolute', top: 0, left: 0, margin: SPACING.lg, zIndex: 99, backgroundColor: '#ffffff60', borderColor: '#ffffff10' }}
        style={{ position: 'absolute', top: 0, left: 0, margin: SPACING.lg, zIndex: 99 }}
        onPress={back}
      />
      {
        device &&
        <>
          <Camera
            style={
              // StyleSheet.absoluteFill
              [
                StyleSheet.absoluteFill,
                {
                  width: cameraDimension.width * 1.3,
                  height: cameraDimension.height,
                  left: -100,
                }
              ]
            }
            ref={cameraRef}
            device={device}
            isActive={cameraIsActive}
            resizeMode={"contain"}
            orientation={"portrait"}
            enableFpsGraph={true}
            onInitialized={init}
            photo={true}
            zoom={0}
            enableHighQualityPhotos
          />
          <Pressable
            style={{
              padding: SPACING.sm * 0.5,
              borderRadius: ROUNDNESS.circle,
              aspectRatio: 1,
              // backgroundColor: COLORS.background,
              position: 'absolute',
              bottom: 0,
              alignSelf: 'center',
              marginBottom: SPACING.lg * 2,
              justifyContent: 'center',
              alignItems: 'center',
              width: FONTSIZE.lg * 3.5,
              borderWidth: FONTSIZE.xxs * 0.3,
              borderColor: COLORS.background,

            }}
            onPress={capture}
            children={<View style={{
              flex: 1,
              width: '100%',
              height: '100%',
              borderRadius: ROUNDNESS.circle,
              backgroundColor: COLORS.background,
            }} />}
          />
        </>
      }
      {
        image &&
        <View
          style={[StyleSheet.absoluteFill, { backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', zIndex: 9999, gap: SPACING.lg * 2 }]}
        >
          <IconButton
            iconName="close"
            type='icon'
            style={{ position: 'absolute', top: 0, right: 0, margin: SPACING.lg }}
            disabled={submitting}
            onPress={closePreview}
          />

          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text variant='caption' style={{ opacity: 0.3 }}>{'PUNCH '}</Text>
            <Text variant='title'>{attendanceMarkedStatus.inTimeMarked ? 'OUT' : 'IN'}</Text>
          </View>

          <RNImage source={{ uri: image }} resizeMode="contain" style={{ width: width, height: height * 0.3, minHeight: 300, maxHeight: 400 }} />

          <View style={{ width: '60%', maxWidth: 400, gap: SPACING.md }}>
            <Text style={{ fontSize: FONTSIZE.md }}>{detectedUser}</Text>
            {
              geolocation &&
              <View>
                <Text variant="caption" style={{ opacity: 0.3 }}>latitude, longitude: </Text>
                <Text>{geolocation.coords.latitude}, {geolocation.coords.longitude}</Text>
              </View>
            }
            <View>
              <Text variant="caption" style={{ opacity: 0.3 }}>address: </Text>
              <Text>{address}</Text>
            </View>
            <Text variant='caption' style={{ textAlign: 'right', fontStyle: 'italic', opacity: 0.6 }}>{datetime && dateFns.toHumanReadleDate(datetime)}</Text>
          </View>

          <View style={{ flexDirection: 'row', gap: SPACING.lg }}>
            <Button title="refresh" leftIconName="refresh" onPress={init} disabled={submitting || refreshing} />
            <Button title="Submit" variant='primary' disabled={submitBtnDisabled || address.length < 1} onPress={submit} />
          </View>

          <Text style={$.logger}>
            {refreshing && 'Refreshing...'}
            {submitting && 'Saving...'}
          </Text>
        </View>
      }
    </>
  )
}


const $ = StyleSheet.create({
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    padding: SPACING.lg * 2,
    gap: SPACING.md,
    backgroundColor: COLORS.background,
    width: '100%',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  logger: {
    bottom: SPACING.lg * 2,
    position: 'absolute'
  }
})