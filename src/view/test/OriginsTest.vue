<!-- NetflixGrid.vue -->
<template>
    <div class="originSearch p-8 mb-7 h-screen overflow-scroll">
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
        <el-backtop target=".originSearch" :visibility-height="50" :right="24" :bottom="80">
            <el-icon>
                <Top />
            </el-icon>
        </el-backtop>

        <!-- 手机端 -->
        <div class="md:hidden mb-5 flex items-center justify-center">
            <el-button type="plain" size="large" @click="showPanel = true">
                <el-icon>
                    <Setting />
                </el-icon>
            </el-button>

            <GlobalSearch type="global" />
        </div>
        <!-- 卡片网格 -->
        <section class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[28px]">
            <el-card shadow="hover" class="relative w-40 sm:w-64 hover:scale-105" v-for="(card, idx) in cards"
                :key="idx" @mouseenter="hoverCard = card" @mouseleave="hoverCard = null" @click="handleClick(card)">
                <span class="absolute right-4 bottom-1 text-xl" :style="{ color: config.darkMainColor }">
                    {{ card.score }}
                </span>

                <div class="h-44 w-32 sm:h-80 sm:w-60 sm:pr-6">
                    <div class="relative h-44 sm:h-80">
                        <!-- 封面 -->
                        <img class="h-44 sm:h-80 max-w-60 w-full object-cover"
                            :src="card.videoPic || 'https://via.placeholder.com/200x280'" alt="" />

                        <div v-if="hoverCard === card" class="absolute max-h-80 max-w-60 inset-0 bg-black/50">
                            <div class="h-3/5 flex flex-col justify-between text-gray-300 p-3 rounded">
                                <div class="text-xs mb-1">
                                    <span>导演：</span>
                                    {{ card.meta?.director || "-" }}
                                </div>
                                <div class="text-xs mb-1 line-clamp-2">
                                    <span>主演：</span>
                                    {{ card.meta?.roles?.join(" / ") || "-" }}
                                </div>
                                <div class="text-xs mb-1">
                                    <span>更新时间：</span>
                                    {{ card.meta?.update || "-" }}
                                </div>
                                <div class="text-xs leading-snug line-clamp-4">
                                    <span>简介：</span>
                                    {{ card.meta?.introduction || "-" }}
                                </div>
                                <div class="text-xs leading-snug line-clamp-4">
                                    <span>href：</span>
                                    {{ card.href || '-' }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <template #footer>
                    <!-- 标题 + remark -->
                    <div class="mt-1 text-sm font-semibold truncate">
                        {{ card.title }}
                    </div>
                    <div class="mt-1 text-xs text-gray-500">
                        {{ card.remarks || "-" }}
                    </div>
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

        <!-- 设置面板 -->
        <Teleport to="body">
            <Transition name="slide">
                <div v-if="showPanel" class="fixed inset-0 z-50">
                    <!-- 遮罩 -->
                    <div class="absolute inset-0 bg-black/60" @click="showPanel = false" />
                    <!-- 面板 -->
                    <div class="absolute top-0 right-0 h-full w-80 md:w-80 border-l p-6 overflow-y-auto"
                        :style="{ backgroundColor: config.modeDark ? 'black' : 'white' }">
                        <div class="flex justify-between items-center mb-6">
                            <h3 class="text-xl font-bold gradient-text">设置</h3>
                            <el-button link @click="showPanel = false">
                                <el-icon size="20">
                                    <Close />
                                </el-icon>
                            </el-button>
                        </div>

                        <!-- 数据源 -->
                        <div class="p-3 rounded-lg shadow-inner mb-4">
                            <label
                                class="block text-sm font-medium text-gray-400 mb-3 border-b border-[#333] pb-1">数据源设置</label>
                            <div class="flex space-x-2 mb-3">
                                <el-button size="small" @click="selectAllAPIs(true)">全选</el-button>
                                <el-button size="small" @click="selectAllAPIs(false)">全不选</el-button>
                            </div>
                            <div class="max-h-2/3 overflow-y-auto p-2 rounded-lg mb-3">
                                <div v-for="api in apiList" :key="api.api" class="flex items-center mb-1">
                                    <el-checkbox v-model="api.selected" />
                                    <span :class="[
                                        'ml-2',
                                        'text-xs',
                                        api.selected ? '' : 'text-gray-500',
                                    ]">{{ api.name }}</span>
                                </div>
                            </div>
                            <div class="text-xs text-gray-500 flex justify-between">
                                <span>已选数据源数量：<span>{{ selectedApiCount }}</span></span>
                                <span id="siteStatus" />
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { YHDMExtract } from "@/utils/netfilxUtil";
import type { ResData } from "@/type/request";
import type {
    NetflixPaginationType,
    NetflixVideoCardType,
    SiteType,
} from "@/type/video";
import { onBeforeRouteUpdate, useRoute } from "vue-router";
import { useConfigStore } from "@/store/configStore";
import router from "@/router";
import { ElLoading, ElMessage } from "element-plus";
import { yhdmSearch } from "@/api/yhdm";
import GlobalSearch from "@/components/GlobalSearch.vue";
import { API_SITES } from "@/config/originApiSearch";
import { buildLibreTVUrl } from "@/api/film/libvio";
import { parseJson2Netflix } from "@/utils/film/originvideos";
import { usefilmStore } from "@/store/filmStore";

