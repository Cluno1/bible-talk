<template>
    <div class="pb-12">
        <!-- 详情页面 没有播放器 -->
        <VideoDetail :card="detailData.card" v-if="!data.videoUrl" />
        <!-- 播放器区域 -->
        <div v-if="data.videoUrl" class="w-full">
            <!-- 视频 -->
            <div class="w-full max-w-3xl">
                <PlayerHls v-if="isM3u8" :data="data" class="w-full" :key="data.videoUrl" />
                <Player v-if="!isM3u8" :data="data" class="w-full" :key="data.videoUrl" />
            </div>
            <!-- 详情 -->
            <div class="w-full px-4 py-6 flex flex-col items-center gap-4 text-center">
                <h1 class="font-bold text-2xl" :style="{ color: config.mainColor }">
                    {{ data.title }}
                </h1>
                <p v-if="data.id" class="font-bold">ID: '{{ data.id }}'</p>
                <p v-if="data.describe" class="p-4 rounded-lg max-w-3xl"
                    :style="{ backgroundColor: config.lightMainColor }">
                    {{ data.describe }}
                </p>
            </div>
        </div>
        <!-- 选集区域 -->
        <div class="max-w-screen-xl mx-auto mt-8 p-6 rounded-xl shadow" v-if="detailData.episode">
            <!-- 上：线路 -->
            <div class="mb-4">
                <div class="text-lg font-semibold mb-3">线路切换</div>
                <!-- 横向自动换行 -->
                <div class="flex flex-wrap gap-2">
                    <div v-for="(line, idx) in detailData.episode.playerOrigin" :key="idx" @click="activeLine = idx"
                        :class="[
                            'cursor-pointer px-4 py-2 rounded transition',
                            activeLine === idx
                                ? ' text-white'
                                : ' hover:bg-gray-500',
                        ]" :style="{ backgroundColor: activeLine === idx ? config.mainColor : '' }">
                        {{ line }}
                    </div>
                </div>
            </div>
            <!-- 下：剧集 -->
            <div>
                <div class="flex items-center justify-between mb-4">
                    <div class="text-lg font-semibold">
                        共 {{ detailData.episode.playerOriginEpisodeNum[activeLine] }} 集
                    </div>
                    <el-button size="small" :icon="Sort" @click="reverseEp" circle />
                </div>


                <!-- 网格自然换行 -->
                <div class="grid gap-3" :class="`grid-cols-[repeat(auto-fill,minmax(80px,1fr))]`">

                    <button v-for="(ep) in currentEpisodeList" :key="ep.href"
                        @click="handleClickHref('/video?href=' + ep.href)"
                        :style="(ep.href === nowHref) ? { color: 'white', backgroundColor: config.mainColor, borderColor: 'transparent' } : {}"
                        class="h-10 flex items-center justify-center rounded border hover:border-blue-500 hover:text-blue-500 hover:bg-transparent transition">
                        {{ ep.title }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Player from '@/components/player/Player.vue'
import { useConfigStore } from '@/store/configStore'
import { useVideoStore } from '@/store/videoStore'
import { Sort } from '@element-plus/icons-vue'
import type { VideoType } from '@/type/video'
import { computed, onMounted, reactive, ref } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import type { NetflixVideoCardType, netflixVideoEpisodeType } from '@/type/video';
import VideoDetail from './components/VideoDetail.vue'
import { yhdmHref } from '@/api/yhdm'
import { yhdmDetailExtract } from '@/utils/netfilxUtil'
import router from '@/router'
import PlayerHls from '@/components/player/PlayerHls.vue'
import { ElLoading, ElMessage } from 'element-plus'

const video = useVideoStore()
const config = useConfigStore()
const route = useRoute()

const loading = ref()

// 正确：同步计算
const isM3u8 = computed(() => data.value.videoUrl.endsWith('.m3u8'))

const data = ref<VideoType>({
    id: '',
    title: '未知标题',
    videoUrl: ''
})

const detailData = reactive<{
    card: NetflixVideoCardType,
    episode: netflixVideoEpisodeType | undefined
}>({
    card: {
        title: '未知',
        href: ''
    },
    episode: undefined
})

//选集相关
const activeLine = ref(0)
const reversed = ref(false)
/* 把 episode 列表变成计算属性，支持排序 + 联动线路 */
const currentEpisodeList = computed(() => {
    const base = detailData.episode?.playerOriginEpisodeList[activeLine.value] || []
    return reversed.value ? [...base].reverse() : base
})


function reverseEp() {
    reversed.value = !reversed.value
}

function handleClickHref(r: string) {
    router.push(r)
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

let isRunning = false
const nowHref = ref('')
async function init(href: string, id: string) {
    if (isRunning) return
    isRunning = true

    if (id && id != '' && id !== undefined) {
        data.value.id = String(id);
        const found = video.videoData.find(v => v.id === id)
        if (found) data.value = found
        else {
            const _a = video.searchVideoClound(String(id))
            if (_a) {
                data.value = _a;
            } else {
                data.value = {
                    id: '未知',
                    title: '没有视频',
                    videoUrl: ''
                }
            }
        }
    } else if (href) {
        console.log('开始解析 href 里面的html的 视频')
        setLoading(true)
        try {
            nowHref.value = href
            const res = await yhdmHref(href as string)
            const ex = yhdmDetailExtract(res.data, href)
            if (ex.card) {
                detailData.card = ex.card
                /* 新增：同步到 data，供模板展示 */
                data.value.title = ex.card.title || '未知标题'
                data.value.describe = ex.card.meta?.introduction || ''
            }
            if (ex.episode) {
                detailData.episode = ex.episode
            }
            if (ex.m3u8) {
                data.value.videoUrl = ex.m3u8
                ElMessage.info('解析成功')
            }
        } finally {
            //  延迟重置，防止并发
            setTimeout(() => {
                isRunning = false
            }, 500)
            setLoading(false)
        }
    }
}


/* 路由参数变化时重新加载 */
onBeforeRouteUpdate(async (to, from, next) => {

    if (to.query.href !== from.query.href || to.query.id !== from.query.id) {
        console.log('onBeforeRouteUpdate init')
        await init(to.query.href as string, to.query.id as string)
    }
    next()

})

onMounted(async () => {
    console.log('onMouted init')
    await init(route.query.href as string, route.query.id as string)
})
</script>

<style scoped>
.video-pc {
    width: 50vw;
}

.text-pc {
    width: 30vw;
}
</style>