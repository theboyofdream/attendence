import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScrollView, StyleSheet, View, ViewStyle } from "react-native";
import { Button, Screen, Text } from "~components";
import { Routes } from "~src/App";
import { COLORS, SPACING } from "~src/theme";
import { useAuthStore } from "~stores";
import { Stats } from "./Stats";
import { handleCameraPermission } from "./cameraPermission";
import { handleLocationPermission } from "./locationPermission";
import { useEffect } from "react";
import { isLocationEnabled,promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';

type HomePage = NativeStackScreenProps<Routes, 'home'>
export function HomePage({ navigation }: HomePage) {
  const { logout } = useAuthStore();

  async function checkp(){
    const checkEnabled: boolean = await isLocationEnabled();
    console.log('checkEnabled', checkEnabled)
  }

  useEffect(() => {
   
  }, [])

  async function gotoCameraPage() {
    const cameraPermissionGranted = await handleCameraPermission() === 'granted';
    const locationPermissionGranted = await handleLocationPermission() === 'granted';
    let locationEnabled = await isLocationEnabled();

    if(!locationEnabled){
      let result = await promptForEnableLocationIfNeeded();
      if(result === 'already-enabled' || result === 'enabled'){
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
        <Text variant="subTitle">My Attendence</Text>
        <Button variant="dangerText" title="logout" leftIconName="logout" style={{ minWidth: 0 }} titleStyle={{ fontWeight: 'bold' }} onPress={logout} />
      </View>
      <View style={$.nav}>
        <Button leftIconName="chevron-left" style={{ minWidth: 0 }} />
        <Text style={{ fontWeight: 'bold' }}>January, 2023</Text>
        <Button leftIconName="chevron-right" style={{ minWidth: 0 }} />
      </View>
      <Stats />
      <Text variant="danger" style={{
        marginHorizontal: SPACING.md
      }}>Pending Approvals</Text>

      <ScrollView style={{ flex: 1 }} />

      <Button
        title="Mark Attendence"
        variant="primary"
        style={{
          position: 'absolute',
          bottom: SPACING.lg,
          right: SPACING.lg
        }}
        leftIconName="photo-camera"
        onPress={gotoCameraPage}
      />
    </Screen>
  )
}


const $ = StyleSheet.create({
  screen: {
    paddingHorizontal: SPACING.lg,
  },
  header: {
    marginVertical: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
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
})
