import React from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import clock from '../assets/img/clock.gif'

const SuccessClockOutScreen = ({ route, navigation }) => {
  const { name, clockOutTime } = route.params;

   return (
     <View style={styles.container}>
       <Image
         source={clock} 
         style={styles.image}
       />
       <Text style={styles.title}>Thank you, {name}!</Text>
       <Text style={styles.subtitle}>You are clocking Out at {clockOutTime}.</Text>
       <Text style={styles.message}>The day’s work is done, but the impact you’ve made will last. See you tomorrow!</Text>
       <Button style={styles.button} title="Back to Home" onPress={() => navigation.navigate('Home')} />
     </View>
   );
 };

export default SuccessClockOutScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
      },
      image: {
        width: 150,
        height: 150,
        marginBottom: 20,
        borderRadius: 75,
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
      },
      subtitle: {
        fontSize: 18,
        color: '#555',
        marginBottom: 20,
      },
      message: {
        fontSize: 18,
        fontStyle: 'italic',
        textAlign: 'center',
        marginBottom: 30,
        color: '#4caf50',
      },
    });
    

