<template>
  <div>
    {{ title }}
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  active?: boolean;
}>();
</script>
