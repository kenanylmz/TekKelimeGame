const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {};

// Varsayılan Metro config'i alıp Reanimated ile sarmala
module.exports = wrapWithReanimatedMetroConfig(
  mergeConfig(getDefaultConfig(__dirname), config),
);
