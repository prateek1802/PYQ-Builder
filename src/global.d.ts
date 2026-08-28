export {};

declare global {
  interface Window {
    /**
     * Provided by the KaTeX auto-render CDN script loaded in index.html.
     * Optional because it's a third-party global, not a local module.
     */
    renderMathInElement?: (
      element: HTMLElement,
      options?: {
        delimiters?: { left: string; right: string; display: boolean }[];
        throwOnError?: boolean;
      }
    ) => void;
  }
}
