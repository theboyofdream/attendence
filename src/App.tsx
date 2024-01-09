import { NavigationContainer } from "@react-navigation/native";
import { NativeStackNavigationOptions, createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView, StatusBar } from "react-native";
import { MMKVLoader } from "react-native-mmkv-storage";
import { CameraPage, HomePage, LoginPage } from "~pages";
import { useAuthStore } from "~stores";

export const storage = new MMKVLoader().initialize();

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


export default function App(): JSX.Element {
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
