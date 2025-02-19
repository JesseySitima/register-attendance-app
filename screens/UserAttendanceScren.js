import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Button, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from 'expo-print';
import * as MailComposer from 'expo-mail-composer';

const UserAttendanceScreen = ({ route }) => {
  const { user } = route.params;
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  const fetchAttendance = async () => {
    try {
      const storedAttendance = await AsyncStorage.getItem('attendance');
      if (storedAttendance) {
        const attendance = JSON.parse(storedAttendance);
        setAttendanceRecords(attendance[user.id] || []);
      } else {
        setAttendanceRecords([]);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const generatePDF = async () => {
    const htmlContent = `
      <html>
        <head><title>${user.name}'s Attendance</title></head>
        <body>
          <h1>${user.name}'s Attendance Records</h1>
          <table border="1" style="width:100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th>Date</th>
                <th>Clock In</th>
                <th>Clock Out</th>
                <th>Signature</th>
              </tr>
            </thead>
            <tbody>
              ${attendanceRecords.map((item) => `
                <tr>
                  <td>${item.date}</td>
                  <td>${item.clockIn || 'N/A'}</td>
                  <td>${item.clockOut || 'N/A'}</td>
                  <td>${item.signature ? `<img src="${item.signature}" width="50" height="50"/>` : 'No signature available'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    return uri;
  };

  const sendEmail = async (pdfUri) => {
    try {
      await MailComposer.composeAsync({
        recipients: ['recipient@example.com'], // Can be made dynamic
        subject: `${user.name}'s Attendance Records`,
        body: `Please find attached the attendance records for ${user.name}.`,
        attachments: [pdfUri],
      });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const handleDownloadAndSend = async () => {
    const pdfUri = await generatePDF();
    sendEmail(pdfUri);
  };

  const renderItem = ({ item }) => (
    <View style={styles.record}>
      <View style={styles.row}>
        <Text style={styles.date}>{item.date}</Text>
        <Text style={styles.clockIn}>{item.clockIn || 'N/A'}</Text>
        <Text style={styles.clockOut}>{item.clockOut || 'N/A'}</Text>
        {item.signature ? (
          <Image source={{ uri: item.signature }} style={styles.signatureImage} />
        ) : (
          <Text>No signature available</Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{`${user.name}'s Attendance`}</Text>

      {/* Header Row */}
      <View style={styles.headerRow}>
        <Text style={styles.header}>Date</Text>
        <Text style={styles.header}>Clock In</Text>
        <Text style={styles.header}>Clock Out</Text>
        <Text style={styles.header}>Signature</Text>
      </View>

      {/* Button to trigger PDF generation and email sending */}
      <Button title="Download & Send Attendance" onPress={handleDownloadAndSend} />

      {attendanceRecords.length > 0 ? (
        <FlatList
          data={attendanceRecords}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      ) : (
        <Text style={styles.emptyText}>No attendance records found for this user.</Text>
      )}
    </View>
  );
};

export default UserAttendanceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  record: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    flex: 1,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  clockIn: {
    flex: 1,
  },
  clockOut: {
    flex: 1,
  },
  signatureImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6c757d',
    fontStyle: 'italic',
    marginTop: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  header: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
