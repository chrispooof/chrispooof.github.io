/// <reference types="vite/client" />

declare module '*.pdf?url' {
  const src: string
  export default src
}

declare module '*.mp4?url' {
  const src: string
  export default src
}
