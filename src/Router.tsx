import { NavigationContainer } from "@react-navigation/native";
import { NativeStackNavigationOptions, createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginPage,HomePage,CameraPage } from "~pages";

export type Routes ={
  login: undefined
  home: undefined
  camera: undefined
}

const Stack = createNativeStackNavigator<Routes>();
const options: NativeStackNavigationOptions = {
  headerShown: false
}

export function Router() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={options}>
        <Stack.Screen name='login' component={LoginPage}/>
        <Stack.Screen name='home' component={HomePage}/>
        <Stack.Screen name='camera' component={CameraPage}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}
