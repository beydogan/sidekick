import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {AppInfoScreen} from '@features/app-info/screens/AppInfoScreen';
import type {AppInfoStackParamList} from '@app/navigation/types';

const Stack = createStackNavigator<AppInfoStackParamList>();

interface AppInfoStackProps {
  appId: string;
  appName: string;
}

export function AppInfoStack({appId, appName}: AppInfoStackProps) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none',
      }}>
      <Stack.Screen name="AppInfoHome">
        {() => <AppInfoScreen appId={appId} appName={appName} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
