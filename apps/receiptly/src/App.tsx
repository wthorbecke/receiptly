import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CameraScreen from './screens/CameraScreen';
import ParseScreen from './screens/ParseScreen';
import HistoryScreen from './screens/HistoryScreen';
import AssignScreen from './screens/AssignScreen';
import PayScreen from './screens/PayScreen';

export type RootStackParamList = {
  Camera: undefined;
  Parse: { imageUri: string };
  History: undefined;
  Assign: {
    items: Array<{
      name: string;
      price: number;
      id: string;
      assignedTo: string[];
      split: boolean;
    }>;
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
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="Camera"
            screenOptions={{
              headerShown: true,
              headerBackTitle: 'Back',
              headerBackVisible: true,
            }}
          >
            <Stack.Screen 
              name="Camera" 
              component={CameraScreen}
              options={{
                title: 'Take Photo',
                headerShown: true,
              }}
            />
            <Stack.Screen 
              name="Parse" 
              component={ParseScreen}
              options={{
                title: 'Parse Receipt',
                headerShown: true,
              }}
            />
            <Stack.Screen 
              name="History" 
              component={HistoryScreen}
              options={{
                title: 'Receipt History',
                headerShown: true,
              }}
            />
            <Stack.Screen 
              name="Assign" 
              component={AssignScreen}
              options={{
                title: 'Assign Items',
                headerShown: true,
              }}
            />
            <Stack.Screen 
              name="Pay" 
              component={PayScreen}
              options={{
                title: 'Payment Requests',
                headerShown: true,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
} 