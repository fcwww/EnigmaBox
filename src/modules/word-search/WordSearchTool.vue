<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

import type { CandidateAnalysis, NutrimaticSearchResult } from "../../shared/word-search";

const router = useRouter();
const query = ref("[^g][^l]Vr[^e]Vs&CCVCVVC");
const searchResult = ref<NutrimaticSearchResult | null>(null);
const selectedCandidates = ref<string[]>([]);
const analysis = ref<CandidateAnalysis | null>(null);
const loadingSearch = ref(false);
const loadingAnalysis = ref(false);
const errorMessage = ref("");
const notice = ref("");

const examples = [
  { label: "元辅音 + 排除字母", value: "[^g][^l]Vr[^e]Vs&CCVCVVC" },
  { label: "变位词", value: "<integral>" },
  { label: "固定长度", value: '"C*aC*eC*iC*oC*uC*yC*"' }
];

function resetMessages() {
  errorMessage.value = "";
  notice.value = "";
}

function useExample(value: string) {
  query.value = value;
  searchResult.value = null;
  selectedCandidates.value = [];
  analysis.value = null;
  resetMessages();
}

async function search() {
  resetMessages();
  loadingSearch.value = true;
  analysis.value = null;
  selectedCandidates.value = [];
  try {
    searchResult.value = await window.enigmabox!.wordSearch.searchNutrimatic(query.value);
    notice.value = `已找到 ${searchResult.value.candidates.length} 个候选。`;
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : String(error);
    searchResult.value = null;
  } finally {
    loadingSearch.value = false;
  }
}

function toggleCandidate(candidate: string) {
  selectedCandidates.value = selectedCandidates.value.includes(candidate)
    ? selectedCandidates.value.filter((item) => item !== candidate)
    : [...selectedCandidates.value, candidate];
}

function selectTop(count: number) {
  selectedCandidates.value = (searchResult.value?.candidates ?? []).slice(0, count).map((candidate) => candidate.text);
}

async function analyze() {
  resetMessages();
  if (!searchResult.value) {
    errorMessage.value = "请先运行 Nutrimatic 查询。";
    return;
  }

  const candidates = selectedCandidates.value.length
    ? selectedCandidates.value
    : searchResult.value.candidates.slice(0, 30).map((candidate) => candidate.text);
  loadingAnalysis.value = true;
  try {
    analysis.value = await window.enigmabox!.wordSearch.analyzeCandidates({
      candidates
    });
    notice.value = `已分析 ${candidates.length} 个候选。`;
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : String(error);
  } finally {
    loadingAnalysis.value = false;
  }
}

function commonnessClass(commonness: string): string {
  if (commonness === "very_common") return "text-emerald-200 bg-emerald-300/10 border-emerald-200/20";
  if (commonness === "common") return "text-cyan-100 bg-cyan-300/10 border-cyan-200/20";
  if (commonness === "uncommon") return "text-amber-200 bg-amber-300/10 border-amber-200/20";
  return "text-white/60 bg-white/5 border-white/10";
}

function commonnessLabel(commonness: string): string {
  const labels: Record<string, string> = {
    very_common: "高频",
    common: "常用",
    uncommon: "较少见",
    rare: "罕见",
    proper_name: "专名"
  };
  return labels[commonness] ?? "较少见";
}

</script>

