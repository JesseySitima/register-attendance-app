import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import logo from '../assets/logo.jpg';

const HomeScreen = ({ navigation }) => {
  const [currentDateTime, setCurrentDateTime] = useState('');

  const updateDateTime = () => {
    const now = new Date();
    const day = now.toLocaleString('en-US', { weekday: 'long' });
    const date = now.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const time = now.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });

    setCurrentDateTime(`${day}, ${date} - ${time}`);
  };

  useEffect(() => {
    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.container}>
      {/* Header with Settings Icon */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.settingsIcon}
          onPress={() => navigation.navigate('Admin')}
        >
          <Icon name="cog" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Logo and Title */}
      <View style={styles.logoContainer}>
        <Image
          source={logo} // Add your logo image here
          style={styles.logo}
        />
        <Text style={styles.title}>Lilongwe Attendance Register</Text>
      </View>

      {/* Date and Time Display */}
      <View style={styles.dateTimeContainer}>
        <Text style={styles.dateTimeText}>{currentDateTime}</Text>
      </View>

      {/* Clock In and Clock Out Buttons */}
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ClockInScreen')}
        >
          <Icon name="login" size={24} color="#fff" />
          <Text style={styles.buttonText}>Clock In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.clockOutButton]}
          onPress={() => navigation.navigate('ClockOutScreen')}
        >
          <Icon name="logout" size={24} color="#fff" />
          <Text style={styles.buttonText}>Clock Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: '#007bff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 15,
    paddingTop: 50, // For devices with a notch
  },
  settingsIcon: {
    padding: 5,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logo: {
    width: 150,
    height: 150, 
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
 
  },
  dateTimeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateTimeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {

    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20, 
  },
  button: {
    backgroundColor: '#007bff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginVertical: 10,
    width: '80%',
    elevation: 3, 
    shadowColor: '#000', 
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    height: '20%', 
  },
  clockOutButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