/* 响应式数据 */
const cards = ref<NetflixVideoCardType[]>([]);
const pagination = ref<NetflixPaginationType>({});
const hoverCard = ref<NetflixVideoCardType | null>(null);
const loading = ref<any>(null); //loading是 实例
const showPanel = ref(false);
let keyword = "";

//数据搜索源
const apiList = ref<SiteType[]>([]);
const selectedApiCount = ref(
    computed(() => {
        return apiList.value.filter((i) => i.selected).length;
    })
);

watch(selectedApiCount, () => {
    localStorage.setItem("originSetting", JSON.stringify(apiList.value));
});

/* 请求数据 */
const fetch = async (page = 1) => {
    if (keyword === "") {
        // router.push('/error')
        return;
    }
    setLoading(true);
    try {
        const searchApis = apiList.value.filter((i) => i.selected);
        if (
            selectedApiCount.value === 1 &&
            searchApis.find((i) => i.api == "https://www.yhdmtv.top")?.selected
        ) {
            console.log("come to default");
            //默认源  yhdm
            const res: ResData<string> = await yhdmSearch(keyword, page);
            const { cards: c, pagination: p } = YHDMExtract(res.data);
            cards.value = c;
            pagination.value = p;
            return;
        } else {
            console.log("come to simple all ");
            cards.value = [];
            pagination.value = { total: 1 };
            searchApis.forEach(async (i) => {
                if (i.api == "https://www.yhdmtv.top") {
                    console.log("come to yhdm");

                    //默认源  yhdm
                    const res: ResData<string> = await yhdmSearch(keyword, 1);
                    const { cards: c } = YHDMExtract(res.data);
                    cards.value.push(...c);
                } else {
                    console.log("come to buildLibreTVUrl");
                    try {
                        const res = await buildLibreTVUrl(i, "search", { query: keyword });
                        console.log("yes a= ", res?.data);
                        const { cards: c } = parseJson2Netflix(res?.data, i);
                        cards.value.push(...c);
                    } catch (err: any) {
                        console.log(i.name + " 源解析不了 ", err?.message || "");
                        ElMessage.info(i.name + "源暂时解析失败")
                    }
                }
            });
        }
    } catch (err) {
    } finally {
        setLoading(false);
    }
};

function init() {
    const _kw = route.query.kw;
    if (_kw) {
        keyword = _kw as string;
    }

    Object.keys(API_SITES).forEach((key) => {
        apiList.value.push({
            selected: false,
            ...API_SITES[key as keyof typeof API_SITES],
        });
    });

    const str = localStorage.getItem("originSetting"); //SiteType
    const originSetting: SiteType[] = str ? JSON.parse(str) : null; // 解析失败也返回 null
    if (originSetting) {
        originSetting.forEach((i) => {
            const a = apiList.value.find((j) => i.name === j.name && i.api === j.api);
            if (a) {
                a.selected = i.selected || false;
            } else {
                apiList.value?.push(i);
            }
        });
    }
}

/* 页码变化 */
const handlePageChange = (page: number) => fetch(page);

const route = useRoute();
const config = useConfigStore();
const filmStore = usefilmStore()

/* 路由参数变化时重新加载 */
onBeforeRouteUpdate(async (to, from, next) => {
    if (to.query.kw !== from.query.kw) {
        const _kw = to.query.kw;
        if (_kw) {
            keyword = _kw as string;
        }
        await fetch();
    }
    next();
});

onMounted(() => {
    init();
    fetch();
});

function selectAllAPIs(t: boolean) {
    apiList.value.forEach((i) => {
        i.selected = t;
    });
}

function handleClick(card: NetflixVideoCardType) {
    //存入store
    filmStore.filmCard = card;
    console.log(card, 'card')
    router.push({
        path: "/video",
        query: {
            href: card.href,
            direct: card?.episodes ? 1 : 0,
        },
    });
}

const setLoading = (option: boolean) => {
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
