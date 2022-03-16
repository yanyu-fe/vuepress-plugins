<template>
  <div class="anchor-scroll" ref="anchorRef">
    <div class="theme-anchor">
      <div class="anchor-ink">
        <span
          :class="{ 'anchor-link-active': activeLink }"
          :style="{ top: top + 'px' }"
        ></span>
      </div>
      <AnchorLinks :headers="headers" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePageData } from "@vuepress/client";
import AnchorLinks from "@theme/AnchorLinks.vue";
import { computed, onMounted, provide, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useEventListener } from "@vueuse/core";
const data = usePageData();
const anchorRef = ref();
const top = ref(0);
const activeLink = ref(false);
const route = useRoute();
const router = useRouter();
const activeData = ref();
const setActiveData = (title: string) => {
  activeData.value = title;
};

const queue = ref<string[]>([]);
const registerLink = (item: string) => {
  if (!queue.value.includes(item)) queue.value.push(item);
};

const unregisterLink = (item: string) => {
  // 判断是否注册
  const index = queue.value.indexOf(item);
  if (index !== -1) {
    // 删除
    queue.value.slice(index, 1);
  }
};
const animating = ref(false);
const setAnimating = () => {
  animating.value = false;
};
const updateTop = (hash?: string, isAuto = false) => {
  if (!hash) return (activeLink.value = false);
  activeLink.value = true;
  const scroll: any = document.querySelector(hash ? "#" + hash : route.hash);
  const linkNode = anchorRef.value.getElementsByClassName(
    "anchor-link-text-active"
  )[0];
  if (!animating.value) {
    top.value = (linkNode && linkNode.offsetTop - 2) || 0;
  }
  animating.value = true;
  const running = () => {
    const top1 = window.scrollY || (window as any).scrollTop;
    if (
      top1 === scroll.offsetTop ||
      top1 + document.documentElement.clientHeight ===
        document.documentElement.offsetHeight
    ) {
      animating.value = false;
      window.removeEventListener("scroll", running);
    }
    if (top1 - scroll.offsetTop === 0 && hash && !isAuto) {
      router.push(route.path + "#" + hash);
    }
  };
  if (scroll) {
    window.addEventListener("scroll", running, false);
    if (!isAuto) {
      window.scrollTo({
        top: scroll.offsetTop || 0,
        behavior: "smooth",
      });
    } else {
      animating.value = false;
    }
  } else {
    animating.value = false;
  }
};

function getOffsetTop(element: HTMLElement, container: any): number {
  if (!element.getClientRects().length) {
    return 0;
  }

  const rect = element.getBoundingClientRect();

  if (rect.width || rect.height) {
    if (container === window) {
      container = element.ownerDocument!.documentElement!;
      return rect.top - container.clientTop;
    }
    return rect.top - (container as HTMLElement).getBoundingClientRect().top;
  }

  return rect.top;
}

const getCurrentTop = () => {
  const linkSections: any[] = [];
  queue.value.forEach((item) => {
    const target = document.getElementById(item);
    if (target) {
      const top = getOffsetTop(target, window);
      if (top < 20) {
        linkSections.push({
          link: item,
          top,
        });
      }
    }
  });
  if (linkSections.length) {
    const maxSection = linkSections.reduce((prev, curr) =>
      curr.top > prev.top ? curr : prev
    );
    return maxSection.link;
  }
  return "";
};

const handleScroll = () => {
  // 当前处于滚动状态
  const currentLink = getCurrentTop();
  if (currentLink === activeData.value) return;
  if (animating.value) return;
  // 当前停止了滚动，获取当前的高度，并开始赋值
  if (!currentLink) {
    setActiveData("");
    activeLink.value = false;
    return;
  }
  // 设置选中
  setActiveData(currentLink);
  setTimeout(() => {
    // 更新数据
    updateTop(currentLink, true);
  }, 10);
};

useEventListener("scroll", handleScroll);
provide("AnchorLinkTextActive", {
  updateTop,
  activeData,
  setActiveData,
  registerLink,
  unregisterLink,
  setAnimating,
});
onMounted(() => {
  setActiveData(route.hash.slice(1));
  setTimeout(() => {
    updateTop(route.hash.slice(1));
  });
});

const headers = computed(() => data.value.headers);
</script>
