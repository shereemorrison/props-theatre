/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly [key: string]: any;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  glob<T = Record<string, () => Promise<unknown>>>(pattern: string, options?: { eager?: boolean }): Record<string, T>;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}
