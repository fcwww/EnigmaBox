import type { CipherProvider } from "../types";

import CaesarTool from "./CaesarTool.vue";

export const caesarProvider: CipherProvider = {
  id: "caesar",
  name: "凯撒密码",
  description: "一次性枚举 25 种位移，并标注 shift 位数。",
  route: "/caesar",
  component: CaesarTool
};

