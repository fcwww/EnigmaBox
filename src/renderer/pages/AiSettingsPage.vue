<script setup lang="ts">
import { onMounted, ref } from "vue";

import type { LlmSettingsSummary } from "../../shared/word-search";

const settings = ref<LlmSettingsSummary | null>(null);
const endpoint = ref("https://api.deepseek.com/chat/completions");
const model = ref("deepseek-chat");
const apiKey = ref("");
const clearApiKey = ref(false);
const loading = ref(false);
const saving = ref(false);
const errorMessage = ref("");
const notice = ref("");

async function loadSettings() {
  loading.value = true;
  errorMessage.value = "";
  try {
    settings.value = await window.enigmabox!.ai.getSettings();
    endpoint.value = settings.value.endpoint;
    model.value = settings.value.model;
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : String(error);
  } finally {
    loading.value = false;
  }
}

async function saveSettings() {
  errorMessage.value = "";
  notice.value = "";
  saving.value = true;
  try {
    settings.value = await window.enigmabox!.ai.saveSettings({
      endpoint: endpoint.value,
      model: model.value,
      apiKey: apiKey.value,
      clearApiKey: clearApiKey.value
    });
    apiKey.value = "";
    clearApiKey.value = false;
    notice.value = settings.value.hasApiKey
      ? "全局 AI 设置已保存，所有支持 AI 的工具都会使用这套配置。"
      : "全局 AI 设置已保存。";
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : String(error);
  } finally {
    saving.value = false;
  }
}

onMounted(loadSettings);
</script>

<template>
  <div class="mx-auto grid max-w-3xl gap-5">
    <div class="rounded-2xl border border-cyan-200/15 bg-cyan-200/[0.035] p-5">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div class="text-sm font-semibold tracking-wide text-cyan-100">统一 AI 连接</div>
          <p class="mt-1.5 max-w-xl text-sm leading-relaxed text-white/55">
            在这里保存模型服务配置。Nutrimatic 猜词及后续 AI 功能将共用同一套地址、模型和 API Key。
          </p>
        </div>
        <span
          v-if="settings"
          class="rounded-full border px-2.5 py-1 text-[11px]"
          :class="settings.hasApiKey ? 'border-emerald-200/20 bg-emerald-200/5 text-emerald-200' : 'border-white/10 bg-white/5 text-white/45'"
        >
          {{ settings.hasApiKey ? "API Key 已保存" : "未配置 Key" }}
        </span>
      </div>
    </div>

    <div class="grid gap-4 rounded-2xl border border-white/10 bg-black/10 p-5">
      <label class="grid gap-1.5">
        <span class="text-xs font-medium text-white/65">Chat Completions URL</span>
        <input
          v-model="endpoint"
          class="eb-glass rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-cyan-300/30"
          placeholder="https://api.deepseek.com/chat/completions"
        />
        <span class="text-[11px] text-white/40">使用兼容 OpenAI Chat Completions 的完整地址。</span>
      </label>

      <div class="grid gap-4 sm:grid-cols-2">
        <label class="grid gap-1.5">
          <span class="text-xs font-medium text-white/65">模型名称</span>
          <input
            v-model="model"
            class="eb-glass rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-cyan-300/30"
            placeholder="deepseek-chat"
          />
        </label>
        <label class="grid gap-1.5">
          <span class="text-xs font-medium text-white/65">API Key</span>
          <input
            v-model="apiKey"
            type="password"
            autocomplete="off"
            class="eb-glass rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-cyan-300/30"
            placeholder="留空则保留当前 Key"
          />
        </label>
      </div>

      <label class="flex items-center gap-2 text-xs text-white/60">
        <input v-model="clearApiKey" type="checkbox" class="accent-cyan-200" />
        清除已保存的 API Key
      </label>

      <div class="flex flex-wrap items-center gap-3">
        <button
          class="rounded-xl bg-cyan-200 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100 active:scale-95 disabled:cursor-wait disabled:opacity-60"
          :disabled="loading || saving"
          @click="saveSettings"
        >
          {{ saving ? "保存中..." : "保存全局设置" }}
        </button>
        <button
          class="rounded-xl border border-white/15 px-3 py-2.5 text-xs text-white/65 transition hover:bg-white/5 active:scale-95 disabled:opacity-50"
          :disabled="loading || saving"
          @click="loadSettings"
        >
          重新读取
        </button>
        <span v-if="notice" class="text-xs text-emerald-200/80">{{ notice }}</span>
      </div>
    </div>

    <div class="rounded-2xl border border-amber-200/10 bg-amber-200/[0.035] p-4 text-xs leading-relaxed text-amber-50/65">
      <div class="font-medium text-amber-100">本机存储与服务兼容性</div>
      <p class="mt-1.5">Key 只会经由 Electron 主进程保存到本机用户数据目录。系统支持时会使用安全存储加密；页面不会读取已保存 Key 的明文。</p>
      <p class="mt-1">默认值适用于 DeepSeek：<code class="text-amber-100/90">https://api.deepseek.com/chat/completions</code> 与 <code class="text-amber-100/90">deepseek-chat</code>。</p>
    </div>

    <div v-if="errorMessage" class="rounded-xl border border-red-300/20 bg-red-300/10 p-3 text-sm text-red-100">{{ errorMessage }}</div>
  </div>
</template>
