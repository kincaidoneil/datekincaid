import mdx from "@mdx-js/rollup"
import tailwindcss from "@tailwindcss/vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import react from "@vitejs/plugin-react"
import rehypeExternalLinks from "rehype-external-links"
import { defineConfig, loadEnv } from "vite"
import { imagetools } from "vite-imagetools"
import mkcert from "vite-plugin-mkcert"

import { parseConfig, shownAge } from "./age.ts"

export default defineConfig(async ({ mode }) => ({
  define: {
    __AGE__: JSON.stringify(await buildAge(mode)),
  },
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
}))

/**
 * Local builds without the env vars just leave the age off. On Vercel, failing
 * the build keeps the last good deploy live instead of shipping without it.
 */
async function buildAge(mode: string): Promise<number | null> {
  const config = parseConfig(loadEnv(mode, process.cwd(), ""))
  if (config) return shownAge(config, new Date())
  if (process.env.VERCEL) {
    throw new Error("BIRTHDAY and AGE_SECRET must be set; see age.ts")
  }
  return null
}
