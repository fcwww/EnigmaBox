export interface NutrimaticCandidate {
  text: string;
  rank: number;
}

export interface NutrimaticSearchResult {
  query: string;
  sourceUrl: string;
  candidates: NutrimaticCandidate[];
}

export interface LlmSettingsSummary {
  endpoint: string;
  model: string;
  hasApiKey: boolean;
  keyStorage: "encrypted" | "plaintext";
}

export interface SaveLlmSettingsInput {
  endpoint: string;
  model: string;
  apiKey?: string;
  clearApiKey?: boolean;
}

export interface LlmRecommendation {
  candidate: string;
  commonness: "very_common" | "common" | "uncommon" | "rare" | "proper_name";
  translation: string;
}

export interface CandidateAnalysis {
  recommendations: LlmRecommendation[];
  rawResponse: string;
}

export interface CandidateAnalysisInput {
  candidates: string[];
}
