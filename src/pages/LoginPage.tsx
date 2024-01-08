import { Formik } from "formik";
import { Image, StyleSheet, View } from "react-native";
import * as Yup from 'yup';
import { Button, Input, Screen, Text } from "~components";
import { SPACING } from '~src/theme';
import { useAuthStore } from "~stores";

const LOGIN_SCHEMA = Yup.object().shape({
	email: Yup.
		string()
		.required('Email is required')
		.email('Invalid email'),
	password: Yup
		.string()
		.required('Password is required')
		.min(8, 'Password must contain at least 8 characters')
})

export function LoginPage() {
	const { user, login } = useAuthStore()

	return (
		<Screen style={$.screen}>
			<Text variant="title">ATTENDENCE LOGIN</Text>
			<Image source={require('src/assets/login.jpg')} style={$.loginImage} />
			<Formik
				initialValues={{ email: 'example@mail.com', password: '1234567890' }}
				validationSchema={LOGIN_SCHEMA}
				onSubmit={(form) => {
					login(form.email, form.password)
					// setUser({ ...form, loggedIn: true })
				}}
				children={
					({ handleChange, handleBlur, handleSubmit, errors, values, touched }) => (
						<View style={$.form}>
							<Input
								placeholder="example@mail.com"
								label="Email ID"
								value={values.email}
								onChangeText={handleChange('email')}
								onBlur={handleBlur('email')}
								errorText={touched.email ? errors.email : ''}
							/>
							<Input
								placeholder="example@123"
								label="Password"
								value={values.password}
								onChangeText={handleChange('password')}
								onBlur={handleBlur('password')}
								errorText={touched.password ? errors.password : ''}
							/>
							<Button style={$.submitButton} title="login" variant="primary" onPress={() => handleSubmit()} />
						</View>
					)
				}
			/>
		</Screen>
	)
}


const $ = StyleSheet.create({
	screen: {
		alignItems: 'center',
		justifyContent: 'center'
	},
	loginImage: {
		minWidth: 100,
		minHeight: 100,
		maxWidth: 270,
		maxHeight: 270,
	},
	form: {
		minWidth: 300,
		width: '80%',
		maxWidth: 400,
		gap: SPACING.lg
	},
	submitButton: {
		alignSelf: 'flex-end'
	}
})
