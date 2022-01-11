<template>
  <div class="code-block">
    <div class="demo">
      <slot />
    </div>
    <div class="language-vue">
      <pre class="language-vue" v-html="highlight"></pre>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
const props = defineProps({
  title: {
    type: String,
    default: undefined,
  },
  desc: {
    type: String,
    default: undefined,
  },
  code: {
    type: String,
    default: undefined,
  },
  highlightCode: {
    type: String,
    default: undefined,
  },
});
const highlight = computed(() => decodeURIComponent(props.highlightCode || ""));
const codeSource = computed(() => decodeURIComponent(props.code || ""));
console.log(codeSource.value);
</script>
