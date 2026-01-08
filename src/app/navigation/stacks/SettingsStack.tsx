/**
 * SettingsStack - Stack navigator for the Settings section
 */

import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {SettingsScreen} from '@features/settings/screens/SettingsScreen';
import type {SettingsStackParamList} from '@app/navigation/types';

const Stack = createStackNavigator<SettingsStackParamList>();

interface SettingsStackProps {
  onConnectionSuccess?: () => void;
}

export function SettingsStack({onConnectionSuccess}: SettingsStackProps) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none',
      }}>
      <Stack.Screen name="SettingsHome">
        {() => <SettingsScreen onConnectionSuccess={onConnectionSuccess} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
