<template>
    <div class="lg:hidden">
        <el-autocomplete v-model="searchInput" size='large' :fetch-suggestions="querySearch" clearable class="w-50"
            placeholder="search" @select="handleSelect" @keyup.enter.native="handleClick">
            <template #append>
                <font-awesome-icon icon="fa-solid fa-paper-plane" style="color: gray;" v-show="!loading"
                    @click="handleClick" />
                <font-awesome-icon icon="spinner" spin style="color: gray;" v-show="loading" />
            </template>
        </el-autocomplete>
    </div>
    <!-- pc 端 -->
    <div class="hidden lg:block w-full">
        <el-autocomplete v-model="searchInput" :fetch-suggestions="querySearch" clearable class="w-50"
            placeholder="search" @select="handleSelect" @keyup.enter.native="handleClick">
            <template #append>
                <font-awesome-icon icon="fa-solid fa-paper-plane" style="color: gray;" v-show="!loading"
                    @click="handleClick" />
                <font-awesome-icon icon="spinner" spin style="color: gray;" v-show="loading" />
            </template>
        </el-autocomplete>
    </div>
</template>


<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter, type RouteRecordNormalized } from 'vue-router';
import { useBibleTalkStore } from '@/store/bibleTalkStore';
import { useMenuStore } from '@/store/menuStore';
import { useAlbumConfigStore } from '@/store/albumStore';
import { ElMessage } from 'element-plus';
import { useAudioConfigStore } from '@/store/audioStore';
import { useConfigStore } from '@/store/configStore';
import type { GlobalSearchCallBackType } from '@/type/search';
import { useVideoStore } from '@/store/videoStore';

const props = defineProps<{
    type: 'music' | 'global' | 'page' | 'musicAlbum' | 'video' //默认是搜索全部
}>()


/**   预设的一些搜索快捷值 和 占位值 */
const pageString = '^page\u00A0\u00A0\u00A0\u00A0' //page 占位值
const songString = '!song\u00A0\u00A0\u00A0\u00A0' //song 占位值
const musicAlbumString = '@album\u00A0\u00A0\u00A0\u00A0' //song 占位值
const removeString = 'rm\u00A0\u00A0\u00A0\u00A0' //song 占位值
const videoString = '%video\u00A0\u00A0\u00A0\u00A0'

const pagePre = '^' //page 预设
const songPre = '!' //song 预设
const musicAlbumPre = '@' //musicAlbum 预设
const removePre = 'rm'
const videoPre = '%'

const loading = ref(false)
const bibleTalkStore = useBibleTalkStore()
const menuStore = useMenuStore()
const router = useRouter()
const allCanRouter = computed(() => {
    console.log(menuStore.menuVersion, 'new version'); // 不要删除

    const routes = router.getRoutes();

    // 过滤掉占位路由
    const isPlaceholder = (route: RouteRecordNormalized) => {
        return routes.some(
            (child) => child.path.startsWith(route.path + '/') && child.path !== route.path
        );
    };

    return routes.filter((route) => {
        return (
            route.components !== undefined &&
            route.meta?.hidden !== true &&
            route.path !== '/' &&
            !isPlaceholder(route)
        );
    });
});
const config = useConfigStore()
const searchInput = ref('')

const albumConfigStore = useAlbumConfigStore()
const videoStore = useVideoStore()
const audioStore = useAudioConfigStore()

function formatSearchInput(val: string): {
    formatVal: string;
    preString: string | null;
} {
    const _fullPrefixes = [pageString, songString, musicAlbumString, videoString]; // 包含空格的完整前缀
    //   const _shortPrefixes = [pagePre, songPre, musicAlbumPre];        // 单个字符前缀

    // 1. 先检查是否完全匹配完整前缀
    const exactMatch = _fullPrefixes.find(p => val === p);

    console.log(val, exactMatch, 'exactMatch')

    if (exactMatch) {
        return {
            formatVal: val.replace(exactMatch, ''),               // 完全匹配时返回空串
            preString: exactMatch,
        };
    }

    // 2. 检查是否包含完整前缀
    const containsMatch = _fullPrefixes.map(str => str.trim()).find(p => val.includes(p));

    if (containsMatch) {
        return {
            formatVal: val.replace(containsMatch, ''),               // 包含时同样返回空串
            preString: containsMatch,
        };
    }
    switch (val?.charAt(0)) {
        case pagePre:
            return {
                formatVal: val.slice(pagePre.length),
                preString: pagePre,
            };
        case songPre:
            return {
                formatVal: val.slice(songPre.length),
                preString: songPre,
            };
        case musicAlbumPre:
            return {
                formatVal: val.slice(musicAlbumPre.length),
                preString: musicAlbumPre,
            };
        case videoPre:
            return {
                formatVal: val.slice(videoPre.length),
                preString: videoPre,
            };
    }

    // 4. 兜底：无匹配
    return {
        formatVal: val,
        preString: null,
    };
}


