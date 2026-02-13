<script setup lang="ts">
import { computed, ref } from "vue";

import { caesarAllShifts } from "./caesar";

const input = ref("");
const results = computed(() => (input.value ? caesarAllShifts(input.value) : []));
</script>

<template>
  <div class="grid gap-4">
    <div class="grid gap-2">
      <label class="text-sm text-white/70">输入</label>
      <textarea
        v-model="input"
        rows="4"
        placeholder="输入要尝试的文本，例如：KHOOR"
        class="eb-glass rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-300/30 resize-y"
      />
      <div class="text-xs text-white/50">
        说明：shift=1 表示每个字母向后移 1 位（A->B）。非字母字符保持不变。
      </div>
    </div>

    <div class="grid gap-2">
      <label class="text-sm text-white/70">25 种位移结果</label>
      <div class="eb-glass rounded-xl overflow-hidden">
        <div v-if="results.length === 0" class="p-3 text-sm text-white/55">请输入内容后自动生成。</div>
        <div v-else class="max-h-[420px] overflow-auto">
          <div
            v-for="row in results"
            :key="row.shift"
            class="px-3 py-2 border-b border-white/10 last:border-b-0"
          >
            <div class="text-xs text-white/55">shift={{ row.shift }}</div>
            <div class="mt-1 font-mono text-sm whitespace-pre-wrap break-words">{{ row.result }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

