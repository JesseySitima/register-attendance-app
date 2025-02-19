import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const ClockInScreen = () => {
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();

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

  // Check if the user has already clocked in for the day
  const checkClockInStatus = async (user) => {
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      const attendance = await AsyncStorage.getItem('attendance');
      const attendanceData = attendance ? JSON.parse(attendance) : {};

      const userAttendance = attendanceData[user.id] || [];

      // Check if the user has already clocked in today
      const todayRecord = userAttendance.find((record) => record.date === today);

      if (todayRecord) {
        Alert.alert('You have already clocked in today.');
      } else {
        // Navigate to the signature screen if not clocked in yet
        navigation.navigate('SignatureScreen', { user });
      }
    } catch (error) {
      console.error('Error checking clock-in status:', error);
      Alert.alert('Error', 'Failed to check clock-in status.');
    }
  };

  useEffect(() => {
    fetchUsers();  // Load users when the screen loads
  }, []);

  const handleClockIn = (user) => {
    checkClockInStatus(user);
  };
  
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.userItem}
        onPress={() => handleClockIn(item)}
      >
        <Text style={styles.userText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select your username below to Clock In</Text>
      {users.length > 0 ? (
        <FlatList
          data={users} // Display all users
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No users available for clock in.</Text>
          }
        />
      ) : (
        <Text style={styles.emptyText}>No users available.</Text>
      )}
    </View>
  );
};

export default ClockInScreen;

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
    backgroundColor: '#007bff',
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
