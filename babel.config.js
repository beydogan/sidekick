module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    '@babel/plugin-transform-export-namespace-from',
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          '@features': './src/features',
          '@ui': './src/ui',
          '@theme': './src/theme',
          '@libs': './src/libs',
          '@hooks': './src/hooks',
          '@utils': './src/utils',
          '@stores': './src/stores',
          '@app': './src/app',
          '@env': './src/env',
          '@assets': './src/assets',
        },
      },
    ],
  ],
};
