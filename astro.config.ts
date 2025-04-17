import { defineConfig } from "astro/config"
import tailwindcss from "@tailwindcss/vite"

import react from "@astrojs/react"

import rehypeExternalLinks from "rehype-external-links"

import vercel from "@astrojs/vercel"

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react()],

  markdown: {
    remarkPlugins: [],
    rehypePlugins: [
      [rehypeExternalLinks, { target: "_blank", rel: ["noopener"] }], // Omit `noreferrer` - I want Gathers to see referral
    ],
  },

  adapter: vercel(),
})
