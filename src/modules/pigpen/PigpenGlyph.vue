<script setup lang="ts">
import type { PigpenGridPos, PigpenXPos } from "./pigpen";

type Kind = "grid" | "x";

const props = defineProps<{
  kind: Kind;
  gridPos?: PigpenGridPos;
  xPos?: PigpenXPos;
  dotted?: boolean;
}>();

function gridLines(pos: PigpenGridPos) {
  const map: Record<PigpenGridPos, Array<"t" | "r" | "b" | "l">> = {
    tl: ["t", "l"],
    tm: ["t", "l", "r"],
    tr: ["t", "r"],
    ml: ["t", "b", "l"],
    mm: ["t", "r", "b", "l"],
    mr: ["t", "b", "r"],
    bl: ["b", "l"],
    bm: ["b", "l", "r"],
    br: ["b", "r"]
  };
  return map[pos];
}
</script>

<template>
  <svg viewBox="0 0 64 64" class="w-8 h-8">
    <g v-if="props.kind === 'grid' && props.gridPos" stroke="currentColor" stroke-width="5" stroke-linecap="round">
      <line v-if="gridLines(props.gridPos).includes('t')" x1="12" y1="14" x2="52" y2="14" />
      <line v-if="gridLines(props.gridPos).includes('r')" x1="52" y1="14" x2="52" y2="52" />
      <line v-if="gridLines(props.gridPos).includes('b')" x1="12" y1="52" x2="52" y2="52" />
      <line v-if="gridLines(props.gridPos).includes('l')" x1="12" y1="14" x2="12" y2="52" />
    </g>

    <g v-else-if="props.kind === 'x' && props.xPos" stroke="currentColor" stroke-width="5" stroke-linecap="round">
      <template v-if="props.xPos === 'top'">
        <line x1="16" y1="46" x2="32" y2="18" />
        <line x1="48" y1="46" x2="32" y2="18" />
      </template>
      <template v-else-if="props.xPos === 'right'">
        <line x1="18" y1="16" x2="46" y2="32" />
        <line x1="18" y1="48" x2="46" y2="32" />
      </template>
      <template v-else-if="props.xPos === 'bottom'">
        <line x1="16" y1="18" x2="32" y2="46" />
        <line x1="48" y1="18" x2="32" y2="46" />
      </template>
      <template v-else>
        <line x1="46" y1="16" x2="18" y2="32" />
        <line x1="46" y1="48" x2="18" y2="32" />
      </template>
    </g>

    <circle v-if="props.dotted" cx="32" cy="32" r="3.5" fill="currentColor" />
  </svg>
</template>

