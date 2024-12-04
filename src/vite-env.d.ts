/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GITHUB_TOKEN: string
  // add more env variables types here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
