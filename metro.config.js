const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    platforms: ['macos', 'ios', 'android'],
    blockList: [/node_modules\/react-native-screens\/.*/],
  },
};

module.exports = mergeConfig(defaultConfig, config);
