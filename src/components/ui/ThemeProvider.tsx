"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { getAllThemes } from "@/themes/registry"

const themeNames = getAllThemes().map(({ name }) => name)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      themes={themeNames}
      defaultTheme="simple-light"
      enableSystem={false}
      enableColorScheme={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}
