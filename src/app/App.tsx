import { StatusBar } from 'expo-status-bar';
import React from 'react';
// 1. Import the Safe Area Provider
import { SafeAreaProvider } from 'react-native-safe-area-context';

// 2. Import your Sign Up page
import SignUpPage from './Signup'; 

export default function App() {
  return (
    // 3. Wrap your app in the provider!
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <SignUpPage />
    </SafeAreaProvider>
  );
}