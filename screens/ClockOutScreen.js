import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const ClockOutScreen = () => {
  const [users, setUsers] = useState([]);
  const [clockedInUsers, setClockedInUsers] = useState(new Set()); // Set of users who have clocked in
  const navigation = useNavigation();

  useEffect(() => {
    fetchUsers();
    fetchClockedInUsers();
  }, []);

  // Fetch users from AsyncStorage
  const fetchUsers = async () => {
    try {
      const storedUsers = await AsyncStorage.getItem('users');
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      }
    } catch (error) {
      console.log('Error fetching users:', error);
    }
  };

  // Fetch users who have clocked in today
  const fetchClockedInUsers = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const attendance = await AsyncStorage.getItem('attendance');
      const attendanceData = attendance ? JSON.parse(attendance) : {};

      const clockedInSet = new Set();

      Object.entries(attendanceData).forEach(([userId, records]) => {
        const todayRecord = records.find((record) => record.date === today);
        if (todayRecord && todayRecord.clockIn) {
          clockedInSet.add(userId);
        }
      });

      setClockedInUsers(clockedInSet);
    } catch (error) {
      console.log('Error fetching clocked-in users:', error);
    }
  };

  const handleClockOut = async (user) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const attendance = await AsyncStorage.getItem('attendance');
      const attendanceData = attendance ? JSON.parse(attendance) : {};

      const userAttendance = attendanceData[user.id] || [];
      const todayRecord = userAttendance.find((record) => record.date === today);

      if (!todayRecord) {
        Alert.alert('Error', 'You have not clocked in today. Please clock in first.');
        return;
      }

      if (todayRecord.clockOut) {
        Alert.alert('Error', 'You have already clocked out today.');
        return;
      }

      // If the user has not clocked out, navigate to the signature screen
      navigation.navigate('ClockOutSignature', { user });

    } catch (error) {
      console.error('Error checking clock-out status:', error);
      Alert.alert('Error', 'Failed to check clock-out status.');
    }
  };

  const renderItem = ({ item }) => {
    const isClockedIn = clockedInUsers.has(item.id.toString());
    return (
      <TouchableOpacity
        style={[styles.userItem, { backgroundColor: isClockedIn ? '#3D9970' : '#007bff' }]}
        onPress={() => handleClockOut(item)}
      >
        <Text style={styles.userText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select your username below to Clock Out</Text>
      {users.length > 0 ? (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No users available for clock out.</Text>
          }
        />
      ) : (
        <Text style={styles.emptyText}>No users available.</Text>
      )}
    </View>
  );
};

export default ClockOutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  userItem: {
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
  },
  userText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6c757d',
    fontStyle: 'italic',
    marginTop: 20,
  },
});
