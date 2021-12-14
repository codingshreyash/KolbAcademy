import React, { useState, Fragment, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import { Button, Snackbar } from 'react-native-paper';
import AwesomeButtonRick from 'react-native-really-awesome-button/src/themes/rick';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as restService from '../services/RestService'

const {width: WIDTH} = Dimensions.get('window');
export default function Login(props) {
	const [toastVisible, setToastVisible] = useState(false)
	const [user, setUser] = useState()
	const [signInDisabled, setSignInDisabled] = useState(true)
	const [state, setState] = useState({
		email: '',
		password: '',
		loginMessage: false
	})

	const usernameInput = useRef()
	const passwordInput = useRef()

	const changeState = (id, val) => {
		setState(prevState => ({
			...prevState,
			[id]: val
		}))
	}

	const login = () => {
		 auth()
		 .signInWithEmailAndPassword(state.email, state.password).then((u) => {
				console.log(u)
				restService.getUser(u.user.email).then(response => {
					console.log(response)
					props.navigation.navigate('StudentProfile', {userInfo: response})
				});
			})
			.catch(error => {
				state.email = ''
				state.password = ''
				setToastVisible(true);
				usernameInput.current.clear()
				passwordInput.current.clear()
				usernameInput.current.focus()
				if (error.code === 'auth/invalid-email') {
					changeState('loginMessage', 'Invalid Credentials')
				} else if (error.code === 'auth/user-disabled') {
					changeState('loginMessage', 'Account has been disabled, contact an admin')
				} else if (error.code === 'auth/user-not-found') {
					changeState('loginMessage', 'Invalid Credentials')
				} else if (error.code === 'auth/wrong-password') {
					changeState('loginMessage', 'Invalid Credentials')
				}
			})	
	}

	return (
        <Fragment>
            <SafeAreaView style={{ flex: 0, backgroundColor: "#FFFFFF" }} />
            <SafeAreaView style={{ flex: 1, backgroundColor: "#5e4eb9", borderRadius: 30 }}>
                <View style={styles.footer}>
					<Image style={{ width: 350, height: 60, alignSelf: 'center', borderRadius: 50, marginRight: 10 }} source={{ uri: 'https://receipts12312321df3123dfw24fwe3.s3.amazonaws.com/logo.png' }} />
                </View>
		<View style={styles.container}>
			
			<TextInput 
			ref={usernameInput}
			style = {styles.input}
			placeholder={'Email'}
			placeholderTextColor={'black'}
			underLineColorAndroid={'transparent'}
			onChangeText={text => {
				changeState('email', text)
			}}/>

			<TextInput
			ref={passwordInput}
			style={styles.input}
			placeholder={'Password'}
			secureTextEntry={true}
			placeholderTextColor={'black'}
			underLineColorAndroid={'transparent'}
			onChangeText={text => {
				changeState('password', text)
			}}/>

			<AwesomeButtonRick 
				backgroundColor = "#5e4eb9"
				textColor='#FFFFFF' 
				backgroundDarker="#222429"
				borderColor='#5e4eb9'
				textColor={(state.email.length <= 0 || state.password.length <= 0) ? "#FFFFFF77" : "#FFFFFF" } 
				style = {{marginTop: '13%', marginBottom: Platform.OS == 'android' ? '40%' : '60%', alignSelf: 'center'}} 
				width={WIDTH - 100}
				textSize={20}
				disabled={state.email.length <= 0 || state.password.length <= 0} 
				type="primary"
				onPress={() => login()}> 
				Sign In
			</AwesomeButtonRick>

			{/* <TouchableOpacity
				style={styles.loginButton}>
					<Text style={styles.loginText}>Sign In</Text>
			</TouchableOpacity>		 */}

			{/* <View style={styles.signupContainer}>
				<Text style={styles.signupText}>Don't have an account?</Text>
					<TouchableOpacity
						onPress={() => props.navigation.navigate('SignUp')}>
						<Text style={styles.signupButton}> Sign Up</Text>
					</TouchableOpacity>
			</View> */}
			
			<Snackbar
				visible={toastVisible}
				onDismiss={() => setToastVisible(false)}
				duration={5000}
				style={styles.snackBar}>
				{state.loginMessage}
			</Snackbar>

		</View>
		</SafeAreaView>
            <SafeAreaView style={{ flex: 0, backgroundColor: "#FFFFFF" }} />
        </Fragment>
	);
}

const styles = StyleSheet.create({
	// container: {
	// 	backgroundColor:'white',
	// 	flex: 1,
	// 	justifyContent: 'center',
	// },
	container: {
        flex: 8,
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
	logo: {
		marginBottom: '10%'
	},
	input: {
		borderRadius: 25,
		paddingLeft: 20,
		borderBottomColor: '#5e4eb9',
		borderBottomWidth: 2,
		fontSize: 20,
		color: 'black',
		marginTop: '7%',
		textAlign: 'justify',
	},
	signupContainer: {
		justifyContent: 'center',
		paddingVertical: 10,
		alignItems: 'center',
		flexDirection: 'row',
	},
	signupText: {
		color: '#5e4eb9',
		fontSize: 16,
		fontWeight: 'bold',
	},
	signupButton: {
		color: '#B76E79',
		fontSize: 16,
		fontWeight: 'bold',
	},
	snackBar: {
		backgroundColor: '#CC0000',
	},
	loginButton: {
		borderWidth: 2,
		borderRadius: 15,
		borderColor: '#b8336a',
		alignSelf: 'center',
		marginTop: '10%',
		marginBottom: '10%',
		width: '70%',
		height: '5%',
		alignItems: 'center',
		justifyContent: 'center'
	},
	loginText: {
		color: 'white',
		fontSize: 30,
	},
	footer: {
        flex: 2.3,
        flexDirection: "row",
        backgroundColor: "#5e4eb9",
        alignItems: "center",
        justifyContent: "center",
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
    },
    header: {
        textAlign: "center",
        color: "#FFFFFF",
        fontSize: 32,
        fontWeight: "bold",
        // marginTop: -25
    }
});
