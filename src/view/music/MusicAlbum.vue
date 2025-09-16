<template>
    <div class="p-4">
        <h1 class="m-4">音频文件</h1>
        <el-button @click="handleRoute(songs)">全部播放</el-button>
        <!-- 歌曲网格 -->
        <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
            <el-card v-for="song in songs" :key="song.id" shadow="hover" class="cursor-pointer"
                @click="handleRoute(song)">
                <!-- 封面 -->
                <div class="aspect-square">
                    <el-image
                        :src="(song.pic && song.pic[0]) || albumPic || 'https://bible-1328751369.cos.ap-guangzhou.myqcloud.com/pic/music%20play.png'"
                        fit="cover" class="w-full h-full rounded" />
                </div>
                <!-- 标题 -->
                <div class="mt-2">
                    <p class="text-sm">
                        {{ song.songTitle || song.songEnglishTitle || '未知' }}
                    </p>
                    <p class="text-sm text-gray-500 truncate">
                        {{ song.artistName || '演奏者' }}
                    </p>
                    <p class="text-sm text-gray-500 truncate">
                        {{ 'ID ' + song.id }}
                    </p>
                </div>
            </el-card>
        </div>

        <h1 class="m-4">视频文件</h1>
        <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
            <el-card v-for="video in videos" :key="video.id" shadow="hover" class="cursor-pointer"
                @click="handleRouteVID(video)">
                <!-- 封面 -->
                <div class="aspect-square">
                    <el-image
                        :src="video.videoAlbumUrl || albumPic || 'https://bible-1328751369.cos.ap-guangzhou.myqcloud.com/pic/music%20play.png'"
                        fit="cover" class="w-full h-full rounded" />
                </div>
                <!-- 标题 -->
                <div class="mt-2">
                    <p class="text-sm">
                        {{ video.title || '未知标题' }}
                    </p>
                    <p class="text-sm text-gray-500 truncate">
                        {{ 'ID ' + video.id }}
                    </p>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useAlbumConfigStore } from '@/store/albumStore'
import type { MusicType } from '@/type/music'
import { useAudioConfigStore } from '@/store/audioStore'
import type { VideoType } from '@/type/video'
const route = useRoute()
const store = useAlbumConfigStore()
const songs = ref<MusicType[]>([])
const videos = ref<VideoType[]>([])
const id = route.query.id as string
const audio = useAudioConfigStore()
const albumPic = ref('')
const router = useRouter()
const handleRoute = (song: MusicType | MusicType[]) => {
    if (Array.isArray(song) && song.length > 0) {
        audio.addAudioList(song)
        audio.setCurrentAudio(song[0])

    } else {

        audio.setCurrentAudio(song)
        audio.addAudioList(song)
    }

    router.push('/audio-play')
}

const handleRouteVID = (video: VideoType) => {
    router.push({
        path: '/video',
        query: {
            id: video.id,
        }
    })
}

onMounted(() => {

    if (id) {
        let a = store.albums.get(id)
        console.log(a, 'a album')
        if (a) {

            if (a.pic && (a.pic || []).length > 0)
                albumPic.value = a.pic[0]
            songs.value = [...a.musics]// 触发加载
            videos.value = a.videos || []

        }

    }
})


</script>