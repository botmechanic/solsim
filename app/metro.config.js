const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { resolve: metroResolve } = require('metro-resolver');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const MWA_ENTRIES = {
  '@solana-mobile/mobile-wallet-adapter-protocol-web3js': path.resolve(
    projectRoot,
    'node_modules/@solana-mobile/mobile-wallet-adapter-protocol-web3js/lib/cjs/rn.js',
  ),
  '@solana-mobile/mobile-wallet-adapter-protocol': path.resolve(
    projectRoot,
    'node_modules/@solana-mobile/mobile-wallet-adapter-protocol/lib/cjs/rn.js',
  ),
  '@solana-mobile/mobile-wallet-adapter-protocol/encoding': path.resolve(
    projectRoot,
    'node_modules/@solana-mobile/mobile-wallet-adapter-protocol/lib/cjs/encoding.rn.js',
  ),
};

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  watchFolders: [workspaceRoot],
  resolver: {
    nodeModulesPaths: [path.resolve(projectRoot, 'node_modules')],
    resolveRequest: (context, moduleName, platform) => {
      const forced = MWA_ENTRIES[moduleName];
      if (forced) {
        return { type: 'sourceFile', filePath: forced };
      }
      return metroResolve(
        { ...context, resolveRequest: undefined },
        moduleName,
        platform,
      );
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(projectRoot), config);
