import { PropsWithChildren } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { Screen } from "react-native-screens";

export function Providers(props: PropsWithChildren) {
  return (
    <PaperProvider>
      {props.children}
    </PaperProvider>
  )
}
