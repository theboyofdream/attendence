import { NavigationContainer } from "@react-navigation/native";
import { NativeStackNavigationOptions, createNativeStackNavigator } from "@react-navigation/native-stack";
import { CameraPage, HomePage, LoginPage } from "~pages";
import { useAuthStore } from "~src/stores";

export type Routes = {
  login: undefined
  home: undefined
  camera: undefined
}

const Stack = createNativeStackNavigator<Routes>();
const options: NativeStackNavigationOptions = {
  headerShown: false,
  animation: 'fade'
}

export function Router() {
  const { user } = useAuthStore()

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={options}>
        {!user.loggedIn ?
          <Stack.Screen name='login' component={LoginPage} />
          :
          <>
            <Stack.Screen name='home' component={HomePage} />
            <Stack.Screen name='camera' component={CameraPage} />
          </>
        }
      </Stack.Navigator>
    </NavigationContainer>
  )
}
