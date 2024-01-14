import { ViewProps } from "react-native";
import { Screen as RNScreen } from "react-native-screens";
import { COLORS } from "~src/utils";

export function Screen(props: ViewProps) {
    return (
        <RNScreen {...props} style={[{ backgroundColor: COLORS.background, flex: 1 }, props.style]} />
    )
}
