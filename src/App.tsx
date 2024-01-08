import { MMKVLoader } from "react-native-mmkv-storage";
import { Router } from "~src/Router";

export const storage = new MMKVLoader().initialize();

export default function App(): JSX.Element {
  return (
    <Router />
  )
}
