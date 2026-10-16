import { resolve } from "path";
import { defineConfig } from "vite";

// One HTML entry per page; Express serves dist/ and maps /plans to plans.html.
const pages = ["index", "category", "plans", "app", "account", "admin"];

export default defineConfig({
  appType: "mpa",
  envDir: false, // the server .env is not for the browser bundle
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: { input: Object.fromEntries(pages.map((name) => [name, resolve(import.meta.dirname, `${name}.html`)])) },
  },
  server: {
    host: "127.0.0.1",
    port: 5173,
    proxy: {
      "/api": "http://127.0.0.1:14000",
      "/health": "http://127.0.0.1:14000",
    },
  },
});
