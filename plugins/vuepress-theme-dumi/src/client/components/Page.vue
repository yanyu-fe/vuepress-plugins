<script setup lang="ts">
import PageMeta from "@theme/PageMeta.vue";
import PageNav from "@theme/PageNav.vue";
import Anchor from "@theme/Anchor.vue";
import { usePageData } from "@vuepress/client";
const headers = usePageData().value.headers;
</script>

<template>
  <main class="page" :class="{ 'page-clear-anchor': headers.length < 1 }">
    <slot name="top" />

    <div class="theme-default-content">
      <Content />
    </div>

    <Anchor />

    <PageMeta />

    <PageNav />

    <slot name="bottom" />
  </main>
</template>
