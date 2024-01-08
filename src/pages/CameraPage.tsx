import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Screen } from "~components";
import { Routes } from "~src/Router";
import { SPACING } from "~src/theme";

type CameraPageProps = NativeStackScreenProps<Routes, 'camera'>;

export function CameraPage({ navigation }: CameraPageProps) {
  //   if (Platform.Version < 29) {
  //     alwaysPermission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
  //   } else {
  //     alwaysPermission = PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION;
  //   }
  // }
  return (
    <Screen>
      <Button
        style={{
          position: 'absolute',
          top: SPACING.lg,
          right: SPACING.lg,
          minWidth: 0
        }}
        rightIconName="close"
        onPress={() => navigation.canGoBack() && navigation.goBack()}
      />
    </Screen>
  )
}
