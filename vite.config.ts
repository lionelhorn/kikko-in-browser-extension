import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import {crx} from "@crxjs/vite-plugin";
import {manifest} from "./manifest.config";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
    },
  },
  build: { minify: false, sourcemap: true },
  plugins: [
    crx({manifest}),
    react()],
});
