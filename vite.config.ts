import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { resolve } from "path";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import path from "path";
// https://vite.dev/config/
export default defineConfig({
  base: '/bible-talk/',   // 对应 GitHub Pages 的子路径
  plugins: [
    vue(),
    vueJsx(),
    tailwindcss(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
      symbolId: "icon-[dir]-[name]",
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    host: "0.0.0.0", // 监听所有网卡
    port: 5173, // 如有需要可改端口
  },
});
