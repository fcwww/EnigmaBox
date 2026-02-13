<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

import { cipherProviders } from "@modules/index";

const route = useRoute();
const active = computed(() => cipherProviders.find((p) => p.route === route.path));

// In Vue templates, globals like `window` are not automatically in-scope.
// Expose what we need as a setup binding.
const runtime = computed(() => window.enigmabox);
</script>

<template>
  <div class="h-full">
    <div class="h-full grid grid-cols-[280px_1fr] gap-4 p-4">
      <aside class="eb-glass rounded-2xl p-4">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-lg font-semibold tracking-wide">EnigmaBox</div>
            <div class="text-xs text-white/60 mt-0.5">Puzzle Hunt 密码工具箱</div>
          </div>
          <div class="w-2.5 h-2.5 rounded-full bg-cyan-300/90 eb-breathe" />
        </div>

        <div class="mt-6 text-xs text-white/50">密码编解码</div>
        <nav class="mt-2 flex flex-col gap-1.5">
          <RouterLink
            v-for="p in cipherProviders"
            :key="p.id"
            :to="p.route"
            class="rounded-xl px-3 py-2 text-sm transition border border-transparent hover:border-white/10 hover:bg-white/5"
            :class="route.path === p.route ? 'bg-white/10 border-white/20' : ''"
          >
            <div class="flex items-center justify-between gap-2">
              <div class="font-medium">{{ p.name }}</div>
            </div>
            <div class="text-xs text-white/55 mt-1 leading-snug">{{ p.description }}</div>
          </RouterLink>
        </nav>

        <div class="mt-6 text-[11px] text-white/45">
          <div>平台：{{ runtime?.platform ?? "未知" }}</div>
          <div class="mt-1">Electron：{{ runtime?.electron ?? "-" }}</div>
        </div>
      </aside>

      <main class="min-w-0">
        <header class="eb-glass rounded-2xl p-5">
          <div class="text-xl font-semibold">{{ active?.name ?? "工具" }}</div>
          <div class="mt-1 text-sm text-white/60">
            {{ active?.description ?? "请选择左侧工具" }}
          </div>
        </header>

        <section class="mt-4 eb-glass rounded-2xl p-5 min-h-[calc(100%-120px)]">
          <RouterView />
        </section>
      </main>
    </div>
  </div>
</template>
