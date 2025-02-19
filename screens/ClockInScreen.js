import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const ClockInScreen = () => {
  const [users, setUsers] = useState([]);
  const [clockedInUsers, setClockedInUsers] = useState({});
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

  // Load clock-in status for users
  const fetchClockedInUsers = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      const attendance = await AsyncStorage.getItem('attendance');
      const attendanceData = attendance ? JSON.parse(attendance) : {};

      const clockedInStatus = {};
      users.forEach(user => {
        clockedInStatus[user.id] = attendanceData[user.id]?.some(record => record.date === today);
      });

      setClockedInUsers(clockedInStatus);
    } catch (error) {
      console.error('Error fetching clocked-in users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      fetchClockedInUsers();
    }
  }, [users]);

  const handleClockIn = async (user) => {
    if (clockedInUsers[user.id]) {
      Alert.alert('You have already clocked in today.');
    } else {
      navigation.navigate('ClockInSignatureScreen', { user });
    }
  };

  const renderItem = ({ item }) => {
    const isClockedIn = clockedInUsers[item.id];

    return (
      <TouchableOpacity
        style={[styles.userItem, { backgroundColor: isClockedIn ? '#3D9970' : '#007bff' }]}
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
          data={users}
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
    padding: 10,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 18,
    marginBottom: 5,
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
