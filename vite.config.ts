import mdx from "@mdx-js/rollup"
import tailwindcss from "@tailwindcss/vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import react from "@vitejs/plugin-react"
import rehypeExternalLinks from "rehype-external-links"
import { defineConfig } from "vite"
import { imagetools } from "vite-imagetools"
import mkcert from "vite-plugin-mkcert"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: false, // Errors with broken links: we use <a> links for lightbox.
      },
      router: {
        // Don't build print/ page in production
        routeFileIgnorePattern: process.env.VERCEL ? "print" : undefined,
      },
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
    !process.env.VERCEL && mkcert(),
  ],
  build: {
    outDir: "dist",
  },
})
