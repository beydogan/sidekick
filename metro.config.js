const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    platforms: ['macos', 'ios', 'android'],
  },
};

module.exports = mergeConfig(defaultConfig, config);
