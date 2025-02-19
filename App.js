import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import AdminScreen from './screens/AdminScreen';
import EmployeeScreen from './screens/EmployeeScreen';
import AddUserScreen from './screens/AddUserScreen';
import AttendanceScreen from './screens/AttendanceScreen';
import UsersScreen from './screens/UsersScreen';
import ClockInScreen from './screens/ClockInScreen';
import ClockOutScreen from './screens/ClockOutScreen';
import SignatureComponent from './screens/ClockInSignatureScreen';
import UserAttendanceScreen from './screens/UserAttendanceScren';
import SuccessScreen from './screens/SuccessScreen';
import ClockOutSignatureScreen from './screens/ClockOutSignatureScreen';
import SuccessClockOutScreen from './screens/SuccessClockOutScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown:false }}/>
        <Stack.Screen name="Admin" component={AdminScreen} options={{ title: 'Admin panel' }} />
        <Stack.Screen name="Employee" component={EmployeeScreen} />
        <Stack.Screen name="AddUser" component={AddUserScreen} options={{ title: 'Create User' }}/>
        <Stack.Screen name="AttendanceScreen" component={AttendanceScreen} options={{ title: 'Attendance' }}/>
        <Stack.Screen name="UsersScreen" component={UsersScreen} options={{ title: 'All Users' }}/>
        <Stack.Screen name="ClockInScreen" component={ClockInScreen} options={{ title: 'Clock In' }}/>
        <Stack.Screen name="ClockOutScreen" component={ClockOutScreen} options={{ title: 'Clock Out' }}/>
        <Stack.Screen name="UserAttendanceScreen" component={UserAttendanceScreen} options={{ title: 'Attendance Details' }} />
        <Stack.Screen name="ClockInSignatureScreen" component={SignatureComponent} options={{ title: 'Signature' }}/>
        <Stack.Screen name="Success" component={SuccessScreen}  options={{ headerShown:false }}/>
        <Stack.Screen name="ClockOutSuccess" component={SuccessClockOutScreen} options={{ headerShown:false }}/>
        <Stack.Screen name="ClockOutSignature" component={ClockOutSignatureScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
