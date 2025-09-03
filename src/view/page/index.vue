<template>

  <div v-if="data && type == 'overview'">
    <OverView :data="data" />
  </div>

  <div v-else-if="data && type == 'article'">
    <Article :data="data" />
  </div>

  <div v-else-if="type == 'error'">
    <h1>404 NO FOUND</h1>
  </div>

</template>

<script lang="ts" setup>
import OverView from '@/components/OverView.vue';
import Article from '@/components/Article.vue';
import { useBibleTalkStore } from '@/store/bibleTalkStore';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import type { BibleTalkDataType } from '@/type/page';
const bibleTalkStore = useBibleTalkStore()
const nowRoute = useRoute()


const data = ref<BibleTalkDataType | null>(null)

/** 最终返回的三种可能值 */
type PageType = 'error' | 'overview' | 'article'

const type = ref<PageType>('overview')


watch(nowRoute, () => {
  type.value = initType()
})

function initType() {
  // 1. 把当前路径按 '/' 拆开
  const segs = nowRoute.fullPath.split('/').filter(Boolean) // filter 掉空串
  console.log(segs,'segs')
  if (!segs.length) return 'error'

  // 2. 拿到第一段作为 key，去 store 查数据
  
  const key = segs[0]//key是englishName
  let dataInStore=null
  for(let [,v] of bibleTalkStore.datastorage.entries()){
    if(v.englishName===key)
    dataInStore=v;
  }
  
  console.log(dataInStore,'dataInStore')
  if (!dataInStore) return 'error'

  // 3. 把数据同步到外部响应式变量 data（假设你外部定义了）
  data.value = dataInStore

  if (segs.length == 1) {
    return 'article'
  }


  // as  /al-overview/al-overview-ml-asics

  // 4. 根据最后一段判断是 overview 还是 article
  let last = segs[1]   // al-overview-ml-asics

  last = last.replace(segs[0] + '-', '') //去除al-overview

  console.log(last, 'last')
  if (last == 'overview') {
    return 'overview'
  } else {

    (data.value?.children || []).forEach((_i) => {
      console.log(_i, '_i')
      if (_i.englishName == last) {
        data.value = _i;
      }
    })
    return 'article'
  }
}

onMounted(() => {
  type.value = initType()
})


</script>

<style></style>