/// <reference types="vite/client" />
/// <reference types="vite-imagetools/client" />

/** Computed at build time by `age.ts`. Null when the birthday isn't configured, as in local dev. */
declare const __AGE__: number | null

declare module "*.mdx" {
  let MDXComponent: (props: any) => JSX.Element
  export default MDXComponent
}

declare module "*?as=metadata" {
  const value: { src: string; width: number; height: number }
  export default value
}
