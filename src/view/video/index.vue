<template>
    <!-- PC -->
    <div class="hidden lg:block p-2">
        <div class="flex items-center gap-6 justify-between">
            <Player :data="data" class="video-pc" />
            <div class="flex flex-col text-pc justify-center items-center">
                <span class="font-bold text-2xl" :style="{ color: config.mainColor }">
                    {{ data?.title }}
                </span>
                <span class="font-bold mt-2">ID: '{{ data?.id }}'</span>
                <span v-if="data.describe" class="p-4 mt-4"
                    :style="{ backgroundColor: config.lightMainColor, borderRadius: '15px' }">
                    {{ data?.describe }}
                </span>
            </div>
        </div>
    </div>

    <!-- 手机 -->
    <div class="lg:hidden pt-5 pb-5">
        <div class="flex flex-col items-center gap-6 justify-center">
            <Player :data="data" />
            <div class="flex flex-col justify-center items-center">
                <span class="font-bold text-2xl" :style="{ color: config.mainColor }">
                    {{ data?.title }}
                </span>
                <span class="font-bold mt-2">ID: '{{ data?.id }}'</span>
                <span class="p-4 mt-4" :style="{ backgroundColor: config.lightMainColor, borderRadius: '15px' }">
                    {{ data?.describe }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Player from '@/components/player/Player.vue'
import { useConfigStore } from '@/store/configStore'
import { useVideoStore } from '@/store/videoStore'
import type { VideoType } from '@/type/video'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const video = useVideoStore()
const config = useConfigStore()
const route = useRoute()

const data = ref<VideoType>({
    id: '',
    videoUrl: ''
})

watch(video.videoData, init)

function init() {
    const id = String(route.query.id)
    if (id) {
        const found = video.videoData.find(v => v.id === id)
        if (found) data.value = found
        else data.value = {
            id: '未知',
            title: '没有视频',
            videoUrl: ''
        }
    }
}

onMounted(() => {
    // 路由查询参数 ?id=xxx
    init()
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