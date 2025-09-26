<template>
  <h1>樱花动漫解析测试</h1>

  <section>
    <h2>1. detail.html 解析结果</h2>
    <pre>{{ detailRes }}</pre>
  </section>

  <section>
    <h2>2. yhdm.html 解析结果</h2>
    <pre>{{ yhdmRes }}</pre>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { yhdmDetailExtract } from '@/utils/netfilxUtil'

/* 注意：vite 把静态资源当 URL 返回 */
import detailHtml from '@/test/yhdm/detail.html?raw'
import yhdmHtml from '@/test/yhdm/yhdm.html?raw'

const detailRes = ref(yhdmDetailExtract(detailHtml, '/v/850506/153'))
const yhdmRes = ref(yhdmDetailExtract(yhdmHtml, '/p/850506/153/12224580'))
</script>

<style scoped>
pre {
  background: #f5f5f5;
  padding: 1rem;
  overflow: auto;
  font-size: 14px;
}

section {
  margin-bottom: 2rem;
}
</style>