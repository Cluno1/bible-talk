<template>
    <div>
        <div class="lg:hidden mb-10 flex gap-0.5">
            <FullScreen />
            <GlobalSearch type="global" />
        </div>

        <div class="flex flex-col gap-8 lg:gap-4 mb-10">
            <div class="flex gap-2 lg:gap-9 justify-start items-center">
                <svg class="icon" :style="{ 'color': config.mainColor }">
                    <use href="#icon-coffee-pink" />
                </svg>
                <h1>Give back to live what is live's,and
                    have a break<span @click="router.push({ path: '/video-test', query: { kw: '凡人' } })">~</span> </h1>
            </div>

            <div class="flex gap-2 lg:gap-9 justify-start items-center">
                <svg class="icon" :style="{ 'color': config.mainColor }">
                    <use href="#icon-coffee-pink" />
                </svg>
                <h1>Don't know how to use? <span @click="handleShowHelp" class="underline"
                        :style="{ 'color': config.mainColor }">click here for help</span>
                </h1>
            </div>
            <div class="flex gap-2 lg:gap-9 justify-start items-center">
                <svg class="icon" :style="{ 'color': config.mainColor }">
                    <use href="#icon-coffee-pink" />
                </svg>
                <el-button
                    @click="config.defaultRouterSwitch('video', true); config.defaultRouterSwitch('video-search', true); router.push('/video/search')">
                    在线视频搜索
                </el-button>
            </div>
            <div class="flex gap-2 lg:gap-9 justify-start items-center">
                <svg class="icon" :style="{ 'color': config.mainColor }">
                    <use href="#icon-coffee-pink" />
                </svg>
                <el-button @click="config.defaultRouterSwitch('music-search', true); router.push('/music-search')">
                    在线音乐搜索
                </el-button>
            </div>
        </div>


        <!-- 公开文章 -->
        <div class="flex gap-2 lg:gap-9 justify-start items-center mb-6">
            <svg class="icon" :style="{ 'color': config.mainColor }">
                <use href="#icon-coffee-pink" />
            </svg>
            <h1>公开文章</h1>
        </div>


        <div class="flex flex-col gap-4">
            <div v-for="(page, index) in localPublicPages" :key="page.id" class="flex items-start gap-3"
                @click="onRouterPage(page)">
                <!-- 序号 -->
                <span class="text-lg font-semibold" :style="{ color: config.mainColor }">
                    {{ (index + 1).toString().padStart(2, '0') }}
                </span>

                <!-- 内容 -->
                <div class="flex-1">
                    <h1 class="text-xl font-bold mb-1">{{ page.title }}</h1>
                    <p class="text-gray-600">{{ page.subTitle }}</p>
                </div>
            </div>
        </div>


        <!-- 专辑列表 -->
        <div class="flex gap-2 lg:gap-9 justify-start items-center" v-if="albumList.length > 0">
            <svg class="icon" :style="{ 'color': config.mainColor }">
                <use href="#icon-coffee-pink" />
            </svg>
            <h1>专辑列表</h1>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <el-card v-for="album in albumList" :key="album.id" shadow="hover" class="cursor-pointer"
                @click="hanAlbumRouter(album)">
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



        <div class="absolute right-0 bottom-0 ">{{ '粤ICP备2025467657号' }}</div>

    </div>
</template>

<script setup lang="ts">
import GlobalSearch from '@/components/GlobalSearch.vue';
import FullScreen from '@/components/FullScreen.vue';
import { useAlbumConfigStore } from '@/store/albumStore';
import { computed } from 'vue';
import type { MusicAlbum } from '@/type/music';
import router from '@/router';
import { useConfigStore } from '@/store/configStore';
import { useBibleTalkStore } from '@/store/bibleTalkStore';
import { ElMessage } from 'element-plus';
import { localPublicPages } from '@/utils/default/page';
import type { BibleTalkDataType } from '@/type/page';

const albumConfigStore = useAlbumConfigStore();
const config = useConfigStore()
const bibleTalkStore = useBibleTalkStore()




/* 把 Map 转成数组，供模板 v-for 使用 */
const albumList = computed<MusicAlbum[]>(() => {
    console.log(albumConfigStore.albumsVersion, 'album version update by home page')//不要删除
    return Array.from(albumConfigStore.albums.values())
}
);




function onRouterPage(page: BibleTalkDataType) {
    const a = bibleTalkStore.getData(page.id)
    console.log(a, 'a')
}

function handleShowHelp() {
    console.log('help  --72')
    try {
        if (bibleTalkStore.getData('help')) {
            ElMessage.success('成功添加')
            router.push('/help')
        } else {
            ElMessage.error('没有help页面??')
        }
    } catch (e) {

        ElMessage.success('成功跳转')
        router.push('/help')
    }

}

function hanAlbumRouter(album: MusicAlbum) {
    router.push({
        path: '/music-album',
        query: {
            id: album.id
        }
    })
}


</script>

<style scoped>
.icon {
    width: 2em;
    height: 2em;
    /* 跟随文字颜色 */
}
</style>