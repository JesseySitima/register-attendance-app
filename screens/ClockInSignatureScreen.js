import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Button, Alert, Text } from 'react-native';
import SignatureScreen from 'react-native-signature-canvas';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignatureComponent = ({ route, navigation }) => {
  const { user } = route.params;
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const date = now.toLocaleDateString(undefined, options); // e.g., Monday, January 13, 2025
      const time = now.toLocaleTimeString(); // e.g., 10:23 AM
      setCurrentDateTime(`${date}, ${time}`);
    }, 1000);

    return () => clearInterval(interval); 
  }, []);

  const handleSave = async (signature) => {
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      const currentTime = new Date().toLocaleTimeString(); // HH:MM AM/PM format

      // Fetch attendance data
      const attendance = await AsyncStorage.getItem('attendance');
      const attendanceData = attendance ? JSON.parse(attendance) : {};

      // Get user attendance or create empty array if none
      const userAttendance = attendanceData[user.id] || [];

      // Check if user has already clocked in today
      const todayRecord = userAttendance.find((record) => record.date === today);

      if (!todayRecord) {
        // Add new clock-in record for today
        userAttendance.push({
          date: today,
          clockIn: currentTime,
          clockOut: null,
          signature,
        });

        // Update attendance data with new record
        attendanceData[user.id] = userAttendance;
        await AsyncStorage.setItem('attendance', JSON.stringify(attendanceData));

        // Mark the user as clocked in (this is done here after signature is saved)
        const users = await AsyncStorage.getItem('users');
        const usersData = users ? JSON.parse(users) : [];
        const updatedUsers = usersData.map((u) =>
          u.id === user.id ? { ...u, clockIn: true } : u
        );
        await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));

        // Navigate to success screen with clock-in details
        navigation.navigate('Success', { name: user.name, clockInTime: currentTime });
      } else {
        Alert.alert('Error', 'You have already clocked in today.');
      }
    } catch (error) {
      console.error('Error during clock-in:', error);
      Alert.alert('Error', 'Failed to clock in.');
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{`${user.name} sign below to clock in for`}</Text>
      <Text style={styles.subtitle}>{currentDateTime}</Text>
      <SignatureScreen
        onOK={handleSave}
        descriptionText="Sign above"
        clearText="Clear"
        confirmText="Save"
        webStyle={`
          .m-signature-pad--footer {
            display: flex;
            justify-content: space-between;
          }
        `}
        style={styles.signaturePad}
      />
      <Button title="Cancel" onPress={handleCancel} />
    </View>
  );
};

export default SignatureComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  signaturePad: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});
