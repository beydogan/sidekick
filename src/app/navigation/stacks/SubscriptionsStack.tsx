/**
 * SubscriptionsStack - Stack navigator for the Subscriptions section
 */

import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {SubscriptionGroupsScreen} from '@features/subscriptions/screens/SubscriptionGroupsScreen';
import {SubscriptionListScreen} from '@features/subscriptions/screens/SubscriptionListScreen';
import {SubscriptionPricingScreen} from '@features/subscriptions/screens/SubscriptionPricingScreen';
import type {SubscriptionsStackParamList} from '@app/navigation/types';

const Stack = createStackNavigator<SubscriptionsStackParamList>();

interface SubscriptionsStackProps {
  appId: string;
  appName: string;
}

export function SubscriptionsStack({appId, appName}: SubscriptionsStackProps) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none',
      }}>
      <Stack.Screen name="SubscriptionGroups" initialParams={{appId, appName}}>
        {props => (
          <SubscriptionGroupsScreen
            appId={props.route.params.appId}
            appName={props.route.params.appName}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="SubscriptionList"
        component={SubscriptionListScreen}
      />
      <Stack.Screen
        name="SubscriptionPricing"
        component={SubscriptionPricingScreen}
      />
    </Stack.Navigator>
  );
}
