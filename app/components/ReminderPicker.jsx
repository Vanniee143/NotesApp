import React, { useState } from 'react';
import { View, Text, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button } from 'react-native-paper';

const ReminderPicker = ({ onSetReminder, onCancel, initialDate }) => {
  const [date, setDate] = useState(initialDate || new Date());
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

  const handleConfirm = (selectedDate) => {
    const reminderDate = selectedDate || date;
    if (reminderDate.getTime() <= Date.now()) {
      alert('Please select a future date and time');
      return;
    }
    onSetReminder(reminderDate);
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          onPress={() => showMode('date')}
        >
          Select Date
        </Button>
        {Platform.OS === 'ios' && (
          <Button
            mode="outlined"
            onPress={() => showMode('time')}
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
        />
      )}

      <View style={styles.actionButtons}>
        <Button
          mode="contained"
          onPress={() => handleConfirm(date)}
        >
          Set Reminder
        </Button>
        <Button
          mode="outlined"
          onPress={onCancel}
        >
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
});

export default ReminderPicker; 