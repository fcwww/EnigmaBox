import type { CipherProvider } from "../types";

import A1Z26Tool from "./A1Z26Tool.vue";

export const a1z26Provider: CipherProvider = {
  id: "a1z26",
  name: "A1Z26 工具",
  description: "字母与数字互转；支持 10/2(5位)/3(3位) 与“四位康拓展开(排列 1..4)”。",
  route: "/a1z26",
  component: A1Z26Tool
};
