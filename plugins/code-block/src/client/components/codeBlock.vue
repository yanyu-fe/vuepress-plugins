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
        <FileCopy
          class="code-block-action"
          v-if="!copied"
          @click="copy(codeSource)"
        />
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
    <transition name="code-block-transition" v-on="on">
      <section class="code-block-source" v-if="showCode">
        <div class="language-vue">
          <pre class="language-vue" v-html="highlight"></pre>
        </div>
      </section>
    </transition>
  </section>
</template>
<script setup lang="ts">
import FileSuccess from "./icons/FileSuccess.vue";
import CodeSandbox from "./icons/CodeSandbox.vue";
import Expand from "./icons/Expand.vue";
import UnExpand from "./icons/UnExpand.vue";
import FileCopy from "./icons/FileCopy.vue";
import { computed, reactive, ref } from "vue";
import { useClipboard } from "../composables/useClipboard";
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
const { copied, copy } = useClipboard();
const on = reactive({
  beforeEnter(el: any) {
    if (!el.dataset) el.dataset = {};
    el.dataset.oldPaddingTop = el.style.paddingTop;
    el.dataset.oldPaddingBottom = el.style.paddingBottom;

    el.style.maxHeight = 0;
    el.style.paddingTop = 0;
    el.style.paddingBottom = 0;
  },
  enter(el: any) {
    el.dataset.oldOverflow = el.style.overflow;
    if (el.scrollHeight !== 0) {
      el.style.maxHeight = `${el.scrollHeight}px`;
      el.style.paddingTop = el.dataset.oldPaddingTop;
      el.style.paddingBottom = el.dataset.oldPaddingBottom;
    } else {
      el.style.maxHeight = 0;
      el.style.paddingTop = el.dataset.oldPaddingTop;
      el.style.paddingBottom = el.dataset.oldPaddingBottom;
    }

    el.style.overflow = "hidden";
  },
  afterEnter(el: any) {
    el.style.maxHeight = "";
    el.style.overflow = el.dataset.oldOverflow;
  },

  beforeLeave(el: any) {
    if (!el.dataset) el.dataset = {};
    el.dataset.oldPaddingTop = el.style.paddingTop;
    el.dataset.oldPaddingBottom = el.style.paddingBottom;
    el.dataset.oldOverflow = el.style.overflow;

    el.style.maxHeight = `${el.scrollHeight}px`;
    el.style.overflow = "hidden";
  },

  leave(el: any) {
    if (el.scrollHeight !== 0) {
      el.style.maxHeight = 0;
      el.style.paddingTop = 0;
      el.style.paddingBottom = 0;
    }
  },

  afterLeave(el: any) {
    el.style.maxHeight = "";
    el.style.overflow = el.dataset.oldOverflow;
    el.style.paddingTop = el.dataset.oldPaddingTop;
    el.style.paddingBottom = el.dataset.oldPaddingBottom;
  },
});
</script>
