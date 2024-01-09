import { PermissionsAndroid } from "react-native";

const permissionStrings = [
  PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
  PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
];

async function hasLocationPermission(){
  return await PermissionsAndroid.check(permissionStrings[0]) || await PermissionsAndroid.check(permissionStrings[1]);
}

async function askLocationPermission(){
  const result1 = await PermissionsAndroid.request(permissionStrings[0])
  const result2 = await PermissionsAndroid.request(permissionStrings[1])
  return (result1 === PermissionsAndroid.RESULTS.GRANTED || result2 === PermissionsAndroid.RESULTS.GRANTED)
}

export async function handleLocationPermission(){
  let locationPermissionGranted = await hasLocationPermission();
  if(!locationPermissionGranted){
    locationPermissionGranted = await askLocationPermission()
  }
  return locationPermissionGranted?'granted':'rejected';
}