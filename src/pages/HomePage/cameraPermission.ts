import { PermissionsAndroid } from "react-native";

const permissionString = PermissionsAndroid.PERMISSIONS.CAMERA;

async function hasCameraPermission(){
  return await PermissionsAndroid.check(permissionString)
}

async function askCameraPermission(){
  const result = await PermissionsAndroid.request(permissionString)
  return result === PermissionsAndroid.RESULTS.GRANTED
}

export async function handleCameraPermission(){
  let cameraPermissionGranted = await hasCameraPermission();
  if(!cameraPermissionGranted){
    cameraPermissionGranted = await askCameraPermission();
  }
  return cameraPermissionGranted?'granted':'rejected';
}