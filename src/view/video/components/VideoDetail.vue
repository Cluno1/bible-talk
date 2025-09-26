<template>
    <div class=" ">
        <!-- 版心 -->
        <div class="max-w-screen-xl mx-auto p6 grid grid-cols-12 gap-6">
            <!-- 左侧海报 -->
            <div class="col-span-3">
                <img :src="card.videoPic" alt="poster" class="rounded-xl shadow-lg w-full object-cover" />
            </div>

            <!-- 右侧信息 -->
            <div class="col-span-9 ">
                <!-- 标题 + 评分 -->
                <div class="flex items-center mb-4">
                    <h1 class="text-3xl font-bold mr-4">{{ card.title }}</h1>
                    <el-tag type="primary" size="large" class="px-4 py-1 !text-base">
                        评分 {{ card.score || '-' }}
                    </el-tag>
                </div>

                <!-- 标签行 -->
                <div class="flex items-center space-x-3 mb-4 text-sm">
                    <span class="text-gray-500">地区：</span>
                    <span>{{ card.meta?.region }}</span>
                    <span class="text-gray-500">年份：</span>
                    <span>{{ card.meta?.date }}</span>
                    <span class="text-gray-500">更新：</span>
                    <span>{{ card.meta?.update ?? card.remarks }}</span>
                </div>

                <!-- 导演 -->
                <div class="mb-2">
                    <span class="text-gray-500 text-sm mr-2">导演：</span>
                    <span class="line-clamp-2 sm:line-clamp-none">{{ card.meta?.director }}</span>
                </div>

                <!-- 主演 -->
                <div class="mb-4">
                    <span class="text-gray-500 text-sm mr-2">主演：</span>
                    <span class="line-clamp-2 sm:line-clamp-none">{{ (card.meta?.roles ?? []).join(' / ') }}</span>
                </div>

                <!-- 简介 -->
                <div>
                    <div class="text-gray-500 text-sm mb-2">简介：</div>
                    <p class="leading-6 text-sm indent-6 line-clamp-4 sm:line-clamp-none">
                        {{ card.meta?.introduction }}
                    </p>
                </div>
            </div>
        </div>


    </div>
</template>
<script setup lang="ts">

import type { NetflixVideoCardType } from '@/type/video';
interface Props {
    card: NetflixVideoCardType

}

defineProps<Props>()


</script>

<style scoped>
/* ElementPlus 滚动条隐藏纵向，保留横向 */
:deep(.el-scrollbar__bar.is-vertical) {
    display: none;
}
</style>