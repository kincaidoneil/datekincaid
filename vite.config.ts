import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import mdx from "@mdx-js/rollup"
import { imagetools } from "vite-imagetools"
import rehypeExternalLinks from "rehype-external-links"

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    imagetools(),
    mdx({
      rehypePlugins: [
        [rehypeExternalLinks, { target: "_blank", rel: ["noopener"] }],
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  build: {
    outDir: "dist",
  },
})
