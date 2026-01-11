/**
 * @format
 */

// Polyfills for Vercel AI SDK
import {ReadableStream, TransformStream, WritableStream} from 'web-streams-polyfill';
globalThis.ReadableStream = globalThis.ReadableStream || ReadableStream;
globalThis.TransformStream = globalThis.TransformStream || TransformStream;
globalThis.WritableStream = globalThis.WritableStream || WritableStream;
globalThis.structuredClone = globalThis.structuredClone || ((obj) => JSON.parse(JSON.stringify(obj)));

import {LogBox} from 'react-native';

// Disable LogBox modals (they break on macOS)
LogBox.ignoreAllLogs(true);

// Set global error handler to log instead of showing modal
const originalHandler = ErrorUtils.getGlobalHandler();
ErrorUtils.setGlobalHandler((error, isFatal) => {
  console.error('[GlobalError]', isFatal ? 'FATAL:' : '', error?.message || error);
  console.error('[GlobalError] Stack:', error?.stack);
  // Don't call originalHandler - that shows the red modal
});

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
