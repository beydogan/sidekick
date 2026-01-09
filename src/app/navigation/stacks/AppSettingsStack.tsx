import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {AppSettingsScreen} from '@features/app-settings/screens/AppSettingsScreen';
import type {AppSettingsStackParamList} from '@app/navigation/types';

const Stack = createStackNavigator<AppSettingsStackParamList>();

interface AppSettingsStackProps {
  appId: string;
  appName: string;
}

export function AppSettingsStack({appId, appName}: AppSettingsStackProps) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none',
      }}>
      <Stack.Screen name="AppSettingsHome">
        {() => <AppSettingsScreen appId={appId} appName={appName} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
