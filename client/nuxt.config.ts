import { defineNuxtConfig } from "nuxt3";

export default defineNuxtConfig({
  css: ["bootswatch/dist/quartz/bootstrap.min.css"],
  vite: {
    server: {
      host: "0.0.0.0",
      port: 3000,
      strictPort: true,
      hmr: {
        port: 443,
      },
    },
  },
});
