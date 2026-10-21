import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig({
  // Relative asset paths so the popup loads from chrome-extension://<id>/index.html
  base: "./",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    {
      // ExtensionPay's content script (runs only on extensionpay.com) tells the
      // extension the moment a payment succeeds.
      name: "copy-extpay-content-script",
      generateBundle() {
        this.emitFile({
          type: "asset",
          fileName: "ExtPay.js",
          source: fs.readFileSync(path.resolve(__dirname, "node_modules/extpay/dist/ExtPay.js"), "utf8"),
        });
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, "index.html"),
        background: path.resolve(__dirname, "src/background.ts"),
      },
      output: {
        // manifest.json points at a fixed background.js
        entryFileNames: (chunk) =>
          chunk.name === "background" ? "background.js" : "assets/[name]-[hash].js",
      },
    },
  },
});
