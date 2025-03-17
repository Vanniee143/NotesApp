import React, { useState } from 'react';
import { View, Text, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button } from 'react-native-paper';

const ReminderPicker = ({ onSetReminder, onCancel }) => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState('date');
  const [tempDate, setTempDate] = useState(new Date());

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    if (Platform.OS === 'android') {
      setShow(false);
    }
    
    if (event.type === 'dismissed') {
      return;
    }

    if (mode === 'date') {
      setTempDate(currentDate);
      if (Platform.OS === 'android') {
        setTimeout(() => {
          setMode('time');
          setShow(true);
        }, 500);
      }
    } else {
      const finalDate = new Date(tempDate);
      finalDate.setHours(currentDate.getHours());
      finalDate.setMinutes(currentDate.getMinutes());
      setDate(finalDate);
      if (Platform.OS === 'android') {
        handleConfirm(finalDate);
      }
    }
  };

  const showMode = (currentMode) => {
    if (currentMode === 'date') {
      setTempDate(new Date());
    }
    setShow(true);
    setMode(currentMode);
  };

  const handleConfirm = (finalDate = date) => {
    if (finalDate.getTime() <= Date.now()) {
      alert('Please select a future date and time');
      return;
    }
    onSetReminder(finalDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Set Reminder</Text>
      
      <View style={styles.buttonContainer}>
        <Button 
          onPress={() => showMode('date')} 
          mode="contained"
          style={styles.button}
        >
          Select Date
        </Button>
        {Platform.OS === 'ios' && (
          <Button 
            onPress={() => showMode('time')} 
            mode="contained"
            style={styles.button}
          >
            Select Time
          </Button>
        )}
      </View>

      <Text style={styles.selectedDateTime}>
        Selected: {date.toLocaleString()}
      </Text>

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={mode === 'date' ? tempDate : date}
          mode={mode}
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChange}
          minimumDate={new Date()}
        />
      )}

      <View style={styles.actionButtons}>
        {Platform.OS === 'ios' && (
          <Button onPress={() => handleConfirm()} mode="contained">
            Confirm
          </Button>
        )}
        <Button onPress={onCancel} mode="outlined">
          Cancel
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    maxWidth: 400,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  selectedDateTime: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    marginHorizontal: 5,
  },
});

export default ReminderPicker; 