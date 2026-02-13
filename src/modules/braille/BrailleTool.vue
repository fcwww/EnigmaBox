<script setup lang="ts">
import { computed, ref } from "vue";

import { dotsToMask, maskToLetter } from "./braille";

const dots = ref<boolean[]>([false, false, false, false, false, false]);
const output = ref("");

const mask = computed(() => dotsToMask(dots.value));
const preview = computed(() => maskToLetter(mask.value) ?? "（无匹配）");

function toggle(i: number) {
  dots.value[i] = !dots.value[i];
}

function clearDots() {
  dots.value = [false, false, false, false, false, false];
}

function appendChar() {
  const ch = maskToLetter(mask.value);
  output.value += ch ?? "?";
  clearDots();
}
</script>

<template>
  <div class="grid gap-4">
    <div class="grid md:grid-cols-[320px_1fr] gap-4 items-start">
      <div class="eb-glass rounded-2xl p-4">
        <div class="text-sm text-white/70">2x3 点阵输入</div>
        <div class="mt-3 grid grid-cols-2 gap-2 w-fit">
          <button
            v-for="i in 6"
            :key="i"
            class="w-14 h-14 rounded-2xl eb-glass border transition will-change-transform active:scale-95"
            :class="
              dots[i - 1]
                ? '!bg-black !text-white !border-white shadow-[0_0_0_2px_rgba(255,255,255,0.45)] scale-[1.02]'
                : '!bg-white/90 !text-black !border-white/80 hover:!bg-white'
            "
            @click="toggle(i - 1)"
          >
            <div class="text-xs" :class="dots[i - 1] ? 'text-white/85' : 'text-black/75'">点{{ i }}</div>
          </button>
        </div>

        <div class="mt-4 text-sm">
          <div class="text-white/70">实时预览</div>
          <div class="mt-2 eb-glass rounded-xl p-3 font-mono text-lg">{{ preview }}</div>
        </div>

        <div class="mt-4 flex gap-2">
          <button class="px-3 py-2 rounded-xl eb-glass hover:bg-white/5" @click="appendChar">
            添加字符
          </button>
          <button class="px-3 py-2 rounded-xl eb-glass hover:bg-white/5" @click="output += ' '">
            空格
          </button>
          <button class="px-3 py-2 rounded-xl eb-glass hover:bg-white/5" @click="clearDots">
            清点
          </button>
        </div>

        <div class="mt-3 text-xs text-white/50">
          当前实现：基础英文盲文 Grade-1 的字母 a-z 映射；未匹配输出 ?。
        </div>
      </div>

      <div class="grid gap-2">
        <label class="text-sm text-white/70">输出</label>
        <textarea
          v-model="output"
          rows="10"
          class="eb-glass rounded-2xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-300/30 resize-y font-mono"
          placeholder="点击“添加字符”将预览字符追加到这里"
        />
        <div class="flex gap-2">
          <button class="px-3 py-2 rounded-xl eb-glass hover:bg-white/5" @click="output = output.slice(0, -1)">
            退格
          </button>
          <button class="px-3 py-2 rounded-xl eb-glass hover:bg-white/5" @click="output = ''">清空输出</button>
        </div>
      </div>
    </div>
  </div>
</template>
