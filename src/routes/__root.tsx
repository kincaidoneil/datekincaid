/// <reference types="vite/client" />
// Albert Sans variable doesn't render in iOS 26 lockdown mode.
import "@fontsource/albert-sans"
import "@fontsource/albert-sans/900.css"
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router"
import type { ReactNode } from "react"
import { Toaster } from "sonner"

import "@/global.css"

export const Route = createRootRoute({
  notFoundComponent: () => <h1>Not Found</h1>,
  head: () => ({
    links: [
      {
        rel: "icon",
        type: "image/png",
        href: "/favicon.png",
      },
      {
        rel: "canonical",
        href: "https://datekincaid.com",
      },
    ],
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Date Kincaid",
      },

      // OpenGraph metadata
      {
        // Serves as both OG description and standard <meta> description
        name: "description",
        property: "og:description",
        content:
          "Let’s grab a drink, build a pillow fort, and plot our political power couple ascension.",
      },
      {
        property: "og:title",
        content: "Date Kincaid",
      },
      {
        // 1200x630 is canonical dimensions for OG preview image
        property: "og:image",
        content: "/og-preview.jpg",
      },
      {
        property: "og:url",
        content: "https://datekincaid.com",
      },

      {
        name: "theme-color",
        content: "#f8fafc", // Tailwind slate-50 converted to hex
      },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
      <Toaster
        toastOptions={{
          classNames: {
            toast: "bg-white text-slate-900 shadow-lg",
            title: "font-serif text-lg",
            description: "font-serif text-slate-600",
          },
        }}
      />
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  )
}
