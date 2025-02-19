import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddUserScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleAddUser = async () => {
    if (!name || !email) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    try {
      // Fetch existing users
      const existingUsers = await AsyncStorage.getItem('users');
      const users = existingUsers ? JSON.parse(existingUsers) : [];

      // Generate a unique ID for the user
      const userId = new Date().getTime().toString();

      // Create a new user object
      const newUser = { id: userId, name, email };

      // Add the new user to the users list
      users.push(newUser);

      // Save updated users list to AsyncStorage
      await AsyncStorage.setItem('users', JSON.stringify(users));

      // Initialize attendance structure for the user
      const attendance = await AsyncStorage.getItem('attendance');
      const attendanceData = attendance ? JSON.parse(attendance) : {};
      attendanceData[userId] = []; // Create an empty array for the user's attendance records

      // Save updated attendance data to AsyncStorage
      await AsyncStorage.setItem('attendance', JSON.stringify(attendanceData));

      // Alert success and navigate back
      Alert.alert('Success', 'User added successfully.', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(), // Navigate back to AdminScreen
        },
      ]);
    } catch (error) {
      console.error('Error adding user:', error);
      Alert.alert('Error', 'Failed to add user.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fill in user details below to create a new user.</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Button title="Add User" onPress={handleAddUser} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
});

export default AddUserScreen;
