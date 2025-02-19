import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import Icon

const UsersScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);

  // Load registered users from AsyncStorage
  const fetchUsers = async () => {
    try {
      const storedUsers = await AsyncStorage.getItem('users');
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      } else {
        setUsers([]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load users.');
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();

    // Listen for navigation focus event to reload users
    const unsubscribe = navigation.addListener('focus', fetchUsers);

    return unsubscribe; // Cleanup the listener on unmount
  }, [navigation]);

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    Alert.alert('Delete User', 'Are you sure you want to delete this user?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          try {
            // Remove the user from the list
            const updatedUsers = users.filter(user => user.id !== userId);

            // Save the updated users list to AsyncStorage
            await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));

            // Remove user's attendance data
            const attendance = await AsyncStorage.getItem('attendance');
            const attendanceData = attendance ? JSON.parse(attendance) : {};
            delete attendanceData[userId]; // Delete the user's attendance records

            // Save updated attendance data
            await AsyncStorage.setItem('attendance', JSON.stringify(attendanceData));

            // Update the state to reflect the deleted user
            setUsers(updatedUsers);
          } catch (error) {
            console.error('Error deleting user:', error);
            Alert.alert('Error', 'Failed to delete user.');
          }
        },
      },
    ]);
  };

  // Render a single user item
  const renderUser = ({ item }) => (
    <View style={styles.userItem}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteUser(item.id)}
      >
        <Icon name="trash-can" size={24} color="#dc3545" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add and manage users </Text>

      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyList}>No users registered yet.</Text>}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddUser')}
      >
        <Text style={styles.addButtonText}>+ Add New</Text>
      </TouchableOpacity>
    </View>
  );
};

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
    backgroundColor: '#e9ecef',
    padding: 15,
    marginVertical: 8,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#6c757d',
  },
  deleteButton: {
    padding: 10,
  },
  emptyList: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6c757d',
    marginTop: 20,
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UsersScreen;
