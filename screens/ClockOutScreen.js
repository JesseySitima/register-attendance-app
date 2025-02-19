import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const ClockOutScreen = () => {
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

  useEffect(() => {
    fetchUsers();  // Load users when the screen loads
  }, []);

  const handleClockIn = async (user) => {
    const updatedUsers = users.map((u) =>
      u.id === user.id ? { ...u, clockIn: true } : u
    );

    // Save updated clock-in status for user
    await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));

    navigation.navigate('ClockOutSignature', { user });
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
      <Text style={styles.title}>Select your username below to Clock Out</Text>
      {users.length > 0 ? (
        <FlatList
          data={users} // Display all users
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No users available for clock Out.</Text>
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
