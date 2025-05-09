// electron.vite.config.ts
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";
import unfonts from "unplugin-fonts/vite";
import svgr from "vite-plugin-svgr";
import { resolve } from "path";
var __electron_vite_injected_dirname = "C:\\Users\\sfrad\\projects\\twitch-games";
var electron_vite_config_default = defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        "@main": resolve(__electron_vite_injected_dirname, "./src/main/index.ts"),
        "@preload": resolve(__electron_vite_injected_dirname, "./src/preload/index.ts"),
        "@": resolve(__electron_vite_injected_dirname, "./src/renderer/src")
      }
    },
    plugins: [
      react(),
      tailwind(),
      svgr(),
      unfonts({
        google: {
          families: []
        },
        custom: {
          preload: true,
          injectTo: "head",
          families: [
            {
              name: "DIN",
              local: "DIN",
              src: "./src/assets/DIN Next W01 Regular.otf"
            },
            {
              name: "DIN Bold",
              local: "DIN Bold",
              src: "./src/assets/DIN Next W01 Bold.otf"
            },
            {
              name: "DIN Black",
              local: "DIN Black",
              src: "./src/assets/DIN Next W10 Black.otf"
            }
          ]
        }
      })
    ]
  }
});
export {
  electron_vite_config_default as default
};
