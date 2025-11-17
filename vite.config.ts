import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import mdx from "@mdx-js/rollup"
import { imagetools } from "vite-imagetools"
import rehypeExternalLinks from "rehype-external-links"
import tsconfigPaths from "vite-tsconfig-paths"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: false, // Errors with broken links: we use <a> links for lightbox.
      },
    }),
    react(), // Must come after Tanstack Start
    tailwindcss(),
    imagetools(),
    mdx({
      rehypePlugins: [
        [rehypeExternalLinks, { target: "_blank", rel: ["noopener"] }],
      ],
    }),
  ],
  build: {
    outDir: "dist",
  },
})
