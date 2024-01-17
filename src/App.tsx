import { NavigationContainer } from "@react-navigation/native";
import { NativeStackNavigationOptions, createNativeStackNavigator } from "@react-navigation/native-stack";
import { CameraPage, HomePage, LoginPage } from "~pages";
import { useAuthStore, useMessageHeader } from "~stores";
import { MessageHeader } from "~components";
import { SafeAreaView, StatusBar } from "react-native";
import { COLORS } from "./utils/theme";
import { useEffect } from "react";
import { GlobalProvider } from "./GlobalProvider copy";

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
  const { setMsg } = useMessageHeader()

  useEffect(() => {
    setMsg(null)
  }, [])

  return (
    // <GlobalProvider>
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        backgroundColor={COLORS.background}
        barStyle="dark-content"
      />
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
      <MessageHeader />
    </SafeAreaView>
    // </GlobalProvider>
  )
}