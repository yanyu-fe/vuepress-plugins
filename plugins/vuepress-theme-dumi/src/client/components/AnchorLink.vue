<template>
  <div
    class="anchor-link-item"
    v-for="header in headers"
    :key="header.title"
    :class="{ 'anchor-link-title-active': header.slug === activeLink }"
  >
    <a class="anchor-link-href" :href="'#' + header.slug">{{ header.title }}</a>
    <template v-if="header.children && header.children.length > 0">
      <AnchorLink :headers="header.children" />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { PageHeader } from "@vuepress/shared";
import { ref } from "vue";
defineProps<{
  headers: PageHeader[];
}>();
const activeLink = ref();
</script>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "AnchorLink",
});
</script>
