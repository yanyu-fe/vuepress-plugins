<template>
  <div class="theme-anchor">
    <!--    定义当前的anchor-->
    {{ MyVNodes }}
  </div>
</template>

<script setup lang="ts">
import { usePageData } from "@vuepress/client";
import AnchorLink from "@theme/AnchorLink.vue";
import { h } from "vue";
// import { useScroll } from "@vueuse/core";

const data = usePageData();
const headers = data.value.headers;
const fun = (headers: any[]): any[] => {
  const VNodes = [];
  for (const header of headers) {
    let children = [];
    if (header.children && header.children.length > 0) {
      children = fun(header.children);
    }
    VNodes.push(h(AnchorLink, { title: header.title }, children));
  }
  return VNodes;
};
const MyVNodes = fun(headers);
console.log(MyVNodes);
</script>
