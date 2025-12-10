import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Konfigurasi utama untuk proyek React + Vite
export default defineConfig({
  plugins: [react()],
  base: "./", // digunakan agar path asset tetap benar setelah build

  server: {
    host: true, // agar dapat diakses melalui IP LAN (misalnya 192.168.x.x)
    port: 5173, // port default, bisa diubah sesuai kebutuhan

    // Izinkan iframe dari YouTube agar video embed dapat tampil
    headers: {
      "Content-Security-Policy":
        "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com data: blob:;",
      "Cross-Origin-Embedder-Policy": "unsafe-none",
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    },
  },

  // Optimasi dependency agar proses build lebih cepat
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
  },

  // Pengaturan build agar kompatibel di berbagai environment
  build: {
    outDir: "dist",
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
  },
});
