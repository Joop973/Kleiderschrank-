// SQLite im Browser braucht .wasm-Dateien und SharedArrayBuffer (expo-sqlite, Web).
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

if (!config.resolver.assetExts.includes('wasm')) {
  config.resolver.assetExts.push('wasm');
}

const enhanceMiddleware = config.server.enhanceMiddleware;
config.server.enhanceMiddleware = (middleware, metroServer) => {
  const erweitert = enhanceMiddleware ? enhanceMiddleware(middleware, metroServer) : middleware;
  return (req, res, next) => {
    // Gleiche Header wie in netlify.toml; require-corp, weil Safari "credentialless" nicht kennt.
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    return erweitert(req, res, next);
  };
};

module.exports = config;
