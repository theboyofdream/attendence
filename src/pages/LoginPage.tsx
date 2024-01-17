import { Formik } from "formik";
import { useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import * as Yup from 'yup';
import { Button, Input, Screen, Text } from "~components";
import { COLORS, FONTSIZE, SPACING } from '~src/utils';
import { useAuthStore } from "~stores";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

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
	const { login } = useAuthStore()
	const [submitting, setSubmitting] = useState(false);
	const [isPasswordVisible, setPasswordVisibility] = useState(false);

	return (
		<Screen style={$.screen}>
			<Text variant="title">ATTENDENCE LOGIN</Text>
			<Image source={require('src/assets/login.jpg')} style={$.loginImage} />
			<Formik
				// initialValues={{ email: 'example@mail.com', password: '1234567890' }}
				initialValues={{ email: 'inam@dhwajpartner.com', password: 'inam@123' }}
				validationSchema={LOGIN_SCHEMA}
				onSubmit={async (form) => {
					setSubmitting(true)
					await login(form.email, form.password)
					setSubmitting(false)
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
								secureTextEntry={!isPasswordVisible}
							/>
							<Pressable style={{ flexDirection: 'row', gap: SPACING.md, alignItems: 'center' }} onPress={() => setPasswordVisibility(!isPasswordVisible)}>
								<View style={{ position: 'relative' }}>
									<MaterialCommunityIcons name="square-rounded" size={FONTSIZE.lg} color={COLORS[(touched.password && errors.password) ? 'dangerBackground' : 'backgroundSecondary']} style={{ position: isPasswordVisible ? 'absolute' : 'relative' }} />
									{isPasswordVisible && <MaterialCommunityIcons name="check" size={FONTSIZE.md * 0.7} color={COLORS[(touched.password && errors.password) ? 'dangerText' : 'text']} style={{ padding: 3, paddingVertical: 4 }} />}
								</View>
								<Text>Show Password</Text>
							</Pressable>
							<Button style={$.submitButton} title="login" variant="primary" onPress={() => handleSubmit()} />
						</View>
					)
				}
			/>
			<Text style={$.submitText}>{submitting && 'Logging in...'}</Text>
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
		gap: SPACING.md
	},
	submitButton: {
		alignSelf: 'flex-end'
	},
	submitText: {
		bottom: SPACING.lg * 2,
		position: 'absolute'
	}
})
