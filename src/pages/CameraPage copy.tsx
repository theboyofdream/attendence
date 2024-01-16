import Geolocation, { GeolocationResponse } from "@react-native-community/geolocation";
import { useAppState } from "@react-native-community/hooks";
import { useIsFocused } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useRef, useState } from "react";
import { Image as RNImage, Pressable, StyleSheet, View } from "react-native";
import { Image, getImageMetaData } from "react-native-compressor";
import { Camera, useCameraDevice, useCameraFormat } from "react-native-vision-camera";
import { Button, IconButton, Screen, Text } from "~components";
import { Routes } from "~src/App";
import { useDimension } from "~src/hooks";
import { markAttendanceParams, useAttendanceMarkedStatus } from "~src/stores/useAttendanceMarkedStatus";
import { COLORS, FONTSIZE, SPACING, URI, fetcher } from "~src/utils";
import { useAuthStore } from "~stores";

type CameraPageProps = NativeStackScreenProps<Routes, 'camera'>;
export function CameraPage({ navigation }: CameraPageProps) {
  const { user } = useAuthStore()
  const { width, height, scale } = useDimension();
  const { markAttendance, attendanceMarkedStatus } = useAttendanceMarkedStatus()

  const [submitting, setSubmitting] = useState(false)
  const [refreshing, setRefreshing] = useState(false);

  const [loadingGeolocation, setLoadingGeolocation] = useState(false);
  const [geolocation, setGeolocation] = useState<GeolocationResponse>();
  const [datetime, setDatetime] = useState<Date | null>(null)

  const [detectedUser, setDetectedUser] = useState(`${user.firstname} ${user.lastname}`)

  const device = useCameraDevice('front')
  const appState = useAppState();
  const appIsFocused = useIsFocused();
  const cameraIsActive = appState === 'active' && appIsFocused;
  const cameraRef = useRef<Camera>(null);
  const [isCameraInitialized, setIsCameraInitialized] = useState(false)

  async function getLocation() {
    await Geolocation.getCurrentPosition(setGeolocation, console.error)
  }

  async function getDateTime(latitude: number, longitude: number) {

    const { status, statusText, data } = await fetcher.get(`${URI.datetime}?latitude=${latitude}&longitude=${longitude}`)
    if (status === 200) {
      console.log({ datetime: data })
      setDatetime(new Date(data['dateTime']))
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
    Geolocation.getCurrentPosition(async position => {
      setGeolocation(position)
      await getDateTime(position.coords.latitude, position.coords.longitude)
    }, console.error)
    setRefreshing(false)
  }

  return (
    <Screen>
      <IconButton
        iconName="close"
        type='icon'
        variant="primary"
        style={{ position: 'absolute', top: 0, right: 0, margin: SPACING.lg, zIndex: 99 }}
        onPress={() => navigation.canGoBack() && navigation.goBack()}
      />
      {
        device &&
        <Camera
          style={[StyleSheet.absoluteFill, {
            width: cameraDimension.width,
            height: cameraDimension.height,
            pointerEvents: 'none',
          }]}
          ref={cameraRef}
          device={device}
          isActive={cameraIsActive}
          resizeMode={"contain"}
          orientation="portrait"
          enableFpsGraph={true}
          onInitialized={async () => {
            await init()
            setIsCameraInitialized(true)
          }}
          photo={true}
          enableHighQualityPhotos
        />
      }
      {
        image &&
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => {
            setImage(null)
          }}>
          <RNImage source={{ uri: image }} resizeMode="center" style={[StyleSheet.absoluteFill]} />
        </Pressable>
      }
      <View style={$.bottomSheet}>
        <View>
          <Text>Name: {detectedUser}</Text>
          <Text>Address: {JSON.stringify(geolocation)}</Text>
          <Text>Date Time: {datetime?.toLocaleString()}</Text>
        </View>
        <View style={$.actions}>
          <Button
            title="refresh location"
            variant="infoText"
            leftIconName="refresh"
            style={{ paddingHorizontal: 0 }}
            onPress={init}
            disabled={refreshing}
          />
          <Button
            title="submit"
            variant="primary"
            disabled={!isCameraInitialized || !cameraIsActive || !geolocation || (attendanceMarkedStatus.inTimeMarked && attendanceMarkedStatus.outTimeMarked) || submitting}
            onPress={async () => {
              setSubmitting(true)
              let picInfo = await cameraRef.current?.takePhoto({ qualityPrioritization: 'quality' })
              if (picInfo && picInfo.path && geolocation && datetime) {
                const compressedImagePath = await Image.compress(`file://${picInfo.path}`);
                // const compressedImageMetaData = await getImageMetaData(compressedImagePath)
                // console.log({ compressedImage: compressedImagePath, compressedImageMetaData })
                // setImage(`file://${picInfo.path}`)
                setImage(compressedImagePath)

                let params: markAttendanceParams = {
                  location: {
                    address: "",
                    latitude: geolocation.coords.latitude,
                    longitude: geolocation.coords.longitude,
                  },
                  imageUri: compressedImagePath,
                  datetime: datetime
                }
                let success = false
                if (!attendanceMarkedStatus.inTimeMarked) {
                  success = await markAttendance(params, 'in time')
                } else if (!attendanceMarkedStatus.outTimeMarked) {
                  success = await markAttendance(params, 'out time')
                }

                // console.log({ success })

                if (success) {
                  // navigation.canGoBack() && navigation.goBack()
                }
              }
              setSubmitting(false)
            }} />
        </View>
      </View>

    </Screen>
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
    zIndex: 9999
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
})