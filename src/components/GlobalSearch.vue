<template>
    <div class="lg:hidden">
        <el-autocomplete v-model="searchInput" size='large' :fetch-suggestions="querySearch" clearable class="w-50"
            placeholder="search" @select="handleSelect">
            <template #append>
                <font-awesome-icon icon="fa-solid fa-paper-plane" style="color: gray;" v-show="!loading"
                    @click="handleSelect" />
                <font-awesome-icon icon="spinner" spin style="color: gray;" v-show="loading" @click="handleSelect" />
            </template>
        </el-autocomplete>
    </div>
    <!-- pc 端 -->
    <div class="hidden lg:block w-full">
        <el-autocomplete v-model="searchInput" :fetch-suggestions="querySearch" clearable class="w-50"
            placeholder="search" @select="handleSelect">
            <template #append>
                <font-awesome-icon icon="fa-solid fa-paper-plane" style="color: gray;" v-show="!loading"
                    @click="handleSelect" />
                <font-awesome-icon icon="spinner" spin style="color: gray;" v-show="loading" @click="handleSelect" />
            </template>
        </el-autocomplete>


    </div>


</template>


<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter, type RouteRecordNormalized } from 'vue-router';
import { useBibleTalkStore } from '@/store/bibleTalkStore';
import { useMenuStore } from '@/store/menuStore';
import { useAlbumConfigStore } from '@/store/albumStore';
import type { MusicAlbum, MusicType } from '@/type/music';
import { ElMessage } from 'element-plus';
import { useAudioConfigStore } from '@/store/audioStore';
import { useConfigStore } from '@/store/configStore';

const props = defineProps<{
    type: 'music' | 'global' | 'page' | 'musicAlbum' //默认是搜索全部
}>()

/**               类型定义       */
export type GlobalSearchCallBackType = {
    value: string | number,
    router?: string,//页面路由
    musicAlbum?: MusicAlbum,
    song?: MusicType,
    //other ...
}

/**   预设的一些搜索快捷值 和 占位值 */
const pageString = '^page    ' //page 占位值
const songString = '!song    ' //song 占位值
const musicAlbumString = '@album    ' //song 占位值

const pagePre = '^' //page 预设
const songPre = '!' //song 预设
const musicAlbumPre = '@' //musicAlbum 预设

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
const audioStore = useAudioConfigStore()

function formatSearchInput(val: string): {
  formatVal: string;
  preString: string | null;
} {
  const _fullPrefixes = [pageString, songString, musicAlbumString]; // 包含空格的完整前缀
//   const _shortPrefixes = [pagePre, songPre, musicAlbumPre];        // 单个字符前缀

  // 1. 先检查是否完全匹配完整前缀
  const exactMatch = _fullPrefixes.find(p => val === p);
  if (exactMatch) {
    return {
      formatVal: '',               // 完全匹配时返回空串
      preString: exactMatch,
    };
  }

  // 2. 检查是否包含完整前缀
  const containsMatch = _fullPrefixes.find(p => val.includes(p));
  if (containsMatch) {
    return {
      formatVal: '',               // 包含时同样返回空串
      preString: containsMatch,
    };
  }

  // 3. 原来的逻辑：检查单字符前缀
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

//页面的数据 搜索页面  模糊搜索
function getPage(queryString: string): GlobalSearchCallBackType[] {
    if (!props.type || props.type == 'global' || props.type == 'page') {
        return routerData.value.filter((_i) => typeof _i.value === 'string' && _i.value.includes(queryString))
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


//用户输入一些东西后,可供用户选择的值... 函数
const querySearch = (queryString: string, cb: any) => {

    const results: GlobalSearchCallBackType[] = []

    const { formatVal, preString } = formatSearchInput(queryString)
    console.log(formatVal, preString, 'formatval')
    if (preString) {
        if (preString.includes('^')) {
            results.push(...getPage(formatVal))
        } else if (preString.includes('!')) {
            results.push(...getSong(formatVal))
        } else if (preString.includes('@')) {
            results.push(...getMusicAlbum(formatVal))
        }
    } else {
        results.push(...getPage(formatVal))

        results.push(...getSong(formatVal))


        results.push(...getMusicAlbum(formatVal))
    }

    // call callback function to return suggestions
    cb(results)
}

function handleSelect(item: GlobalSearchCallBackType) {
    if (loading.value) {
        return;
    }
    loading.value = true;
    setTimeout(() => {
        loading.value = false
    }, 10_000);

    if (item.router) {
        searchInput.value = ''
        router.push(item.router)
    } else if (item.song) {
        //用户点击了 song 提示单后  添加到播放页面,然后用户播放  查看用户有没有 /audio路由
        searchInput.value = ''
        audioStore.addAudioList(item.song)
        ElMessage.success('添加歌曲成功')
    } else if (item.musicAlbum) {
        //跳转到 专辑页面 ?? todo
        searchInput.value = ''
        router.push({
            path: '/music-album',
            query: {
                id: String(item.value).split(musicAlbumString)[1],
            }
        })

    } else {
        try {
            if (bibleTalkStore.getData(searchInput.value)) {
                loading.value = false
                return ElMessage.success('添加页面成功')
            }
            if (albumConfigStore.searchAlbumByClound(searchInput.value)) {
                loading.value = false
                config.showAudioRouter()
                return ElMessage.success('添加专辑成功')
            }
            if (albumConfigStore.searchMusicById(searchInput.value)) {
                // todo  添加到播放列表
                loading.value = false
                config.showAudioRouter()
                return ElMessage.success('添加歌曲成功')
            }
            loading.value = false
            ElMessage.error('找不到数据')

        } catch (e: any) {
            loading.value = false
            ElMessage.error(e.message || '搜索错误')
        }

    }
    loading.value = false;



}

</script>