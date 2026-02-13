import type { CipherProvider } from "../types";

import BrailleTool from "./BrailleTool.vue";

export const brailleProvider: CipherProvider = {
  id: "braille",
  name: "盲文解码",
  description: "2x3 点阵交互输入，实时显示对应字符（基础 a-z）。",
  route: "/braille",
  component: BrailleTool
};

