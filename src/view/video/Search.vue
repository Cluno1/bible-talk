<!-- NetflixGrid.vue -->
<template>
    <div class="p-8  min-h-screen mb-7">
        <!-- 手机端 -->
        <div class=" md:hidden mb-5">
            <GlobalSearch type="global" />
        </div>
        <!-- 卡片网格 -->
        <section class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[28px]">
            <el-card shadow="hover" class="relative w-40 sm:w-64 hover:scale-105" v-for="(card, idx) in cards"
                :key="idx" @mouseenter="hoverCard = card" @mouseleave="hoverCard = null" @click="handleClick(card)">

                <span class="absolute right-4 bottom-1 text-xl  " :style="{ color: config.darkMainColor }">
                    {{ card.score }}
                </span>

                <div class="h-44 w-32  sm:h-80 sm:w-60 sm:pr-6">
                    <div class="relative h-44 sm:h-80">
                        <!-- 封面 -->
                        <img class="h-44 sm:h-80 max-w-60 w-full object-cover "
                            :src="card.videoPic || 'https://via.placeholder.com/200x280'" alt="" />

                        <div v-if="hoverCard === card" class="absolute max-h-80 max-w-60  inset-0 bg-black/50 ">
                            <div class="h-3/5 flex flex-col justify-between text-gray-300 p-3 rounded">
                                <div class="text-xs mb-1">
                                    <span>导演：</span>
                                    {{ card.meta?.director || '-' }}
                                </div>
                                <div class="text-xs mb-1 line-clamp-2">
                                    <span>主演：</span>
                                    {{ card.meta?.roles?.join(' / ') || '-' }}
                                </div>
                                <div class="text-xs mb-1">
                                    <span>更新时间：</span>
                                    {{ card.meta?.update || '-' }}
                                </div>
                                <div class="text-xs leading-snug line-clamp-4">
                                    <span>简介：</span>
                                    {{ card.meta?.introduction || '-' }}
                                </div>
                                <!-- <div class="text-xs leading-snug line-clamp-4">
                                    <span>href：</span>
                                    {{ card.href || '-' }}
                                </div> -->
                            </div>
                        </div>
                    </div>
                </div>

                <template #footer>
                    <!-- 标题 + remark -->
                    <div class="mt-1 text-sm font-semibold truncate">
                        {{ card.title }}
                    </div>
                    <div class="mt-1 text-xs text-gray-500">{{ card.remarks || '-' }}</div>
                </template>

            </el-card>
        </section>

        <!-- 分页 -->
        <div class="flex justify-center mt-8">
            <el-pagination background layout="prev, pager, next" hide-on-single-page :current-page="pagination.now"
                :page-count="pagination.total" @current-change="handlePageChange" />
        </div>
        <div v-if="loading === false && cards.length < 1" class="text-2xl text-gray-400">
            搜索无结果~
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { YHDMExtract } from '@/utils/netfilxUtil'
import type { ResData } from '@/type/request'
import type { NetflixPaginationType, NetflixVideoCardType } from '@/type/video'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import { useConfigStore } from '@/store/configStore'
import router from '@/router'
import { ElLoading } from 'element-plus'
import { yhdmSearch } from '@/api/yhdm'
import GlobalSearch from '@/components/GlobalSearch.vue'


/* 响应式数据 */
const cards = ref<NetflixVideoCardType[]>([])
const pagination = ref<NetflixPaginationType>({})
const hoverCard = ref<NetflixVideoCardType | null>(null)
const loading = ref<any>(null)//loading是 实例

let keyword = ''

/* 请求数据 */
const fetch = async (page = 1) => {
    if (keyword === '') {
        router.push('/error')
        return;
    }
    setLoading(true)
    try {
        // const res: ResData<string> = await netflixSearch(keyword, page)
        const res: ResData<string> = await yhdmSearch(keyword, page)
        const { cards: c, pagination: p } = YHDMExtract(res.data)
        cards.value = c
        pagination.value = p
    } catch (err) {

    } finally {
        setLoading(false)
    }
}

/* 页码变化 */
const handlePageChange = (page: number) => fetch(page)


const route = useRoute()
const config = useConfigStore()

/* 路由参数变化时重新加载 */
onBeforeRouteUpdate(async (to, from, next) => {
    if (to.query.kw !== from.query.kw) {
        const _kw = to.query.kw
        if (_kw) {
            keyword = _kw as string
        }
        await fetch()
    }
    next()
})

onMounted(() => {
    const _kw = route.query.kw
    if (_kw) {
        keyword = _kw as string
    }
    fetch()
})

function handleClick(card: NetflixVideoCardType) {
    router.push({
        path: '/video',
        query: {
            href: card.href
        }
    })
}

const setLoading = (option: boolean) => {
    if (option) {
        loading.value = ElLoading.service({
            lock: true,
            text: 'Loading',
            background: 'rgba(0, 0, 0, 0.7)',
        })
    } else {
        loading.value.close()
    }

}
</script>

<style scoped></style>