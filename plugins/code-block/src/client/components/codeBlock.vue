<template>
  <section class="code-block" :id="id">
    <section class="code-block-demo">
      <slot />
    </section>
    <section class="code-block-meta">
      <div class="code-block-title" v-if="title">{{ title }}</div>
      <div class="code-block-description" v-if="desc" v-html="descData"></div>
      <div class="code-block-actions">
        <CodeSandbox class="code-block-action" @click="openCodeSandbox" />
        <FileCopy class="code-block-action" v-if="!copied" @click="copy" />
        <FileSuccess class="code-block-action-success" v-else />
        <Expand
          class="code-block-action-code"
          v-show="!showCode"
          @click="onShowCode"
        />
        <UnExpand
          class="code-block-action-code"
          v-show="showCode"
          @click="onShowCode"
        />
      </div>
    </section>
    <section class="code-block-source">
      <div class="language-vue" v-show="showCode">
        <pre class="language-vue" v-html="highlight"></pre>
      </div>
    </section>
  </section>
</template>
<script setup lang="ts">
import FileSuccess from "./icons/FileSuccess.vue";
import CodeSandbox from "./icons/CodeSandbox.vue";
import Expand from "./icons/Expand.vue";
import UnExpand from "./icons/UnExpand.vue";
import FileCopy from "./icons/FileCopy.vue";
import { computed, ref } from "vue";
import Clipboard from "clipboard-copy";
const props = defineProps({
  id: {
    type: String,
    default: undefined,
  },
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
  sandboxCode: {
    type: String,
  },
});
const highlight = computed(() => decodeURIComponent(props.highlightCode || ""));
const codeSource = computed(() => decodeURIComponent(props.code || ""));
const sandboxCode = computed(
  () => props.sandboxCode || "https://codesandbox.io/"
);
const descData = computed(() => decodeURIComponent(props.desc || ""));
const showCode = ref(false);
const openCodeSandbox = () => {
  window.open(sandboxCode.value);
};
const onShowCode = () => {
  showCode.value = !showCode.value;
};
const copied = ref(false);
const copy = () => {
  try {
    Clipboard(codeSource.value);
    copied.value = true;
    const timer = setTimeout(() => {
      copied.value = false;
      clearTimeout(timer);
    }, 3000);
  } catch (e) {
    // 复制失败
  }
};
</script>
