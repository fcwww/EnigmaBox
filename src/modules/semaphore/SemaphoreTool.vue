<script setup lang="ts">
import { computed, ref } from "vue";

import { semaphorePairToLetter } from "./semaphore";

const first = ref<number | null>(null);
const second = ref<number | null>(null);
const output = ref("");

const pair = computed(() => {
  if (first.value == null) return null;
  if (second.value == null) return [first.value] as const;
  return [first.value, second.value] as const;
});

const preview = computed(() => {
  if (first.value == null) return "（请选择第 1 个方位）";
  if (second.value == null) return "（请选择第 2 个方位）";
  return semaphorePairToLetter(first.value, second.value) ?? "（无匹配）";
});

function pick(pos: number) {
  if (first.value == null) {
    first.value = pos;
    return;
  }
  if (second.value == null) {
    if (pos === first.value) return;
    second.value = pos;
    return;
  }
  // third click starts a new pair
  first.value = pos;
  second.value = null;
}

function clearPair() {
  first.value = null;
  second.value = null;
}

function appendChar() {
  if (first.value == null || second.value == null) return;
  output.value += semaphorePairToLetter(first.value, second.value) ?? "?";
  clearPair();
}

const positions = [
  { id: 1, label: "↑", x: 50, y: 6 },
  { id: 2, label: "↗", x: 78, y: 14 },
  { id: 3, label: "→", x: 92, y: 50 },
  { id: 4, label: "↘", x: 78, y: 86 },
  { id: 5, label: "↓", x: 50, y: 94 },
  { id: 6, label: "↙", x: 22, y: 86 },
  { id: 7, label: "←", x: 8, y: 50 },
  { id: 8, label: "↖", x: 22, y: 14 }
];
</script>

<template>
  <div class="grid gap-4">
    <div class="grid md:grid-cols-[360px_1fr] gap-4 items-start">
      <div class="eb-glass rounded-2xl p-4">
        <div class="text-sm text-white/70">选择两次方位</div>
        <div class="mt-3 relative mx-auto w-[260px] h-[260px]">
          <button
            v-for="p in positions"
            :key="p.id"
            class="absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl eb-glass border text-sm transition will-change-transform active:scale-95"
            :class="
              first === p.id || second === p.id
                ? '!bg-black !text-white !border-white shadow-[0_0_0_2px_rgba(255,255,255,0.45)] scale-[1.03]'
                : '!bg-white/90 !text-black !border-white/80 hover:!bg-white'
            "
            :style="{ left: p.x + '%', top: p.y + '%' }"
            @click="pick(p.id)"
            :title="`方位 ${p.id}`"
          >
            <div class="text-lg leading-none">{{ p.label }}</div>
            <div class="text-[10px]" :class="first === p.id || second === p.id ? 'text-white/75' : 'text-black/70'">
              {{ p.id }}
            </div>
          </button>

          <div
            class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 eb-glass rounded-2xl px-3 py-2 border border-white/10"
          >
            <div class="text-xs text-white/55">当前</div>
            <div class="mt-1 font-mono text-sm">
              <span v-if="pair == null">-</span>
              <span v-else-if="pair.length === 1">{{ pair[0] }}</span>
              <span v-else>{{ pair[0] }} + {{ pair[1] }}</span>
            </div>
          </div>
        </div>

        <div class="mt-4">
          <div class="text-sm text-white/70">实时预览</div>
          <div class="mt-2 eb-glass rounded-xl p-3 font-mono text-lg">{{ preview }}</div>
        </div>

        <div class="mt-4 flex gap-2">
          <button class="px-3 py-2 rounded-xl eb-glass hover:bg-white/5" @click="appendChar">
            添加字符
          </button>
          <button class="px-3 py-2 rounded-xl eb-glass hover:bg-white/5" @click="output += ' '">
            空格
          </button>
          <button class="px-3 py-2 rounded-xl eb-glass hover:bg-white/5" @click="clearPair">
            清选择
          </button>
        </div>
      </div>

      <div class="grid gap-2">
        <label class="text-sm text-white/70">输出</label>
        <textarea
          v-model="output"
          rows="10"
          class="eb-glass rounded-2xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-300/30 resize-y font-mono"
          placeholder="点击“添加字符”将预览字母追加到这里"
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
