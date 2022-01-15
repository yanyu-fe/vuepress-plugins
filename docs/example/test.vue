<template>
  <div>我是测试模板{{ counter }}</div>
  <button @click="add">12112121</button>
</template>

<script setup lang="ts">
import { ref } from "vue";

const counter = ref(0);

const add = () => {
  counter.value++;
};
</script>
