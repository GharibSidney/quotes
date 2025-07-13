const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// More aggressive polling configuration
config.server = {
  ...config.server,
  usePolling: true,
  pollingInterval: 2000,
};

// Reduce file watching load
config.watchFolders = [];
config.maxWorkers = 1;

// Additional configurations to reduce file watching
config.resolver = {
  ...config.resolver,
  platforms: ['ios', 'android', 'web'],
};

// Disable file watching entirely
config.watcher = {
  ...config.watcher,
  useWatchman: false,
  watchman: false,
};

module.exports = config;
