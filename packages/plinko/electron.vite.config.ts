import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";
import unfonts from "unplugin-fonts/vite";
import svgr from "vite-plugin-svgr";
import { resolve } from "path";

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    resolve: {
      alias: {
        "@main": resolve(__dirname, "./src/main/index.ts"),
        "@preload": resolve(__dirname, "./src/preload/index.ts"),
        "@": resolve(__dirname, "./src/renderer/src"),
      },
    },
    plugins: [
      react(),
      tailwind(),
      svgr(),
      unfonts({
        custom: {
          preload: true,
          injectTo: "head",
          families: [
            // add your custom fonts here
          ],
        },
      }),
    ],
  },
});
