module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      '@babel/plugin-proposal-export-namespace-from',
      [
        'module-resolver',
        {
          root: ['.'],
          extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.json', '.tsx', '.ts', '.native.js'],
          alias: {
            '@': './app',
            '@components': './app/components',
            '@constants': './app/constants',
            '@hooks': './app/hooks',
            '@storage': './app/storage',
          },
        },
      ],
    ],
  };
}; 