<template>
  <div class="anchor-link-item" :key="item.title">
    <a
      class="anchor-link-href"
      @click.stop.prevent="updateLink(item)"
      :class="itemClass"
      :href="'#' + item.slug"
      >{{ item.title }}</a
    >
    <template v-if="item.children && item.children.length > 0">
      <AnchorLink
        v-for="itemInfo in item.children"
        :key="itemInfo.title"
        :item="itemInfo"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { PageHeader } from "@vuepress/shared";
import { computed, inject, onMounted, toRefs, watch } from "vue";
const props = defineProps<{
  item: PageHeader;
}>();
const {
  updateTop,
  setActiveData,
  activeData,
  registerLink,
  unregisterLink,
  setAnimating,
} = inject<any>("AnchorLinkTextActive");

const { item } = toRefs(props);
const updateLink = (itemData: PageHeader) => {
  setActiveData(itemData.slug);
  setTimeout(() => {
    setAnimating(false);
    updateTop(itemData.slug);
  });
};
watch(
  () => item.value.slug,
  (val, oldVal) => {
    unregisterLink(oldVal);
    registerLink(val);
  }
);
onMounted(() => {
  registerLink(item.value.slug);
});
// 监听当前是否达到当前的高度
const activeLink = computed(() => activeData.value === item.value.slug);
const itemClass = computed(() => {
  return {
    "anchor-link-text-active": activeLink.value,
  };
});
</script>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "AnchorLink",
});
</script>