const routerData = computed(() => {
    return allCanRouter.value.map((_i) => {
        return {
            value: pageString + (_i.meta?.title || _i.name),
            router: _i.path
        }
    })
})

//页面的数据 搜索页面  模糊搜索  不包括占位路由
function getPage(queryString: string): GlobalSearchCallBackType[] {
    if (!props.type || props.type == 'global' || props.type == 'page') {
        return routerData.value.filter((_i) => typeof _i.value === 'string' && _i.value.includes(queryString))
    } else {
        return []
    }
}

//页面的数据  包括占位路由  用于rm 时
function getAllPage(queryString: string): GlobalSearchCallBackType[] {
    if (!props.type || props.type == 'global' || props.type == 'page') {
        return router.getRoutes().filter(_i => pageString + String(_i.name).includes(queryString) && _i.path !== '/' && _i.meta?.hidden != true).map(_i => {
            return {
                value: pageString + (_i.meta?.title || _i.name),
                router: _i.path
            }
        })
    } else {
        return []
    }
}


// 视频 搜索 模糊搜索
function getVideo(queryString: string): GlobalSearchCallBackType[] {
    if (!props.type || props.type == 'global' || props.type == 'video') {
        return (videoStore.searchVideo(queryString) || []).map(_i => {
            return {
                value: videoString + (_i.title || _i.id),
                video: _i
            }
        })
    } else {
        return []
    }
}

// 歌曲 搜索 模糊搜索
function getSong(queryString: string): GlobalSearchCallBackType[] {
    if (!props.type || props.type == 'global' || props.type == 'music') {
        return (albumConfigStore.searchMusicByVal(queryString) || []).map(_i => {
            return {
                value: songString + (_i.songTitle || _i.songEnglishTitle || _i.id),
                song: _i
            }
        })
    } else {
        return []
    }
}

//歌本 搜索  模糊搜索
function getMusicAlbum(queryString: string): GlobalSearchCallBackType[] {
    if (!props.type || props.type == 'global' || props.type == 'musicAlbum') {
        const a = albumConfigStore.searchAlbum(queryString)
        return a.map(_i => {
            return {
                value: musicAlbumString + _i.albumTitle || _i.albumEnglishTitle || _i.id,
                musicAlbum: _i
            }
        })
    }
    return []
}

function isRemove(val: string) {
    if (val.slice(0, 2) === 'rm') {
        return {
            remove: true,
            formatVal: val.slice(2).trim()
        }
    } else {
        return {
            remove: false,
            formatVal: val,
        }
    }
}
const route = useRoute()

//用户输入一些东西后,可供用户选择的值... 函数
const querySearch = (queryString: string, cb: any) => {

    const results: GlobalSearchCallBackType[] = []

    let removeSearchData = new Map<'page' | 'song' | 'musicAlbum' | 'video', GlobalSearchCallBackType[]>()

    let a = isRemove(queryString)
    if (a.remove) {
        if (a.formatVal == '') {
            removeSearchData.set('page', getAllPage(a.formatVal))
            removeSearchData.set('musicAlbum', getMusicAlbum(a.formatVal))
            removeSearchData.set('song', getSong(a.formatVal))
            removeSearchData.set('video', getVideo(a.formatVal))
        } else {
            if (a.formatVal.includes(pagePre)) {
                removeSearchData.set('page', getAllPage(a.formatVal))
            } else if (a.formatVal.includes(songPre)) {
                removeSearchData.set('song', getSong(a.formatVal))
            } else if (a.formatVal.includes(musicAlbumPre)) {
                removeSearchData.set('musicAlbum', getMusicAlbum(a.formatVal))
            } else if (a.formatVal.includes(videoPre)) {
                removeSearchData.set('video', getVideo(a.formatVal))
            } else {
                removeSearchData.set('page', getAllPage(a.formatVal))
                removeSearchData.set('musicAlbum', getMusicAlbum(a.formatVal))
                removeSearchData.set('song', getSong(a.formatVal))
                removeSearchData.set('video', getVideo(a.formatVal))
            }
        }


        for (const [, v] of removeSearchData.entries()) {
            results.push(...v.map(_i => {
                return {
                    ..._i,
                    value: removeString + _i.value
                }
            }))
        }
    }

    const { formatVal, preString } = formatSearchInput(queryString)

    if (preString) {
        if (preString.includes(pagePre)) {
            results.push(...getPage(formatVal))
        } else if (preString.includes(songPre)) {
            results.push(...getSong(formatVal))
        } else if (preString.includes(musicAlbumPre)) {
            results.push(...getMusicAlbum(formatVal))
        } else if (preString.includes(videoPre)) {
            results.push(...getVideo(formatVal))
        }
    } else {
        results.push(...getPage(formatVal))
        results.push(...getSong(formatVal))
        results.push(...getVideo(formatVal))
        results.push(...getMusicAlbum(formatVal))
    }

    // call callback function to return suggestions
    cb(results)
}


