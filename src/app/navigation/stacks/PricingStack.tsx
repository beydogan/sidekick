/**
 * PricingStack - Stack navigator for the Pricing section
 */

import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {PricingScreen} from '@features/pricing/screens/PricingScreen';
import type {PricingStackParamList} from '@app/navigation/types';

const Stack = createStackNavigator<PricingStackParamList>();

interface PricingStackProps {
  appId: string;
  appName: string;
}

export function PricingStack({appId, appName}: PricingStackProps) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none',
      }}>
      <Stack.Screen
        name="PricingHome"
        initialParams={{appId, appName}}>
        {props => (
          <PricingScreen
            appId={props.route.params.appId}
            appName={props.route.params.appName}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
