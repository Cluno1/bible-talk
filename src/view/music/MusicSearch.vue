<template>
  <div class=" min-h-screen p-4 sm:p-6 lg:p-8">
    <div class="max-w-6xl mx-auto">
      <!-- 搜索结果展示 pc端 -->
      <div v-if="audioStore.searchData.searchResults && audioStore.searchData.searchResults.length > 0"
        class="originSearch mt-6 hidden md:block">
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

              <span>{{ selectedSourcesCount }}</span>
            </el-popover>
          </div>
        </el-affix>
        <!-- 桌面端回到顶部按钮 -->
        <el-backtop target=".originSearch" :visibility-height="50" :right="24" :bottom="80" class="hidden md:block">
          <el-icon>
            <Top />
          </el-icon>
        </el-backtop>

        <el-table :data="audioStore.searchData.searchResults" border style="width: 100%">
          <el-table-column prop="songTitle" label="名称" min-width="200" />
          <el-table-column prop="artistName" label="歌手" min-width="120" />
          <el-table-column prop="album" label="专辑" min-width="150" />
          <el-table-column fixed="right" label="操作" width="180">
            <template #default="{ row }">
              <div class="flex justify-center gap-2">
                <el-button size="small" @click="getMusicDetail(row, 'now')" style="padding: 5px;">
                  <el-icon class="mr-1">
                    <VideoPlay />
                  </el-icon>Play
                </el-button>

                <el-button size="small" @click="getMusicDetail(row, 'next')" style="padding: 5px;">
                  <el-icon class="mr-1">
                    <Flag />
                  </el-icon>
                  Add List
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 手机端 -->
    <div class="w-full lg:hidden flex flex-col items-center justify-center ">
      <!-- 手机端设置按钮 -->
      <div class="z-30  mb-5 flex items-center justify-center ">
        <el-button type="plain" size="large" @click="showPanel = true">
          <el-icon>
            <Setting />
          </el-icon>
        </el-button>
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
    <!-- 手机端列表 -->
    <div v-if="audioStore.searchData.searchResults && audioStore.searchData.searchResults.length"
      class=" mt-6 block md:hidden">
      <div class="mobileShow space-y-3" ref="mobileShow">
        <div v-for="(item, idx) in audioStore.searchData.searchResults" :key="item.id"
          class="flex items-center px-3 py-2 rounded border border-gray-200" >
          <!-- 数字序号 -->
          <span class="w-8 text-center text-gray-400 text-sm">{{ idx + 1 }}</span>

          <!-- 歌曲信息 -->
          <div class="flex-1 min-w-0" @click.stop="getMusicDetail(item, 'now')">
            <div class="text-base  truncate" :style="{ color: config.textColor }">{{ item.songTitle }}</div>
            <div class="text-xs text-gray-500 mt-1">{{ item.artistName }}</div>
          </div>

          <!-- 更多按钮 -->
          <el-dropdown trigger="click" placement="bottom-end" @click.stop.native>
            <el-button text class="ml-2">
              <el-icon class="text-gray-600">
                <MoreFilled />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu class="w-32">
                <el-dropdown-item @click.stop="getMusicDetail(item, 'now')">
                  <el-icon class="mr-2">
                    <VideoPlay />
                  </el-icon>Play
                </el-dropdown-item>
                <el-dropdown-item @click.stop="getMusicDetail(item, 'next')">
                  <el-icon class="mr-2">
                    <Flag />
                  </el-icon>Add List
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>

    <div v-if="isLoading === false && audioStore.searchData.searchResults.length < 1" class="text-2xl text-gray-400">
      {{ audioStore.searchData.searchVal ? '搜索无结果~' : '支持搜索歌手/歌名/专辑' }}
    </div>
    <!-- 分页 -->
    <div class="flex justify-center mt-8 mb-10">
      <el-pagination background layout="prev, pager, next" hide-on-single-page
        :current-page="audioStore.searchData.pagenow" :page-count="audioStore.searchData.pagecount"
        @current-change="handlePageChange" />
    </div>
    <!-- 设置面板 -->
    <Teleport to="body">
      <Transition name="slide">
        <div v-if="showPanel" class="fixed inset-0 z-50">
          <!-- 遮罩 -->
          <div class="absolute inset-0 bg-black/60" @click="closeClick" />
          <!-- 面板 -->
          <div class="absolute top-0 right-0 h-full w-80 md:w-80 border-l p-6 overflow-y-auto"
            :style="{ backgroundColor: config.modeDark ? 'black' : 'white' }">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-xl font-bold gradient-text">设置</h3>
              <el-button link @click="closeClick">
                <el-icon size="20">
                  <Close />
                </el-icon>
              </el-button>
            </div>

            <!-- 数据源 -->
            <div class="p-3 rounded-lg shadow-inner mb-4">
              <label class="block text-sm font-medium text-gray-400 mb-3 border-b border-[#333] pb-1">数据源设置</label>
              <div class="flex space-x-2 mb-3">
                <el-button size="small" @click="selectAllAPIs(true)">全选</el-button>
                <el-button size="small" @click="selectAllAPIs(false)">全不选</el-button>
              </div>
              <div class="max-h-2/3 overflow-y-auto p-2 rounded-lg mb-3">
                <div v-for="api in apiSources" :key="api.source" class="flex items-center mb-1">
                  <el-checkbox v-model="api.selected" />
                  <span :class="[
                    'ml-2',
                    'text-xs',
                    api.selected ? '' : 'text-gray-500',
                  ]">{{ api.source }}</span>
                </div>
              </div>
              <div class="text-xs text-gray-500 flex justify-between">
                <span>已选数据源数量：<span>{{ selectedSourcesCount }}</span></span>
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
import { getMusicLyric, getMusicPic, getMusicUrl, searchMusic } from '@/api/music';
import { GDSources } from '@/config/GDmusicSource';
import router from '@/router';
import { useAlbumConfigStore } from '@/store/albumStore';
import GlobalSearch from '@/components/GlobalSearch.vue';
import { useAudioConfigStore } from '@/store/audioStore';
import { useConfigStore } from '@/store/configStore';
import type { MusicType } from '@/type/music';
import { tranMusicType } from '@/utils/tranMusicType';
import { ElLoading, ElMessage } from 'element-plus';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
const audioStore = useAudioConfigStore()
const albumStore = useAlbumConfigStore()
const loading = ref()
const isLoading = ref(false)
const route = useRoute()
const config = useConfigStore()

