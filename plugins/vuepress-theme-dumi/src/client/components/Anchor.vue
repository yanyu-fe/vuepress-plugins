<template>
  <div class="theme-anchor"></div>
</template>

<script setup lang="ts">
import { usePageData } from "@vuepress/client";

const data = usePageData();
console.log(data.value);
</script>

<style scoped></style>
