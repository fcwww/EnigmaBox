import type { CipherProvider } from "../types";

import PigpenTool from "./PigpenTool.vue";

export const pigpenProvider: CipherProvider = {
  id: "pigpen",
  name: "猪圈密码",
  description: "九宫格 / X 格图形输入解码（点击对应图形块输出字母）。",
  route: "/pigpen",
  component: PigpenTool
};