// 回到顶部相关状态
const showScrollTop = ref(false);
const mobileShow = ref<HTMLElement>();


//设置
const showPanel = ref(false)
const apiSources = ref<{ source: string, selected: boolean }[]>([]);
const selectedSourcesCount = computed(() => {
  return apiSources.value.filter(i => i.selected).length

})

watch(selectedSourcesCount, () => {
  console.log('watch come in')
  localStorage.setItem('musicSources', JSON.stringify(apiSources.value))
})

function selectAllAPIs(val: boolean) {
  apiSources.value.forEach(i => i.selected = val)
}



//回到顶部
const scrollToTop = () => {
  if (mobileShow.value) {
    mobileShow.value.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
};

// 监听滚动事件，控制回到顶部按钮显示/隐藏
watch(mobileShow, (newVal) => {
  if (newVal) {
    newVal.addEventListener('scroll', handleScroll);
  }
});
const handleScroll = () => {
  console.log(mobileShow.value?.scrollTop);
  if (mobileShow.value) {
    showScrollTop.value = mobileShow.value.scrollTop > 300;
  }
};

//设置loading
const setLoading = (option: boolean) => {
  if (option) {
    isLoading.value = true
    loading.value = ElLoading.service({
      lock: true,
      text: "Loading",
      background: "rgba(0, 0, 0, 0.7)",
    });
  } else {
    loading.value.close();
    isLoading.value = false
  }
};

// 处理搜索
async function handleSearch(kw: string = '', page: number = 1) {
  const val = kw || audioStore.searchData.searchVal
  if (!val || !selectedSourcesCount) {
    return;
  }

  try {
    ElMessage.info('搜索中...');
    setLoading(true)

    audioStore.searchData.searchResults = []
    audioStore.searchData.total = 0

    apiSources.value.filter(i => i.selected).forEach(async (i) => {
      try {
        const res = await searchMusic<any>({
          keyword: val,
          page: page,
          source: i.source as any,
          type: 'music'  // 目前先查音乐
        });
        // 兼容res.data为数组的情况
        const list = Array.isArray(res) ? res : (Array.isArray(res.data) ? res.data : []);
        console.log(list, 'list')
        if (list.length < 1) {

          ElMessage.info(i.source + '源暂无数据')
          return;
        }
        audioStore.searchData.total += list.length

        audioStore.searchData.searchResults.push(
          ...list.map((item: any) => (tranMusicType({
            id: item.id,
            title: item.name,
            artist: Array.isArray(item.artist) ? item.artist.join(',') : item.artist,
            album: item.album,
            pic_id: item.pic_id,
            lyric_id: item.lyric_id,
            source: item.source
          })))
        )
      } catch (err) {
        ElMessage.error(i.source + '源暂时解析失败')
      }


    })


    audioStore.searchData.pagecount = page + 1

  } catch (error) {
    ElMessage.error('搜索失败，请稍后重试');
    console.error('搜索失败:', error);
  } finally {
    setLoading(false)
  }
}


//用户点击播放 | 加入播放列表
async function getMusicDetail(music: MusicType, type: 'now' | 'next') {
  try {

    const urlRes = await getMusicUrl<any>({ id: music.id, source: music.meta?.source || 'netease' });
    console.log('音乐播放链接:', urlRes.url);
    music.link = urlRes.url;
    //再决定要不要加入 TODO
    if (!music.link) {
      ElMessage.error('获取音乐播放源失败')
      return
    }

  } catch (error) {
    console.error('获取音乐详情失败:', error);
    ElMessage.error('获取音乐详情失败')
    return;
  }
  console.log(music, 'music item')
  try {
    const picRes = await getMusicPic({ id: music.meta.pic_id, source: music.meta?.source })
    const lyricRes = await getMusicLyric<any>({ id: music.meta?.lyric_id, source: music.meta?.source || 'netease' });
    console.log('图片', picRes?.url)
    music.pic = [picRes?.url];
    console.log('歌词:', lyricRes.lyric || lyricRes.tlyric);// 直链
    music.lyrics = lyricRes.lyric || lyricRes.tlyric;
    music.meta = {
      tlyric: lyricRes.tlyric//存储 翻译后歌词,文本形式
    }
  } catch (err) {
    console.error('获取信息失败', err)
  } finally {
    console.log('come to finally')
    audioStore.addAudioList(music)
    albumStore.addMusic(music)

    if (type == 'now') {
      audioStore.setCurrentAudio(music)
      router.push('/audio-play')
    } else {
      ElMessage('添加播放列表成功')
    }
  }

}

function handlePageChange(page: number) {
  audioStore.searchData.pagenow = page;
  handleSearch((route.query.kw || audioStore.searchData.searchVal) as string, page);
}

function closeClick() {
  showPanel.value = false
  handleSearch(route.query.kw as string, 1)
}

/* 路由参数变化时重新加载 */
onBeforeRouteUpdate(async (to, from, next) => {
  if (to.query.kw !== from.query.kw) {
    audioStore.searchData.searchVal = to.query.kw as string
    await handleSearch(to.query.kw as string, 1);
  }
  next();
});

onMounted(() => {
  apiSources.value = GDSources.map(i => ({ source: i, selected: false }))
  apiSources.value[0].selected = true;

  const _i = localStorage.getItem('musicSources')
  if (_i) {
    apiSources.value = JSON.parse(_i).map((i: { source: any; selected: any; }) => {
      return {
        source: i?.source,
        selected: i?.selected || false
      }
    })
  }

  const a = route.query.kw
  if (a) {

    if (a == audioStore.searchData.searchVal && audioStore.searchData.searchResults.length > 0) {
      return;
    }
    audioStore.searchData.searchVal = a as string;
    handleSearch()
  }
  window.addEventListener('scroll', handleScroll);
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
})

</script>
<style scoped>
.is-active {
  color: var(--el-color-primary);
  border-color: var(--el-color-primary);
}
</style>