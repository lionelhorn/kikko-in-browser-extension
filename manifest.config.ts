import {defineManifest} from "@crxjs/vite-plugin";
import packageJson from "./package.json";

const {version, name: packageName} = packageJson;

// Convert from Semver (example: 0.1.0-beta6)
const [major, minor, patch, label = "0"] = version
  // can only contain digits, dots, or dash
  .replace(/[^\d.-]+/g, "")
  // split into version parts
  .split(/[.-]/);

export const manifest = defineManifest(async (env) => ({
  manifest_version: 3,
  name:
    env.mode === "staging"
      ? `[INTERNAL] ${packageName}`
      : packageName,
  // up to four numbers separated by dots
  version: `${major}.${minor}.${patch}.${label}`,
  // semver is OK in "version_name"
  version_name: version,
  content_scripts: [{
    js: ["./src/content.tsx"],
    matches: ["<all_urls>"],
  }],
  background: {
    service_worker: "src/background/index.ts",
    type: "module",
  },
  action: {
    "default_popup": "index.html",
  },
  web_accessible_resources: [{
    matches: [],
    resources: [
      "node_modules/.pnpm/@kikko-land+sql.js@1.6.8/node_modules/@kikko-land/sql.js/dist/sql-wasm.wasm"
    ],
  },
  ],
  permissions: [
    "storage"
  ],
  content_security_policy: {
    "extension_pages": "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'"
  }
}));
