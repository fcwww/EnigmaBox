import type { CipherProvider } from "../types";

import SemaphoreTool from "./SemaphoreTool.vue";

export const semaphoreProvider: CipherProvider = {
  id: "semaphore",
  name: "旗语解码",
  description: "8 方位圆形按钮，依次选两次，实时显示对应字母。",
  route: "/semaphore",
  component: SemaphoreTool
};

