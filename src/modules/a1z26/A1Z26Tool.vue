<script setup lang="ts">
import { computed, ref } from "vue";

import {
  a1z26ToLetters,
  cantor4ToA1Z26,
  lettersToA1Z26,
  parseBinary5,
  parseCantor4Digits,
  parseDecimalNumbers,
  parseTernary3,
  toBinary5,
  toTernary3
} from "./a1z26";

type Mode =
  | "letters_to_all"
  | "dec_to_letters"
  | "bin5_to_letters"
  | "ter3_to_letters"
  | "cantor4_to_a1z26";

const mode = ref<Mode>("letters_to_all");
const input = ref("");

const result = computed(() => {
  const raw = input.value;
  if (!raw.trim()) return { ok: true, lines: ["请输入内容。"] as string[] };

  try {
    if (mode.value === "letters_to_all") {
      const nums = lettersToA1Z26(raw);
      const dec = nums.join(" ");
      const bin5 = toBinary5(nums);
      const ter3 = toTernary3(nums);
      return {
        ok: true,
        lines: [
          `A1Z26(10进制)：${dec || "(空)"}`,
          `A1Z26(2进制5位)：${bin5 || "(空)"}`,
          `A1Z26(3进制3位)：${ter3 || "(空)"}`
        ]
      };
    }

    if (mode.value === "dec_to_letters") {
      const nums = parseDecimalNumbers(raw);
      return { ok: true, lines: [`输出：${a1z26ToLetters(nums)}`] };
    }

    if (mode.value === "bin5_to_letters") {
      const nums = parseBinary5(raw);
      return { ok: true, lines: [`输出：${a1z26ToLetters(nums)}`] };
    }

    if (mode.value === "ter3_to_letters") {
      const nums = parseTernary3(raw);
      return { ok: true, lines: [`输出：${a1z26ToLetters(nums)}`] };
    }

    const digits = parseCantor4Digits(raw);
    if (digits.length === 0 || digits.length % 4 !== 0) {
      return {
        ok: false,
        lines: [
          "格式不对：请输入由 1..4 构成的 4 位排列；也支持多个排列拼接输入（必须刚好每 4 位一组）。",
          "示例：1234 => A；1243 => B；或输入：1234 1243 1324"
        ]
      };
    }

    const ranks: number[] = [];
    const nums: number[] = [];
    for (let i = 0; i < digits.length; i += 4) {
      const chunk = digits.slice(i, i + 4);
      const mapped = cantor4ToA1Z26(chunk);
      if (!mapped) {
        return {
          ok: false,
          lines: [`第 ${(i / 4) + 1} 组无效：${chunk.join("")}（需要是 1..4 的排列）`]
        };
      }
      ranks.push(mapped.value);
      nums.push(mapped.a1z26);
    }

    const letters = a1z26ToLetters(nums);
    return { ok: true, lines: [`输出：${letters}`, `A1Z26：${nums.join(" ")}`, `康拓序号：${ranks.join(" ")}`] };
  } catch (e) {
    return { ok: false, lines: [`解析失败：${String(e)}`] };
  }
});
</script>

<template>
  <div class="grid gap-4">
    <div class="grid gap-2">
      <label class="text-sm text-white/70">模式</label>
      <select
        v-model="mode"
        class="eb-glass rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-300/30"
      >
        <option value="letters_to_all">字母 -> A1Z26(10/2/3)</option>
        <option value="dec_to_letters">A1Z26(10进制) -> 字母</option>
        <option value="bin5_to_letters">A1Z26(2进制5位) -> 字母</option>
        <option value="ter3_to_letters">A1Z26(3进制3位) -> 字母</option>
        <option value="cantor4_to_a1z26">四位康拓展开(排列 1..4) -> A1Z26</option>
      </select>
    </div>

    <div class="grid gap-2">
      <label class="text-sm text-white/70">输入</label>
      <textarea
        v-model="input"
        rows="4"
        placeholder="示例：HELLO / 8 5 12 12 15 / 01000 00101 ... / 1234"
        class="eb-glass rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-300/30 resize-y"
      />
      <div class="text-xs text-white/50">
        提示：数字输入支持任意分隔符；二进制/三进制会自动按 5 位/3 位切分。
      </div>
    </div>

    <div class="grid gap-2">
      <label class="text-sm text-white/70">输出</label>
      <div
        class="eb-glass rounded-xl p-3 text-sm leading-relaxed whitespace-pre-wrap"
        :class="result.ok ? '' : 'border-red-400/30'"
      >
        <div v-for="(line, idx) in result.lines" :key="idx">{{ line }}</div>
      </div>
      <div v-if="mode === 'cantor4_to_a1z26'" class="text-xs text-white/50">
        规则：把输入当作 1..4 的排列做康托展开排名；rank=0 对应 A，rank=23 对应 X。
      </div>
    </div>
  </div>
</template>
