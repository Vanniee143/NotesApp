import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import NoteList from '@/components/NoteList';
import NoteEditor from '@/components/NoteEditor';

const Stack = createStackNavigator();

export function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Notes" 
          component={NoteList}
          options={{ title: 'My Notes' }}
        />
        <Stack.Screen 
          name="NoteEditor" 
          component={NoteEditor}
          options={{ title: 'Edit Note' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
