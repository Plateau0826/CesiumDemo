<template>
  <header>
  </header>

  <main>
    <cesiumTest />
  </main>
</template>
<script setup >
import { RouterView } from 'vue-router'
import cesiumTest from './components/cesiumTest.vue'
</script>
<style scoped>
/* 确保页面没有默认边距，让地图全屏 */
body {
  margin: 0;
  padding: 10px;
  overflow: hidden;
}
</style>
