import { Formik } from "formik";
import { Image, StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import { Input, PaperScreen } from "~components";
import {SPACING} from 'src/contants';
import { STYLES } from "~src/styles";

export function LoginPage() {
	return (
		<PaperScreen style={$.screen}>
			<Image source={require('src/assets/login.jpg')} style={$.loginImage}/>
			<Formik
				initialValues={{}}
				onSubmit={() => { }}
				children={
					() => (
						<View style={STYLES.form}>
							<Input placeholder="Email ID" />
							<Input placeholder="Password" />
							<Button style={$.submitButton} mode="contained">Login</Button>
						</View>
					)
				}
			/>
		</PaperScreen>
	)
}


const $ = StyleSheet.create({
	screen:{
		alignItems:'center',
		justifyContent:'center'
	},
	loginImage:{
		minWidth: 100,
		minHeight: 100,
		maxWidth: 300,
		maxHeight: 300,
		marginBottom: SPACING.lg*2
	},
	submitButton:{
		...STYLES.button,
		alignSelf: 'flex-end'
	}
})