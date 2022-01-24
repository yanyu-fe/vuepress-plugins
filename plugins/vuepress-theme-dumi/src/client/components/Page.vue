<script setup lang="ts">
import PageMeta from "@theme/PageMeta.vue";
import PageNav from "@theme/PageNav.vue";
import Anchor from "@theme/Anchor.vue";
</script>

<template>
  <main class="page">
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
