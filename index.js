/**
 * @format
 */

import {LogBox} from 'react-native';

// Disable LogBox modals (they break on macOS)
LogBox.ignoreAllLogs(true);

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
