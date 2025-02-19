import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Button, Alert, Text } from 'react-native';
import SignatureScreen from 'react-native-signature-canvas';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ClockOutSignatureScreen = ({ route, navigation }) => {
  const { user } = route.params;

  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const date = now.toLocaleDateString(undefined, options);
      const time = now.toLocaleTimeString();
      setCurrentDateTime(`${date}, ${time}`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSave = async (signature) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const currentTime = new Date().toLocaleTimeString();

      const attendance = await AsyncStorage.getItem('attendance');
      const attendanceData = attendance ? JSON.parse(attendance) : {};

      const userAttendance = attendanceData[user.id] || [];
      const todayRecord = userAttendance.find((record) => record.date === today);

      if (todayRecord) {
        if (todayRecord.clockOut) {
          Alert.alert('Error', 'You have already clocked out today.');
        } else {
          todayRecord.clockOut = currentTime;
          todayRecord.clockOutSignature = signature;

          attendanceData[user.id] = userAttendance;
          await AsyncStorage.setItem('attendance', JSON.stringify(attendanceData));

          navigation.navigate('ClockOutSuccess', { name: user.name, clockOutTime: currentTime });
        }
      } else {
        Alert.alert('Error', 'You have not clocked in today.');
      }
    } catch (error) {
      console.error('Error during clock-out:', error);
      Alert.alert('Error', 'Failed to clock out.');
    }
  };

  const handleClear = () => {
    Alert.alert('Signature cleared');
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{`${user.name}, sign below to clock out`}</Text>
      <Text style={styles.subtitle}>{currentDateTime}</Text>
      <SignatureScreen
        onOK={handleSave}
        onClear={handleClear}
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

export default ClockOutSignatureScreen;

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
