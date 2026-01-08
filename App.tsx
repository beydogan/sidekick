/**
 * Sidekick - App Store Connect Management Tool
 */

import React, {useState, useEffect, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSelector} from '@legendapp/state/react';
import {Providers} from './src/app';
import {Sidebar} from './src/ui';
import {SectionNavigator} from './src/app/navigation';
import type {SidebarSection} from './src/app/navigation';
import {useApps} from './src/features/pricing/hooks/usePricing';
import {hasCredentials} from './src/libs/appStoreConnect';
import {colors} from './src/theme';
import {ui$} from './src/stores/ui';
import type {App as UIApp} from './src/ui/composite/AppSelector';
import type {App as APIApp} from './src/libs/appStoreConnect';
import {useMCPServer} from './src/libs/mcp';

// Determine which section to show based on credentials and menu selection
function getActiveSection(
  selectedMenuItem: SidebarSection,
  credentialsReady: boolean | null,
): SidebarSection {
  if (credentialsReady === false) {
    return 'settings';
  }
  return selectedMenuItem;
}

function mapApiAppToUiApp(app: APIApp): UIApp {
  return {
    id: app.id,
    name: app.attributes.name,
  };
}

function AppContent(): React.JSX.Element {
  const [credentialsReady, setCredentialsReady] = useState<boolean | null>(
    null,
  );
  const selectedAppId = useSelector(ui$.selectedAppId);
  const [selectedMenuItem, setSelectedMenuItem] =
    useState<SidebarSection>('pricing');

  // Start MCP server
  const {isRunning: mcpRunning, start: startMCP} = useMCPServer();
  useEffect(() => {
    startMCP();
  }, []);

  // Log MCP server status
  useEffect(() => {
    console.log('[App] MCP Server running:', mcpRunning);
  }, [mcpRunning]);

  // Check credentials on mount
  useEffect(() => {
    hasCredentials().then(setCredentialsReady);
  }, []);

  // Fetch apps when credentials are ready
  const {
    data: appsData,
    isLoading: appsLoading,
    refetch: refetchApps,
  } = useApps({
    enabled: credentialsReady === true,
  });

  // Map API apps to UI format
  const apps: UIApp[] = useMemo(
    () => appsData?.data.map(mapApiAppToUiApp) ?? [],
    [appsData],
  );

  // Derive selected app from ID
  const selectedApp = useMemo(
    () => apps.find(app => app.id === selectedAppId) ?? null,
    [apps, selectedAppId],
  );

  // Auto-select first app when apps load and no persisted selection
  useEffect(() => {
    if (apps.length > 0 && !selectedApp) {
      ui$.selectedAppId.set(apps[0].id);
    }
  }, [apps, selectedApp]);

  // Handle successful credential connection
  const handleConnectionSuccess = () => {
    setCredentialsReady(true);
    refetchApps();
  };

  // Handle app selection
  const handleSelectApp = (app: UIApp) => {
    ui$.selectedAppId.set(app.id);
    // Navigate to pricing when an app is selected
    if (selectedMenuItem === 'settings') {
      setSelectedMenuItem('pricing');
    }
  };

  // Determine active section based on credentials and menu selection
  const activeSection = getActiveSection(selectedMenuItem, credentialsReady);

  // Show loading while checking credentials
  if (credentialsReady === null) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <Sidebar
        apps={apps}
        selectedApp={selectedApp}
        onSelectApp={handleSelectApp}
        selectedMenuItem={selectedMenuItem}
        onSelectMenuItem={setSelectedMenuItem}
        showSettings
        isLoadingApps={appsLoading}
      />
      <View style={styles.content}>
        <SectionNavigator
          activeSection={activeSection}
          appId={selectedApp?.id}
          appName={selectedApp?.name}
          onConnectionSuccess={handleConnectionSuccess}
        />
      </View>
    </View>
  );
}

function Application(): React.JSX.Element {
  return (
    <Providers>
      <AppContent />
    </Providers>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.content,
    // Explicitly disable shadows to prevent RN macOS bug with NULL CGColor
    shadowColor: '#000',
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: {width: 0, height: 0},
  },
  content: {
    flex: 1,
  },
});

export default Application;
