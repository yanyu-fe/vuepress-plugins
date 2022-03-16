<template>
  <AnchorLink v-for="item in headers" :key="item.slug" :item="item" />
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import type { PageHeader } from "@vuepress/shared";
import AnchorLink from "@theme/AnchorLink.vue";

export default defineComponent({
  name: "AnchorLinks",
  components: {
    AnchorLink,
  },
  props: {
    headers: {
      type: Array as PropType<PageHeader[]>,
      default: () => [],
    },
  },
  setup() {
    return {};
  },
});
</script>
