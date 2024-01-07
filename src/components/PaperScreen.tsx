import { StyleSheet, ViewProps } from "react-native";
import { useTheme } from "react-native-paper";
import { Screen } from "react-native-screens";

export function PaperScreen(props: ViewProps){
    const {colors} = useTheme();
    return(
        <Screen {...props} style={[{backgroundColor:colors.background},StyleSheet.absoluteFill,props.style]}/>
    )
}