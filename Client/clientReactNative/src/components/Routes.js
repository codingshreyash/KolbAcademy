import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Login from '../screens/Login';
import Email from '../screens/Email';
import KolbCalendar from '../screens/KolbCalendar';
import Schedule from '../screens/Schedule';
import StudentProfile from '../screens/StudentProfile';
import Menu from '../screens/Menu';
		
const navigator = createStackNavigator(
	{
        Login: {
            screen: Login,
            navigationOptions: {
                headerShown: false
            }
        },
        Email: {
            screen: Email,
            navigationOptions: {
                headerShown: false
            }
        },
        KolbCalendar: {
            screen: KolbCalendar,
            navigationOptions: {
                headerShown: false
            }
        },
        Schedule: {
            screen: Schedule,
            navigationOptions: {
                headerShown: false
            }
        },
        Menu: {
            screen: Menu,
            navigationOptions: {
                headerShown: false
            }
        },
        StudentProfile: {
            screen: StudentProfile,
            navigationOptions: {
                headerShown: false
            }
        },
	},
	{
		initialRouteName: 'Login',
	}
);

export default createAppContainer(navigator);
