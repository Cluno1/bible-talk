<template>
    <div class="h-screen flex flex-col items-center justify-center px-4 text-center">
       
        <div class="relative mb-6">
            <div class="w-32 h-32 md:w-40 md:h-40 rounded-full border-8 border-slate-300" />
            <div
                class="absolute top-0 right-0 w-12 h-12 md:w-14 md:h-14 bg-slate-50 rotate-45 translate-x-1/2 -translate-y-1/2" />
            <div
                class="absolute inset-0 flex items-center justify-center text-5xl md:text-6xl font-black text-slate-400">
                {{ code }}
            </div>
        </div>

        <!-- 文案 -->
        <h1 class="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
            哎呀，页面飞走了~
        </h1>
        <p class="text-slate-500 mb-6 max-w-xs md:max-w-sm">
            {{ msg }}
        </p>

        <!-- 按钮 -->
        <router-link to="/">
            <el-button type="primary">返回首页</el-button>
        </router-link>
    </div>
</template>

<script setup lang="ts">

import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const code = ref<string | number>(404)
const msg = ref<string>('你访问的地址不存在。点击回到首页')
const route = useRoute()
onMounted(() => {
    code.value = (route.query.code as unknown as number) || 404;
    msg.value = (route.query.msg as unknown as string) || '你访问的地址不存在。点击回到首页';

})

</script>
