import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Correct paths based on your VS Code structure
import SignUpPage from "../features/home/screens/SignUpPage";

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignUp">
        
        <Stack.Screen 
          name="SignUp" 
          component={SignUpPage} 
          options={{ title: 'Sign Up' }} 
        />

        
      </Stack.Navigator>
    </NavigationContainer>
  );
}