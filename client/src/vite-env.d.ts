/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Hosted API origin, e.g. https://api.yourdomain.com — no trailing slash */
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
