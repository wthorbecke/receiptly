import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import CameraScreen from '../screens/CameraScreen';
import ParseScreen from '../screens/ParseScreen';
import AssignScreen from '../screens/AssignScreen';
import PayScreen from '../screens/PayScreen';
import HistoryScreen from '../screens/HistoryScreen';

export type RootStackParamList = {
  Camera: undefined;
  Parse: { imageUri: string };
  Assign: { 
    items: Array<{ id: string; name: string; price: number }>;
    tax: number;
    tip: number;
    merchant: string;
  };
  Pay: { 
    recipients: Array<{ 
      id: string; 
      name: string; 
      amount: number;
      phoneNumber?: string;
      venmoHandle?: string;
    }>;
    merchant: string;
  };
  History: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Camera"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Camera" 
          component={CameraScreen} 
          options={{ title: 'Scan Receipt' }}
        />
        <Stack.Screen 
          name="Parse" 
          component={ParseScreen}
          options={{ title: 'Review Items' }}
        />
        <Stack.Screen 
          name="Assign" 
          component={AssignScreen}
          options={{ title: 'Assign Items' }}
        />
        <Stack.Screen 
          name="Pay" 
          component={PayScreen}
          options={{ title: 'Payment' }}
        />
        <Stack.Screen 
          name="History" 
          component={HistoryScreen}
          options={{ title: 'Receipt History' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 