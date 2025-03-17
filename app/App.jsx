import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import NoteScreen from './screens/NoteScreen';
import CategoryScreen from './screens/CategoryScreen';
import PriorityScreen from './screens/PriorityScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Note" component={NoteScreen} />
        <Stack.Screen name="Category" component={CategoryScreen} />
        <Stack.Screen name="Priority" component={PriorityScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;