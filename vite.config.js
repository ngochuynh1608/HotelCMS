import { copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

function copySiteContent() {
  return {
    name: "copy-site-content",
    buildStart() {
      const src = resolve(process.cwd(), "data/site-content.json");
      const dest = resolve(process.cwd(), "public/site-content.json");
      if (existsSync(src)) copyFileSync(src, dest);
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = (req.url || "").split("?")[0];
        if (req.method === "POST" && path === "/reservation") {
          res.statusCode = 303;
          res.setHeader("Location", "/reservation");
          res.end();
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), copySiteContent()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8787",
        changeOrigin: true,
      },
    },
  },
});
