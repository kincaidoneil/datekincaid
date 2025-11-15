/// <reference types="vite/client" />
/// <reference types="vite-imagetools/client" />

declare module "*.mdx" {
  let MDXComponent: (props: any) => JSX.Element
  export default MDXComponent
}

declare module "*?as=metadata" {
  const value: { src: string; width: number; height: number }
  export default value
}
