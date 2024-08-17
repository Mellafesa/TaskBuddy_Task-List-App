import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import AddMemberScreen from './screens/AddMemberScreen';
import AddTaskScreen from './screens/AddTaskScreen';
import EditTaskScreen from './screens/EditTaskScreen';
import MemberListScreen from './screens/MemberListScreen';
import { Ionicons } from '@expo/vector-icons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator initialRouteName="Task Management App">
      <Stack.Screen options={{headerShown: false}} name="Task Management App" component={HomeScreen} />
      <Stack.Screen name="Add Task" component={AddTaskScreen} options={{ title: 'Add New Task' }} />
      <Stack.Screen name="Edit Task" component={EditTaskScreen} options={{ title: 'Edit Task' }} />
    </Stack.Navigator>
  );
}

function MemberListStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen options={{headerShown: false}} name="Member List" component={MemberListScreen} />
      <Stack.Screen name="Add Member" component={AddMemberScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Members') {
            iconName = 'people';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
          activeTintColor: '#6376FF', 
          inactiveTintColor: 'gray', 
        }}
      >
        <Tab.Screen options={{headerShown: false}} name="Home"  component={HomeStack} />
        <Tab.Screen options={{headerShown: false}} name="Members" component={MemberListStack} />
      </Tab.Navigator>
      
    </NavigationContainer>
  );
}


    

