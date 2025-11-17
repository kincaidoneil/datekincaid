import { useEffect, useLayoutEffect, useState } from "react"

export const useFontsReady = (): boolean => {
  const [fontsReady, setFontsReady] = useState(false)
  useLayoutEffect(() => {
    document.fonts.ready.then(() => setFontsReady(true))
  }, [])

  return fontsReady
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}
