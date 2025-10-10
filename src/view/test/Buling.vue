<!-- NetflixGrid.vue -->
<template>
    <div class="w-full lg:hidden flex flex-col items-center justify-center ">
        <!-- 手机端设置 -->
        <div class="z-30  mb-5 flex items-center justify-center ">

            <GlobalSearch type="global" />
        </div>
        <div v-if="showScrollTop" class="backTop fixed right-[24px] bottom-[24px] z-30 lg:hidden">
            <el-button @click="scrollToTop">
                <el-icon>
                    <Top />
                </el-icon>
            </el-button>
        </div>
    </div>
    <div class="originSearch p-8 mb-7 h-screen overflow-scroll" ref="originSearch">
        <!-- 设置按钮保留在右上角，并缩小尺寸 -->
        <el-affix :offset="120" z-index="30" class="hidden md:block">
            <div class="fixed right-[24px] top-[120px] z-30">
                <el-popover placement="right" :width="100">
                    <template #reference>
                        <el-button @click="showPanel = true">
                            <el-icon>
                                <Setting />
                            </el-icon>
                            <span class="ml-1">来源</span>
                        </el-button>
                    </template>

                    <span>{{ selectedApiCount }}</span>
                </el-popover>
            </div>
        </el-affix>
        <!-- 桌面端回到顶部按钮 -->
        <el-backtop target=".originSearch" :visibility-height="50" :right="24" :bottom="80" class="hidden md:block">
            <el-icon>
                <Top />
            </el-icon>
        </el-backtop>

        <!-- 卡片网格 – 极简平铺 -->
        <section class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <el-card shadow="hover" v-for="(card, idx) in cards" :key="idx" @click="handleClick(card)"
                class="cursor-pointer">
                <!-- 标题 + 备注 -->
                <template #header>
                    <div class="text-sm font-semibold break-words">{{ card.title }}</div>

                </template>

                <!-- 仅保留要求的 7 个字段 -->
                <div class="text-xs space-y-2 text-gray-700">
                    <div class="line-clamp-2">
                        <span class="text-gray-400">主演：</span>
                        {{ card.meta?.roles?.join(' / ') || '-' }}
                    </div>
                    <div class="line-clamp-4">
                        <span class="text-gray-400">简介：</span>
                        {{ card.meta?.introduction || '-' }}
                    </div>
                    <div class="line-clamp-4">
                        <span class="text-gray-400">来源：</span>
                        {{ card.originSite?.name || '-' }}
                    </div>
                </div>
            </el-card>
        </section>


        <!-- 无结果 -->
        <div v-if="!isLoading && cards.length === 0" class="text-center text-2xl text-gray-400 mt-10">
            {{ route.query.kw ? '搜索无结果~' : '支持搜索在线影视/动漫/综艺/电视剧' }}
        </div>

        <!-- 分页 -->
        <div class="flex justify-center mt-8">
            <el-pagination background layout="prev, pager, next" hide-on-single-page :current-page="pagination.now"
                :page-count="pagination.total" @current-change="handlePageChange" />
        </div>
        <div v-if="isLoading === false && cards.length < 1" class="text-2xl text-gray-400">
            {{ route.query.kw ? '搜索无结果~' : '支持搜索在线影视/动漫/综艺/电视剧' }}
        </div>


    </div>

</template>


<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";

import type {
    NetflixPaginationType,
    NetflixVideoCardType,
    SiteType,
} from "@/type/video";

import router from "@/router";
import { ElLoading } from "element-plus";

import GlobalSearch from "@/components/GlobalSearch.vue";
import { useRoute } from "vue-router";
import { getBuLing } from "@/api/film/buling";
import { parseBuling, parseM3u8Buling } from "@/utils/film/bulingUtls";
import { usefilmStore } from "@/store/filmStore";
import { yhdmRender } from "@/api/yhdm";
import type { ResData } from "@/type/request";


/* 响应式数据 */
const cards = ref<NetflixVideoCardType[]>([]);
const pagination = ref<NetflixPaginationType>({});

const loading = ref<any>(null); //loading是 实例
const isLoading = ref(false)
const showPanel = ref(false);

const filmStore = usefilmStore()
// 回到顶部相关状态
const showScrollTop = ref(false);
const originSearch = ref<HTMLElement>();



//数据搜索源
const apiList = ref<SiteType[]>([]);
const selectedApiCount = ref(
    computed(() => {
        return apiList.value.filter((i) => i.selected).length;
    })
);

// 自定义回到顶部函数
const scrollToTop = () => {
    if (originSearch.value) {
        originSearch.value.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
};

// 监听滚动事件，控制回到顶部按钮显示/隐藏
watch(originSearch, (newVal) => {
    if (newVal) {
        newVal.addEventListener('scroll', handleScroll);
    }
});
const handleScroll = () => {
    console.log(originSearch.value?.scrollTop);
    if (originSearch.value) {
        showScrollTop.value = originSearch.value.scrollTop > 300;
    }
};

watch(selectedApiCount, () => {
    localStorage.setItem("originSetting", JSON.stringify(apiList.value));
});



async function handleClick(card: NetflixVideoCardType) {
    console.log(card, 'card')
    filmStore.filmCard = card
    let url = ''
    try {
        if (card.originSite?.api) {
            const _a = await yhdmRender<ResData<string>>(card.originSite?.api + card.href)

            url = parseM3u8Buling(_a.data)
            console.log(url, 'url')

        }

    } catch (err) {

    }


    router.push({
        path: "/video",
        query: {
            href: card.href,
            videoUrl: url,
            direct:1,
        },
    });
}

async function handlePageChange(page: number) {
    const kw = route.query.kw;
    setLoading(true)
    try {
        if (typeof kw === 'string' && kw !== '') {
            const re = await getBuLing(kw, page)
            if (re.code === 200) {

                const buling = await parseBuling(re.data, {
                    api: 'https://d3gbed2ley04jq.sgatwbd.cc',
                    name: 'cc',
                    selected: true
                })
                cards.value = buling.cards
                pagination.value = buling.pagination

            }
        }

    } catch (err) {
        console.log(err, 'err')
    } finally {
        setLoading(false)
    }
}

const setLoading = (option: boolean) => {
    isLoading.value = option
    if (option) {
        loading.value = ElLoading.service({
            lock: true,
            text: "Loading",
            background: "rgba(0, 0, 0, 0.7)",
        });
    } else {
        loading.value.close();
    }
};

const route = useRoute()
onMounted(async () => {
    const kw = route.query.kw;
    const page = typeof route.query.page === 'number' ? Number(route.query.page) || 1 : 1;
    setLoading(true)
    try {
        if (typeof kw === 'string' && kw !== '') {
            const re = await getBuLing(kw, page)
            if (re.code === 200) {

                const buling = await parseBuling(re.data, {
                    api: 'https://d3gbed2ley04jq.sgatwbd.cc',
                    name: 'cc',
                    selected: true
                })
                cards.value = buling.cards
                pagination.value = buling.pagination

            }
        }

    } catch (err) {
        console.log(err, 'err')
    } finally {
        setLoading(false)
    }
})
</script>

<style scoped>
/* 滚动条整体 */
.originSearch::-webkit-scrollbar {
    width: 4px;
    /* 纵向滚动条宽度 */
    height: 4px;
    /* 横向滚动条高度 */
}

/* 滑块 */
.originSearch::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3);
    /* 30% 透明黑色 */
    border-radius: 2px;
}

/* 轨道 */
.originSearch::-webkit-scrollbar-track {
    background: transparent;
}
</style>
