import { useState, useLayoutEffect } from "react"

export const useFontsReady = (): boolean => {
  const [fontsReady, setFontsReady] = useState(false)
  useLayoutEffect(() => {
    document.fonts.ready.then(() => setFontsReady(true))
  }, [])

  return fontsReady
}
