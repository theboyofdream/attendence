import Geolocation, { GeolocationResponse } from "@react-native-community/geolocation";
import { useAppState } from "@react-native-community/hooks";
import { useIsFocused } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Camera, useCameraDevice, useCameraFormat } from "react-native-vision-camera";
import { Button, Screen, Text } from "~components";
import { Routes } from "~src/App";
import { useDimension } from "~src/hooks";
import { COLORS, SPACING } from "~src/theme";

const fps = 60;

type CameraPageProps = NativeStackScreenProps<Routes, 'camera'>;
export function CameraPage({ navigation }: CameraPageProps) {
  const { width, height } = useDimension();
  const screenAspectRatio = height / width;
  const [geolocation, setGeolocation] = useState<GeolocationResponse>();
  const device = useCameraDevice('front')
  const deviceFormat = useCameraFormat(device, [
    { fps },
    { videoAspectRatio: screenAspectRatio },
    { videoResolution: 'max' },
    { photoAspectRatio: screenAspectRatio },
    { photoResolution: 'max' },
  ])
  const cameraIsActive = useAppState() === 'active' && useIsFocused();

  async function getLocation() {
    Geolocation.getCurrentPosition(
      setGeolocation,
      console.error
    )
  }

  // console.log(screenAspectRatio,width,height);

  useEffect(() => {
    getLocation()
  }, []);

  return (
    <Screen>
      {
        device &&
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={cameraIsActive}
          resizeMode="contain"
          format={deviceFormat}
          orientation="portrait"
          zoom={0}
          enableZoomGesture={false}
        />
      }
      <Button
        style={{
          position: 'absolute',
          top: SPACING.lg,
          right: SPACING.lg,
          minWidth: 0,
          zIndex: 3
        }}
        rightIconName="close"
        onPress={() => navigation.canGoBack() && navigation.goBack()}
      />
      <View style={{
        position: 'absolute',
        bottom: 0,
        padding: SPACING.lg * 2,
        backgroundColor: COLORS.background,
      }}>
        <Text>Name: ALL BLACK</Text>
        <Text>Address: {JSON.stringify(geolocation)}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Button
            title="refresh location"
            variant="infoText"
            leftIconName="refresh"
            style={{ paddingHorizontal: 0 }}
            onPress={() => {
              setGeolocation(() => undefined);
              getLocation()
            }} />
          <Button
            title="submit"
            variant="primary"
            // style={{minWidth:0}}
            onPress={() => {
              // setGeolocation(() => undefined);
              // getLocation()
            }} />
        </View>
      </View>
    </Screen>
  )
}
