import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Собираем проект в готовую статическую папку out
  images: {
    unoptimized: true, // Отключаем серверную обработку картинок
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
