<template>
    <div>
        <div class="lg:hidden mb-10 flex gap-0.5">
            <FullScreen />
            <GlobalSearch type="global" />
        </div>
        

        <!-- 专辑列表 -->
        <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <el-card v-for="album in albumList" :key="album.id" shadow="hover" class="cursor-pointer" @click="hanAlbumRouter(album)">
                <!-- 封面 -->
                <div class="aspect-square">
                    <el-image :src="(album.pic && album.pic[0]) || '/placeholder.png'" fit="cover"
                        class="w-full h-full rounded" />
                </div>

                <!-- 标题 -->
                <div class="mt-2">
                    <p class="text-base font-semibold truncate">
                        {{ album.albumTitle || album.albumEnglishTitle }}
                    </p>
                    <p class="text-sm text-gray-500 truncate">
                        {{ album.authorName }}
                    </p>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import GlobalSearch from '@/components/GlobalSearch.vue';
import FullScreen from '@/components/FullScreen.vue';
import { useAlbumConfigStore } from '@/store/albumStore';
import { computed } from 'vue';
import type { MusicAlbum } from '@/type/music';
import router from '@/router';

const albumConfigStore = useAlbumConfigStore();

/* 把 Map 转成数组，供模板 v-for 使用 */
const albumList = computed<any[]>(() => {
    console.log(albumConfigStore.albumsVersion, 'album version update by home page')//不要删除
    return Array.from(albumConfigStore.albums.values())
}
);

function hanAlbumRouter(album:MusicAlbum){
    router.push({
        path:'/music-album',
        query:{
            id:album.id
        }
    })
}


</script>