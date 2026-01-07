/**
 * Sidekick - App Store Connect Management Tool
 */

import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Providers} from './src/app';
import {Sidebar, App} from './src/ui';
import {PricingScreen} from './src/features/pricing';
import {colors} from './src/theme';

// Sample apps for development
const sampleApps: App[] = [
  {id: '1', name: 'Weather Pro', iconColor: '#007AFF'},
  {id: '2', name: 'Fitness Tracker', iconColor: '#34C759'},
  {id: '3', name: 'Photo Editor', iconColor: '#FF9500'},
  {id: '4', name: 'Notes Plus', iconColor: '#FF3B30'},
];

function Application(): React.JSX.Element {
  const [selectedApp, setSelectedApp] = useState<App | null>(sampleApps[0]);
  const [selectedMenuItem, setSelectedMenuItem] = useState('pricing');

  const renderContent = () => {
    switch (selectedMenuItem) {
      case 'pricing':
        return <PricingScreen appName={selectedApp?.name} />;
      default:
        return null;
    }
  };

  return (
    <Providers>
      <View style={styles.container}>
        <Sidebar
          apps={sampleApps}
          selectedApp={selectedApp}
          onSelectApp={setSelectedApp}
          selectedMenuItem={selectedMenuItem}
          onSelectMenuItem={setSelectedMenuItem}
        />
        <View style={styles.content}>{renderContent()}</View>
      </View>
    </Providers>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.content,
  },
  content: {
    flex: 1,
  },
});

export default Application;
