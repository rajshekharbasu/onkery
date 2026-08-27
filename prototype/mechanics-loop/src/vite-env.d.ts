/// <reference types="vite/client" />

declare module 'virtual:onkery-bin' {
  export const FILES: Record<string, { src: string; gradient: number }[]>
}
