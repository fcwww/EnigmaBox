export {};

declare global {
  interface Window {
    enigmabox?: {
      platform: string;
      node: string;
      chrome: string;
      electron: string;
      ai: {
        getSettings: () => Promise<import("../shared/word-search").LlmSettingsSummary>;
        saveSettings: (input: import("../shared/word-search").SaveLlmSettingsInput) => Promise<import("../shared/word-search").LlmSettingsSummary>;
      };
      wordSearch: {
        searchNutrimatic: (query: string) => Promise<import("../shared/word-search").NutrimaticSearchResult>;
        analyzeCandidates: (input: import("../shared/word-search").CandidateAnalysisInput) => Promise<import("../shared/word-search").CandidateAnalysis>;
      };
    };
  }
}

declare module "*.vue" {
  import type { DefineComponent } from "vue";

  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>;
  export default component;
}
