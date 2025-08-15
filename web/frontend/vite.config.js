
// Vite config for Shopify app frontend
// Ensures API key is available for frontend build and sets up proxy for backend API
import { defineConfig } from "vite";
import { dirname } from "path";
import { fileURLToPath } from "url";
import react from "@vitejs/plugin-react";

import dotenv from "dotenv";
dotenv.config({ path: fileURLToPath(new URL("./.env", import.meta.url)) });

// Ensure API key is present for frontend build
if (
  process.env.npm_lifecycle_event === "build" &&
  !process.env.CI &&
  !process.env.VITE_SHOPIFY_API_KEY && !process.env.SHOPIFY_API_KEY
) {
  throw new Error(
    "\n\nThe frontend build will not work without an API key. " +
    "Set either VITE_SHOPIFY_API_KEY or SHOPIFY_API_KEY in your environment or .env file. " +
    "For example:\n\nVITE_SHOPIFY_API_KEY=<your-api-key> npm run build\n" +
    "or\nSHOPIFY_API_KEY=<your-api-key> npm run build\n"
  );
}


// If only SHOPIFY_API_KEY is set, copy it to VITE_SHOPIFY_API_KEY for Vite
if (process.env.SHOPIFY_API_KEY && !process.env.VITE_SHOPIFY_API_KEY) {
  process.env.VITE_SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY;
}


// Proxy API requests to backend server
const proxyOptions = {
  target: `http://127.0.0.1:${process.env.BACKEND_PORT}`,
  changeOrigin: false,
  secure: true,
  ws: false,
};


// Determine host for HMR
const host = process.env.HOST
  ? process.env.HOST.replace(/https?:\/\//, "")
  : "localhost";


// HMR config for local and remote
let hmrConfig;
if (host === "localhost") {
  hmrConfig = {
    protocol: "ws",
    host: "localhost",
    port: 64999,
    clientPort: 64999,
  };
} else {
  hmrConfig = {
    protocol: "wss",
    host: host,
    port: process.env.FRONTEND_PORT,
    clientPort: 443,
  };
}


// Main Vite config export
export default defineConfig({
  root: dirname(fileURLToPath(import.meta.url)),
  plugins: [react()],
  resolve: {
    preserveSymlinks: true,
  },
  server: {
    host: "localhost",
    port: process.env.FRONTEND_PORT,
    hmr: hmrConfig,
    proxy: {
      "^/(\\?.*)?$": proxyOptions,
      "^/api(/|(\\?.*)?$)": proxyOptions,
      "^/userdata(/|(\\?.*)?$)": proxyOptions
    },
  },
});
