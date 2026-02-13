<script setup lang="ts">
import { computed, ref } from "vue";

import { decodeFromMorse, encodeToMorse } from "./morse";

type Tab = "encode" | "decode";
const tab = ref<Tab>("decode");

const textInput = ref("");
const morseInput = ref("");

const encoded = computed(() => (textInput.value ? encodeToMorse(textInput.value) : ""));
const decoded = computed(() => (morseInput.value ? decodeFromMorse(morseInput.value) : ""));

function appendMorse(s: string) {
  morseInput.value += s;
}

function backspace() {
  morseInput.value = morseInput.value.slice(0, -1);
}

function clear() {
  morseInput.value = "";
  textInput.value = "";
}

const tabBtnBase =
  "px-3 py-2 rounded-xl text-sm border transition will-change-transform active:scale-95";
const tabBtnActive =
  "!bg-white/90 !text-black !border-white/80 shadow-[0_10px_28px_rgba(0,0,0,0.38)]";
const tabBtnInactive =
  "eb-glass text-white border-white/10 hover:bg-white/5 hover:border-white/25";
</script>

<template>
  <div class="grid gap-4">
    <div class="flex gap-2">
      <button
        :class="[
          tabBtnBase,
          tab === 'decode' ? tabBtnActive : tabBtnInactive
        ]"
        @click="tab = 'decode'"
      >
        <span class="inline-flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full" :class="tab === 'decode' ? 'bg-black/70' : 'bg-white/25'" />
          解码（摩斯 -> 文本）
        </span>
      </button>
      <button
        :class="[
          tabBtnBase,
          tab === 'encode' ? tabBtnActive : tabBtnInactive
        ]"
        @click="tab = 'encode'"
      >
        <span class="inline-flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full" :class="tab === 'encode' ? 'bg-black/70' : 'bg-white/25'" />
          编码（文本 -> 摩斯）
        </span>
      </button>
      <div class="flex-1" />
      <button class="px-3 py-2 rounded-xl text-sm eb-glass hover:bg-white/5" @click="clear">清空</button>
    </div>

    <template v-if="tab === 'decode'">
      <div class="grid md:grid-cols-2 gap-4">
        <div class="grid gap-2">
          <label class="text-sm text-white/70">摩斯输入</label>
          <textarea
            v-model="morseInput"
            rows="6"
            placeholder="示例：.... . .-.. .-.. --- / .-- --- .-. .-.. -.."
            class="eb-glass rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-300/30 resize-y"
          />
          <div class="text-xs text-white/50">
            规则：字母之间用空格分隔；单词之间用 <span class="font-mono">/</span> 分隔。
          </div>
        </div>

        <div class="grid gap-2">
          <label class="text-sm text-white/70">解码输出</label>
          <div class="eb-glass rounded-xl p-3 min-h-[160px] font-mono text-sm whitespace-pre-wrap break-words">
            {{ decoded || "（等待输入）" }}
          </div>

          <div class="grid grid-cols-4 gap-2">
            <button class="eb-glass rounded-xl py-2 text-sm hover:bg-white/5" @click="appendMorse('.')">.</button>
            <button class="eb-glass rounded-xl py-2 text-sm hover:bg-white/5" @click="appendMorse('-')">-</button>
            <button class="eb-glass rounded-xl py-2 text-sm hover:bg-white/5" @click="appendMorse(' ')">空格</button>
            <button class="eb-glass rounded-xl py-2 text-sm hover:bg-white/5" @click="appendMorse(' / ')">/</button>
            <button class="eb-glass rounded-xl py-2 text-sm hover:bg-white/5 col-span-2" @click="backspace">退格</button>
            <button class="eb-glass rounded-xl py-2 text-sm hover:bg-white/5 col-span-2" @click="morseInput = ''">清空摩斯</button>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="grid md:grid-cols-2 gap-4">
        <div class="grid gap-2">
          <label class="text-sm text-white/70">文本输入</label>
          <textarea
            v-model="textInput"
            rows="6"
            placeholder="示例：HELLO WORLD"
            class="eb-glass rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-300/30 resize-y"
          />
          <div class="text-xs text-white/50">支持 A-Z / 0-9 和部分标点；未知字符会输出 ?</div>
        </div>

        <div class="grid gap-2">
          <label class="text-sm text-white/70">编码输出</label>
          <div class="eb-glass rounded-xl p-3 min-h-[160px] font-mono text-sm whitespace-pre-wrap break-words">
            {{ encoded || "（等待输入）" }}
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
