<template>
  <div class="anchor-scroll">
    <div class="theme-anchor">
      <div class="anchor-ink">
        <span class="anchor-link-active"></span>
      </div>
      <!--    定义当前的anchor-->
      <AnchorLink :headers="headers" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePageData } from "@vuepress/client";
import AnchorLink from "@theme/AnchorLink.vue";
import { computed } from "vue";
const data = usePageData();
const headers = computed(() => data.value.headers);
console.log(headers);
</script>
