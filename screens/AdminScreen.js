import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AdminScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Manage Users and Attendance</Text>

      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('UsersScreen')}
        >
          <Icon name="account-multiple" size={40} color="#007bff" />
          <Text style={styles.cardText}>View and Manage Users</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('AttendanceScreen')}
        >
          <Icon name="clipboard-list" size={40} color="#007bff" />
          <Text style={styles.cardText}>View and Manage Attendance Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AdminScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  heading: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    elevation: 3, 
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    width: '90%',
    maxWidth: 300,
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
});
