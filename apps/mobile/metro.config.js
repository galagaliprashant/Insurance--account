const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// npm workspaces: let Metro see packages/domain and resolve hoisted deps from the repo root.
config.watchFolders = [monorepoRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];
// Keep normal hierarchical (Node-style) lookup on — some deps (e.g.
// react-native-css-interop) end up nested inside another package's
// node_modules rather than hoisted, and only hierarchical lookup finds those.

module.exports = withNativeWind(config, { input: "./src/global.css" });
