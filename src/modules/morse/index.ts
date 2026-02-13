import type { CipherProvider } from "../types";

import MorseTool from "./MorseTool.vue";

export const morseProvider: CipherProvider = {
  id: "morse",
  name: "摩斯电码",
  description: "支持 . / - 交互输入，并可编码与解码。",
  route: "/morse",
  component: MorseTool
};

