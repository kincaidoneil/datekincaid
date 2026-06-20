import mdx from "@mdx-js/rollup"
import tailwindcss from "@tailwindcss/vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import react from "@vitejs/plugin-react"
import rehypeExternalLinks from "rehype-external-links"
import { defineConfig } from "vite"
import { imagetools } from "vite-imagetools"
import mkcert from "vite-plugin-mkcert"

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      // Don't build print/ page in production
      routeFileIgnorePattern: process.env.VERCEL ? "print" : undefined,
    }),
    react(), // Must come after Tanstack Start
    tailwindcss(),
    imagetools(),
    mdx({
      rehypePlugins: [
        [rehypeExternalLinks, { target: "_blank", rel: ["noopener"] }],
      ],
      providerImportSource: "@mdx-js/react",
    }),
    process.env.NODE_ENV === "development" && mkcert(),
  ],
  build: {
    outDir: "dist",
  },
})
