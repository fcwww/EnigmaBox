<script setup lang="ts">
import { ref } from "vue";

import PigpenGlyph from "./PigpenGlyph.vue";
import { gridPosToLetter, xPosToLetter, type PigpenGridPos, type PigpenXPos } from "./pigpen";

const output = ref("");
const flashKey = ref("");

const grid: PigpenGridPos[] = ["tl", "tm", "tr", "ml", "mm", "mr", "bl", "bm", "br"];
const xgrid: PigpenXPos[] = ["top", "right", "bottom", "left"];

function flash(id: string) {
  flashKey.value = id;
  setTimeout(() => {
    if (flashKey.value === id) flashKey.value = "";
  }, 320);
}

function appendGrid(pos: PigpenGridPos, dotted: boolean) {
  flash(`g-${pos}-${dotted ? 1 : 0}`);
  output.value += gridPosToLetter(pos, dotted);
}
function appendX(pos: PigpenXPos, dotted: boolean) {
  flash(`x-${pos}-${dotted ? 1 : 0}`);
  output.value += xPosToLetter(pos, dotted);
}
</script>

<template>
  <div class="grid gap-4">
    <div class="grid md:grid-cols-[1fr_380px] gap-4 items-start">
      <div class="grid gap-4">
        <div class="eb-glass rounded-2xl p-4">
          <div class="text-sm text-white/70">九宫格（无点：A-I / 有点：J-R）</div>
          <div class="mt-3 grid grid-cols-9 gap-2">
            <button
              v-for="pos in grid"
              :key="'n-' + pos"
              class="eb-glass rounded-xl p-2 border transition will-change-transform active:scale-95"
              :class="
                flashKey === `g-${pos}-0`
                  ? '!bg-black !text-white !border-white shadow-[0_0_0_2px_rgba(255,255,255,0.45)] scale-[1.03]'
                  : '!bg-white/90 !text-black !border-white/80 hover:!bg-white'
              "
              @click="appendGrid(pos, false)"
              title="无点"
            >
              <PigpenGlyph kind="grid" :grid-pos="pos" />
            </button>
          </div>
          <div class="mt-3 grid grid-cols-9 gap-2">
            <button
              v-for="pos in grid"
              :key="'d-' + pos"
              class="eb-glass rounded-xl p-2 border transition will-change-transform active:scale-95"
              :class="
                flashKey === `g-${pos}-1`
                  ? '!bg-black !text-white !border-white shadow-[0_0_0_2px_rgba(255,255,255,0.45)] scale-[1.03]'
                  : '!bg-white/90 !text-black !border-white/80 hover:!bg-white'
              "
              @click="appendGrid(pos, true)"
              title="有点"
            >
              <PigpenGlyph kind="grid" :grid-pos="pos" dotted />
            </button>
          </div>
          <div class="mt-3 text-xs text-white/50">点击对应图形即可输出字母（本工具主要用于“解码”场景）。</div>
        </div>

        <div class="eb-glass rounded-2xl p-4">
          <div class="text-sm text-white/70">X 格（无点：S-V / 有点：W-Z）</div>
          <div class="mt-3 grid grid-cols-4 gap-2">
            <button
              v-for="pos in xgrid"
              :key="'xn-' + pos"
              class="eb-glass rounded-xl p-3 border transition will-change-transform active:scale-95"
              :class="
                flashKey === `x-${pos}-0`
                  ? '!bg-black !text-white !border-white shadow-[0_0_0_2px_rgba(255,255,255,0.45)] scale-[1.03]'
                  : '!bg-white/90 !text-black !border-white/80 hover:!bg-white'
              "
              @click="appendX(pos, false)"
              title="无点"
            >
              <PigpenGlyph kind="x" :x-pos="pos" />
            </button>
          </div>
          <div class="mt-3 grid grid-cols-4 gap-2">
            <button
              v-for="pos in xgrid"
              :key="'xd-' + pos"
              class="eb-glass rounded-xl p-3 border transition will-change-transform active:scale-95"
              :class="
                flashKey === `x-${pos}-1`
                  ? '!bg-black !text-white !border-white shadow-[0_0_0_2px_rgba(255,255,255,0.45)] scale-[1.03]'
                  : '!bg-white/90 !text-black !border-white/80 hover:!bg-white'
              "
              @click="appendX(pos, true)"
              title="有点"
            >
              <PigpenGlyph kind="x" :x-pos="pos" dotted />
            </button>
          </div>
        </div>
      </div>

      <div class="grid gap-2">
        <label class="text-sm text-white/70">输出</label>
        <textarea
          v-model="output"
          rows="14"
          class="eb-glass rounded-2xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-300/30 resize-y font-mono"
          placeholder="点击图形块追加字母"
        />
        <div class="flex gap-2">
          <button class="px-3 py-2 rounded-xl eb-glass hover:bg-white/5" @click="output = output.slice(0, -1)">
            退格
          </button>
          <button class="px-3 py-2 rounded-xl eb-glass hover:bg-white/5" @click="output += ' '">
            空格
          </button>
          <button class="px-3 py-2 rounded-xl eb-glass hover:bg-white/5" @click="output = ''">
            清空
          </button>
        </div>
        <div class="text-xs text-white/50">
          注：不同题目可能采用变体（例如字母分组、点的用法等）。如果你在某道题里遇到不一致，我可以按那道题的规则调整映射/图形。
        </div>
      </div>
    </div>
  </div>
</template>
