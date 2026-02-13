export {};

declare global {
  interface Window {
    enigmabox?: {
      platform: string;
      node: string;
      chrome: string;
      electron: string;
    };
  }
}

declare module "*.vue" {
  import type { DefineComponent } from "vue";

  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>;
  export default component;
}
