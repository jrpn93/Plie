import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../constants/routes';
import BottomTabRouter from './bottom-tab.router';

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.HOME} component={BottomTabRouter} />
    </Stack.Navigator>
  );
}

export default function AppRouter() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}