//用户点击 建议  的函数 
function handleSelect(item: GlobalSearchCallBackType) {
    if (loading.value) {
        return;
    }
    loading.value = true;


    //删除 
    if (String(item.value).slice(0, 2) === removePre) {

        if (item.router) {
            console.log(item, 'rm ?? item')

            const a = router.getRoutes().find(_i => _i.path === item.router)// router:/setting
            console.log(a, 'what is a')
            if (a) {
                //default router   
                const defaultRouter = ["setting", "music-album", "music-search", "audio-play", "video", "video-index", "video-search", "bible", "error"];
                const _a = defaultRouter.find(i => i === a.name)
                if (_a) {
                    searchInput.value = ''
                    config.defaultRouterSwitch(_a as any, false)
                    ElMessage.success('不显示页面成功')
                    loading.value = false
                } else {
                    console.log(a.name, 'name')
                    if (!config.removeRoute(a.name as string)) {
                        ElMessage.error('删除页面失败')
                    } else {
                        ElMessage.success('删除页面成功')
                        searchInput.value = ''
                        loading.value = false
                        bibleTalkStore.removeData(String(a?.meta?.dataId))
                    }
                }
            }
            loading.value = false;
            return
        } else if (item.song) {
            albumConfigStore.clearMusic(item.song.id)
            audioStore.removeAudio(item.song)
            ElMessage.success('删除歌曲成功')
            searchInput.value = ''
            loading.value = false;
            return
        } else if (item.musicAlbum) {
            albumConfigStore.clearAlbum(item.musicAlbum.id)
            ElMessage.success('删除专辑成功')
            searchInput.value = ''
            loading.value = false;
            return
        } else if (item.video) {
            videoStore.deleteVideo(item.video)
            ElMessage.success('删除视频成功')
            searchInput.value = ''
            loading.value = false;
            return
        }
    }


    //具体分类
    if (item.router) {
        searchInput.value = ''
        router.push(item.router)
    } else if (item.song) {
        //用户点击了 song 提示单后  添加到播放页面,然后用户播放  查看用户有没有 /audio路由
        searchInput.value = ''
        audioStore.addAudioList(item.song)
        ElMessage.success('添加歌曲成功')
        router.push('/audio-play')
    } else if (item.musicAlbum) {
        searchInput.value = ''
        router.push({
            path: '/music-album',
            query: {
                id: item.musicAlbum.id,
            }
        })
    } else if (item.video) {
        searchInput.value = ''
        router.push({
            path: '/video',
            query: {
                id: item.video.id,
            }
        })
    }
    loading.value = false;

}
//用户点击按钮
function handleClick() {
    if (searchInput.value === '') {
        return
    }
    if (loading.value) {
        return;
    }
    loading.value = true;

    const { formatVal } = formatSearchInput(searchInput.value)

    try {
        //default router
        if (formatVal.trim().toLowerCase() === 'setting') {
            loading.value = false
            config.defaultRouterSwitch('setting')
            router.push('/setting')
            return;
        } else if (formatVal.trim().toLowerCase() === 'audio') {
            loading.value = false
            config.defaultRouterSwitch('audio-play')
            router.push('/audio-play')
            return;
        }
        if (bibleTalkStore.getData(formatVal)) {
            loading.value = false
            searchInput.value = ''
            return ElMessage.success('添加页面成功')
        }
        if (albumConfigStore.searchAlbumByClound(formatVal)) {
            loading.value = false
            searchInput.value = ''
            config.defaultRouterSwitch('audio-play')
            return ElMessage.success('添加专辑成功')
        }
        if (albumConfigStore.searchMusicById(formatVal)) {
            loading.value = false
            searchInput.value = ''
            config.defaultRouterSwitch('audio-play')
            router.push('/audio-play')
            return ElMessage.success('添加歌曲成功')
        }
        const v = videoStore.searchVideoClound(formatVal)
        if (v) {
            loading.value = false
            searchInput.value = ''
            router.push({
                path: '/video',
                query: {
                    id: v.id,
                }
            })
            return ElMessage.success('添加视频成功')
        }

        if (route.fullPath.endsWith('home')) {
            loading.value = false
            return ElMessage.error('暂无该搜索资源,请检查搜索是否正确')
        }

        if (route.fullPath.includes('video') || searchInput.value[0] == '%') {
            router.push({
                path: '/video/search',
                // path: '/test',
                query: {
                    kw: formatVal
                }
            })
        } else if (route.fullPath.includes('music') || searchInput.value[0] == '!') {
            audioStore.searchData.searchVal = formatVal
            router.push({
                path: '/music-search',
                query: {
                    kw: formatVal
                }
            })
        } else {
            audioStore.searchData.searchVal = formatVal
            router.push({
                path: '/music-search',
                query: {
                    kw: formatVal
                }
            })
        }

    } catch (e: any) {

        ElMessage.error(e.message || '搜索错误')
    } finally {
        loading.value = false
    }

}

</script>