/**
 * Vite `?raw` imports (used by tests that assert the stylesheet contract).
 * https://vite.dev/guide/assets#importing-asset-as-string
 */
declare module '*?raw' {
  const content: string;
  export default content;
}
