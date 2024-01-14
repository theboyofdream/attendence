module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['module-resolver',
      {
        extensions: ['.ios.js', '.android.js', '.ios.jsx', '.android.jsx', '.js', '.jsx', '.json', '.ts', '.tsx'],
        root: ['.'],
        alias: {
          // '~api': './src/api',
          '~assets': './src/assets',
          '~components': './src/components',
          '~pages': './src/pages',
          // '~providers': './src/providers',
          '~stores': './src/stores',
          '~utils': './src/utils',
          '~src': './src',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ]
};
