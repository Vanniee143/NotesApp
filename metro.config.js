// Simple metro config for Expo
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer')
};

config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...config.resolver.sourceExts, 'svg', 'jsx', 'js', 'ts', 'tsx', 'json'],
  alias: {
    '@': path.resolve(__dirname, 'app'),
    '@components': path.resolve(__dirname, 'app/components'),
    '@constants': path.resolve(__dirname, 'app/constants'),
    '@hooks': path.resolve(__dirname, 'app/hooks'),
  },
};

module.exports = config;