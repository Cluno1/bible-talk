<template>
    <div class="p-4">
        <!-- 歌曲网格 -->
        <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <el-card v-for="song in songs" :key="song.id" shadow="hover" class="cursor-pointer" @click="handleRoute(song)">
                <!-- 封面 -->
                <div class="aspect-square">
                    <el-image :src="(song.pic && song.pic[0]) || albumPic || 'https://bible-1328751369.cos.ap-guangzhou.myqcloud.com/pic/music%20play.png'" fit="cover"
                        class="w-full h-full rounded" />
                </div>
                <!-- 标题 -->
                <div class="mt-2">
                    <p class="text-sm">
                        {{ song.songTitle || song.songEnglishTitle || '未知' }}
                    </p>
                    <p class="text-sm text-gray-500 truncate">
                        {{ song.artistName || '演奏者' }}
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
const route = useRoute()
const store = useAlbumConfigStore()
const songs = ref<MusicType[]>([])
const id = route.query.id as string
const audio= useAudioConfigStore()
const albumPic=ref('')
const router=useRouter()
const handleRoute=(song:MusicType)=>{
    audio.setCurrentAudio(song)
    audio.addAudioList(song)
    router.push('/audio-play')
}

onMounted(() => {

    if (id) {
        let a = store.albums.get(id)
        if (a) {

            if(a.pic&&(a.pic||[]).length>0)
            albumPic.value=a.pic[0]
            songs.value = [...a.musics]// 触发加载
            
        }

    }
})


</script>