import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import AuthStack from './auth.stack';
import AppStack from './app.stack';

const RootStack = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return isAuthenticated ? <AppStack /> : <AuthStack />;
};

export default function AppRouter() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}