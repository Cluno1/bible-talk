<template>
  <div class="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 sm:p-6 lg:p-8">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">小蜗音乐 API 接口演示</h1>

      <!-- 搜索功能 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">搜索功能</h2>
        <div class="space-y-4">
          <div class="flex flex-col sm:flex-row gap-4">
            <el-input v-model="searchQuery" placeholder="请输入搜索关键词" clearable />
            <el-select v-model="searchType" placeholder="搜索类型" class="w-1/12">
              <el-option label="音乐" value="music" />
              <el-option label="专辑" value="album" />
              <el-option label="歌手" value="artist" />
              <el-option label="歌单" value="sheet" />
            </el-select>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
          </div>

          <!-- 搜索结果分页 -->
          <div v-if="searchResults" class="flex justify-between items-center">
            <span class="text-sm text-gray-500 dark:text-gray-400">共 {{ searchResults.total || 0 }} 条结果</span>
            <el-pagination v-model:current-page="currentPage" :page-size="pageSize" layout="prev, pager, next"
              @current-change="handlePageChange" :total="searchResults.total || 0" />
          </div>
        </div>

        <!-- 搜索结果展示 -->
        <div v-if="searchResults && searchResults.data && searchResults.data.length > 0" class="mt-6">
          <el-table :data="searchResults.data" border style="width: 100%">
            <el-table-column prop="title" label="名称" min-width="200" />
            <el-table-column prop="artist" label="歌手" min-width="120" />
            <el-table-column prop="album" label="专辑" v-if="searchType === 'music'" min-width="150" />
            <el-table-column fixed="right" label="操作" width="180">
              <template #default="scope">
                <el-button v-if="searchType === 'music'" type="primary" size="small"
                  @click="getMusicDetail(scope.row)">播放</el-button>

              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>


    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { searchMusic, getMusicUrl, getMusicPic, getMusicLyric } from '@/api/music';


// 搜索相关
const searchQuery = ref('');
const searchType = ref<'music' | 'album'>('music');
const currentPage = ref(1);
const pageSize = 20;
const searchResults = ref<any>(null);

// 详情相关
const musicDetail = ref<any>(null);
const lyricData = ref<any>(null);

// 其他功能（演示用，暂不实现歌手/歌单/榜单/推荐等）

// 处理搜索
async function handleSearch() {
  if (!searchQuery.value.trim()) {
    ElMessage.warning('请输入搜索关键词');
    return;
  }
  try {
    ElMessage.info('搜索中...');
    clearDetails();
    const res = await searchMusic<any>({
      keyword: searchQuery.value,
      page: currentPage.value,
      pageSize,
      source: 'kuwo', // netease（默认）、tencent、tidal、spotify、ytmusic、qobuz、joox、deezer、migu、kugou、kuwo、ximalaya、apple
      type: searchType.value
    });
    // 兼容res.data为数组的情况
    const list = Array.isArray(res) ? res : (Array.isArray(res.data) ? res.data : []);
    console.log(list, 'list')
    searchResults.value = {
      data: list.map((item: any) => ({
        id: item.id,
        title: item.name,
        artist: Array.isArray(item.artist) ? item.artist.join(',') : item.artist,
        album: item.album,
        pic_id: item.pic_id,
        lyric_id: item.lyric_id,
        source: item.source
      })),
      total: list.length
    };
  } catch (error) {
    ElMessage.error('搜索失败，请稍后重试');
    console.error('搜索失败:', error);
  }
}

async function getMusicDetail(music: any) {
  try {
    const picRes = await getMusicPic({ id: music.id, source: music.source })
    const urlRes = await getMusicUrl<any>({ id: music.id, source: music.source || 'netease' });
    const lyricRes = await getMusicLyric<any>({ id: music.lyric_id || music.id, source: music.source || 'netease' });
    console.log('图片', picRes?.url)
    console.log('音乐播放链接:', urlRes.url);
    console.log('歌词:', lyricRes.lyric||lyricRes.tlyric);// 直链
  } catch (error) {
    console.error('获取音乐详情失败:', error);
  }
}



function handlePageChange(page: number) {
  currentPage.value = page;
  handleSearch();
}

// 清除所有详情
function clearDetails() {
  musicDetail.value = null;
  lyricData.value = null;
}

// // 格式化播放次数（保留，暂未用到）
// function formatPlayCount(count: number): string {
//   if (count >= 100000000) {
//     return `${(count / 100000000).toFixed(1)}亿`;
//   } else if (count >= 10000) {
//     return `${(count / 10000).toFixed(1)}万`;
//   }
//   return count.toString();
// }
</script>

<style scoped>
.is-active {
  color: var(--el-color-primary);
  border-color: var(--el-color-primary);
}
</style>