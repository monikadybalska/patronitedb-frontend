import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";

export default defineConfig(({ command }) => {
  if (command === "serve") {
    return {
      base: "/",
      plugins: [react(), TanStackRouterVite()],
      preview: {
        port: 5173,
        strictPort: true,
      },
      server: {
        port: 5173,
        strictPort: true,
        host: true,
        origin: "http://0.0.0.0:80/5173",
      },
    };
  } else {
    return {
      base: "/",
      plugins: [react(), TanStackRouterVite()],
      preview: {
        port: 80,
        strictPort: true,
      },
      server: {
        port: 80,
        strictPort: true,
        host: true,
        origin: "http://0.0.0.0:80",
      },
    };
  }
});