<template>
  <div class="grid gap-5">
    <div class="grid gap-3">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div class="text-sm font-semibold tracking-wide text-cyan-100">候选词探测台</div>
          <div class="mt-1 text-xs text-white/50">用 Nutrimatic 获取候选，再按英文常见度和中文释义整理结果。</div>
        </div>
        <button
          class="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white/75 transition hover:bg-white/10 active:scale-95"
          @click="router.push('/ai-settings')"
        >
          全局 AI 设置
        </button>
      </div>

      <div class="flex flex-wrap gap-2">
        <button
          v-for="example in examples"
          :key="example.value"
          class="rounded-lg border border-cyan-200/10 bg-cyan-200/5 px-2.5 py-1.5 text-xs text-cyan-100/75 transition hover:bg-cyan-200/10 active:scale-95"
          @click="useExample(example.value)"
        >
          {{ example.label }}
        </button>
      </div>
    </div>

    <div class="grid gap-3 rounded-2xl border border-white/10 bg-black/10 p-4">
      <label class="grid gap-1.5">
        <span class="text-xs font-medium text-white/65">Nutrimatic 表达式</span>
        <input
          v-model="query"
          class="eb-glass rounded-xl px-3 py-2.5 font-mono text-sm outline-none focus:ring-2 focus:ring-cyan-300/30"
          placeholder="例如：[^g][^l]Vr[^e]Vs&CCVCVVC"
          @keydown.enter="search"
        />
      </label>
      <div class="flex flex-wrap items-center gap-2">
        <button
          class="rounded-xl bg-cyan-200 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_8px_30px_rgba(34,211,238,0.16)] transition hover:bg-cyan-100 active:scale-95 disabled:cursor-wait disabled:opacity-60"
          :disabled="loadingSearch"
          @click="search"
        >
          {{ loadingSearch ? "查询中..." : "获取候选" }}
        </button>
        <a
          v-if="searchResult"
          :href="searchResult.sourceUrl"
          target="_blank"
          rel="noreferrer"
          class="rounded-xl border border-white/15 px-3 py-2.5 text-xs text-white/65 transition hover:bg-white/5"
        >
          打开 Nutrimatic 原页 ↗
        </a>
        <span v-if="notice" class="text-xs text-emerald-200/80">{{ notice }}</span>
      </div>
    </div>

    <div class="grid gap-3">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div class="text-sm font-semibold text-white/80">候选 {{ searchResult ? `（${searchResult.candidates.length}）` : "" }}</div>
        <div v-if="searchResult" class="flex gap-2">
          <button class="rounded-lg border border-white/10 px-2.5 py-1.5 text-[11px] text-white/55 hover:bg-white/5 active:scale-95" @click="selectTop(10)">选前 10</button>
          <button class="rounded-lg border border-white/10 px-2.5 py-1.5 text-[11px] text-white/55 hover:bg-white/5 active:scale-95" @click="selectedCandidates = []">清除选择</button>
        </div>
      </div>
      <div class="eb-glass overflow-hidden rounded-2xl">
        <div v-if="!searchResult" class="p-5 text-sm text-white/45">输入表达式后运行查询。候选会保留 Nutrimatic 的排序。</div>
        <div v-else class="grid max-h-[360px] grid-cols-1 gap-px overflow-auto bg-white/5 sm:grid-cols-2 lg:grid-cols-3">
          <button
            v-for="candidate in searchResult.candidates"
            :key="candidate.rank + candidate.text"
            class="flex items-center gap-3 bg-[#111824] px-3 py-2.5 text-left transition hover:bg-cyan-200/[0.08] active:scale-[0.99]"
            :class="selectedCandidates.includes(candidate.text) ? 'bg-cyan-200/15 text-cyan-50 ring-1 ring-inset ring-cyan-200/30' : ''"
            @click="toggleCandidate(candidate.text)"
          >
            <span class="w-7 shrink-0 font-mono text-[11px] text-white/35">{{ String(candidate.rank).padStart(2, "0") }}</span>
            <span class="truncate font-mono text-sm">{{ candidate.text }}</span>
            <span v-if="selectedCandidates.includes(candidate.text)" class="ml-auto text-xs text-cyan-200">✓</span>
          </button>
        </div>
      </div>
    </div>

    <div class="grid gap-3 rounded-2xl border border-white/10 bg-black/10 p-4">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div class="text-sm font-semibold text-white/80">AI 候选分析</div>
          <div class="mt-1 text-xs text-white/45">默认整理前 30 项；也可以在上方手动选择候选。</div>
        </div>
        <button class="rounded-xl border border-cyan-200/20 bg-cyan-200/10 px-3 py-2 text-xs font-medium text-cyan-100 transition hover:bg-cyan-200/15 active:scale-95 disabled:cursor-wait disabled:opacity-50" :disabled="loadingAnalysis || !searchResult" @click="analyze">
          {{ loadingAnalysis ? "整理中..." : "按常见度排序" }}
        </button>
      </div>
      <div v-if="analysis" class="grid gap-4">
        <div v-if="analysis.recommendations.length" class="grid gap-2">
          <div v-for="item in analysis.recommendations" :key="item.candidate" class="rounded-xl border border-white/10 bg-white/[0.035] p-3">
            <div class="flex flex-wrap items-center gap-2">
              <span class="font-mono text-sm font-semibold text-cyan-100">{{ item.candidate }}</span>
              <span class="rounded-full border px-2 py-0.5 text-[10px]" :class="commonnessClass(item.commonness)">{{ commonnessLabel(item.commonness) }}</span>
            </div>
            <div class="mt-1.5 text-xs leading-relaxed text-white/60">{{ item.translation || "（未提供释义）" }}</div>
          </div>
        </div>
      </div>
      <div v-else class="text-xs leading-relaxed text-white/40">配置全局 API Key 后，AI 会对候选词按英文常见度排序，并提供简短中文释义。它不接收表达式，也不评判 Nutrimatic 的结果。</div>
    </div>

    <div v-if="errorMessage" class="rounded-xl border border-red-300/20 bg-red-300/10 p-3 text-sm leading-relaxed text-red-100">{{ errorMessage }}</div>
  </div>
</template>
