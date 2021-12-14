import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Platform } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import Home from './Home';
import Email from '../screens/Email';
import KolbCalendar from '../screens/KolbCalendar';
import Schedule from '../screens/Schedule';
import Menu from '../screens/Menu';
import Activity from './Activities';
import { NavigationContainer } from '@react-navigation/native';

export default function StudentProfile(props) {

	const Tab = createMaterialBottomTabNavigator();

	return (
		<NavigationContainer >
			<Tab.Navigator barStyle={{ backgroundColor: '#FFFFFF' }} activeColor="#5e4eb9" >

			<Tab.Screen
					name="Home"
					children={() => <Home userInfo={props.navigation.state.params.userInfo} />}
					options={{
						tabBarLabel: 'Home',
						tabBarIcon: ({ color }) => (<Icon name="home" color={color} size={26} />),
					}}
				/>

				<Tab.Screen
					name="Activities"
					children={() => <Activity userInfo={props.navigation.state.params.userInfo} />}
					options={{
						tabBarLabel: 'Activities',
						tabBarIcon: ({ color }) => (<Icon name="american-football" color={color} size={26} />),
					}}
				/>

				<Tab.Screen
					name="Email"
					children={() => <Email userInfo={props.navigation.state.params.userInfo} />}
					options={{
						tabBarLabel: 'Email',
						tabBarIcon: ({ color }) => (<Icon name="mail" color={color} size={26} />),
					}}
				/>

				<Tab.Screen
					name="KolbCalendar"
					children={() => <KolbCalendar userInfo={props.navigation.state.params.userInfo} />}
					options={{
						tabBarLabel: 'Calendar',
						tabBarIcon: ({ color }) => (<Icon name="calendar" color={color} size={26} />),
					}}
				/>

				<Tab.Screen
					name="Schedule"
					children={() => <Schedule userInfo={props.navigation.state.params.userInfo} />}
					options={{
						tabBarLabel: 'Schedule',
						tabBarIcon: ({ color }) => (<Icon name="list" color={color} size={26} />),
					}}
				/>

				<Tab.Screen
					name="Menu"
					children={() => <Menu userInfo={props.navigation.state.params.userInfo} />}
					options={{
						tabBarLabel: 'Menu',
						tabBarIcon: ({ color }) => (<Icon name="fast-food" color={color} size={26} />),
					}}
				/>

			</Tab.Navigator>
		</NavigationContainer>
	);

}

