import type { CipherProvider } from "../types";

import WordSearchTool from "./WordSearchTool.vue";

export const wordSearchProvider: CipherProvider = {
  id: "word-search",
  name: "Nutrimatic 猜词",
  description: "按表达式检索候选词，并用可配置的 LLM 辅助判断最可能的答案。",
  route: "/word-search",
  component: WordSearchTool
};
