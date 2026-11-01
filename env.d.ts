/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the photo CDN (R2 custom domain). Falls back to /photos (dev server). */
  readonly VITE_PHOTO_BASE_URL?: string
}

declare module 'virtual:photo-manifest' {
  /** Photo paths relative to src/assets/photos */
  const paths: string[]
  export default paths
}
