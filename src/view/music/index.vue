<template>
    <div class="body gap-9 flex justify-center items-center lg:justify-start lg:items-start  ">
        <div class="hidden lg:block lg:w-1/3">
            <!-- 播放列表表格 pc -->
            <el-table :data="audioConfig.list" stripe style="width: 100%" max-height="500" empty-text="No music yet">
                <!-- 歌名 + 歌手 -->
                <el-table-column label="Title / Artist">
                    <template #default="{ row }">
                        <div>
                            <!-- 优先显示中文歌名，没有再显示英文歌名 -->
                            <div class="font-bold">{{ row.songTitle || row.songEnglishTitle || '--' }}</div>
                            <div class="text-sm text-gray-500">{{ row.artistName || '--' }}</div>
                        </div>
                    </template>
                </el-table-column>
                <!-- 操作按钮 -->
                <el-table-column label="Operation" width="150" align="center">
                    <template #default="{ row }">
                        <div class="flex justify-center gap-2">
                            <el-button size="small" @click="loadTrack(row, true)" style="padding: 5px;">
                                <font-awesome-icon icon="fas fa-play" />Play
                            </el-button>
                            <el-button size="small"
                                @click="audioConfig.deleteAudioFromList(row); row.id === audioConfig.currentAudio?.id ? nextTrack() : ''"
                                style="padding: 5px;">
                                <font-awesome-icon icon="fas fa-trash" /> Del
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div :class="['player-container', 'w-[80%]', 'md:w-fit', config.modeDark ? '' : 'shadow-light']"
            :style="{ 'background': config.audioPlayBgColor, 'color': config.audioPlayTextColor }">
            <!-- 1. 封面 -->
            <div :class="['album-cover']" :style="{ 'backgroundColor': config.lightMainColor }">

                <img v-if="albumPicture.length>0"
                    :src="albumPicture[picVersion % albumPicture.length]"
                    alt="Album Cover" />
                
                <div class="loading">
                    <font-awesome-icon icon="spinner" spin /> 加载中...
                </div>
            </div>
            <!-- 2. 歌曲信息 -->
            <div class="song-info">
                <!-- 主标题：优先中文 → 英文 → 未知 -->
                <div class="song-title" :style="{ color: config.textColor }">
                    {{ audioConfig.currentAudio?.songTitle
                        || audioConfig.currentAudio?.songEnglishTitle
                        || '未知歌曲名' }}
                </div>

                <!-- 副标题：仅当英文存在且与中文不同时展示 -->
                <div v-if="
                    audioConfig.currentAudio?.songEnglishTitle
                    && audioConfig.currentAudio?.songTitle   // 有中文
                    && audioConfig.currentAudio.songEnglishTitle !== audioConfig.currentAudio.songTitle
                " class="song-title2" :style="{ color: config.textColor }">
                    {{ audioConfig.currentAudio.songEnglishTitle }}
                </div>

                <div class="artist-name">
                    {{ audioConfig.currentAudio?.artistName || '演奏者' }}
                </div>
            </div>
            <!-- 3. 进度条 -->
            <div class="progress-container">
                <div class="progress-bar"
                    :style="{ 'backgroundColor': getDarkerActiveColor(config.audioPlayTextColor, 0.3) }"
                    id="progress-bar" @click="seekTo">
                    <div class="progress" id="progress" :style="{ width: progressPercent }"></div>
                </div>
                <div class="time-info">
                    <span id="current-time">{{ formatTime(currentTime) }}</span>
                    <span id="total-time">{{ formatTime(duration) }}</span>
                </div>
            </div>

            <!-- 4. 播放控制 -->
            <div class="controls">
                <!-- 控制下一首是 随机播放 循环播放 单曲循环 -->
                <font-awesome-icon
                    :icon="playType == 'random' ? 'random' : playType == 'repeatAll' ? 'fa-solid fa-repeat' : 'fa-solid fa-right-long'"
                    @click="handlePlayType" />
                <!-- 前一首 -->
                <font-awesome-icon icon="backward" id="prev" @click="prevTrack" />
                <!-- play pause -->
                <font-awesome-icon :icon="isPlaying ? 'pause' : 'play'" id="play-pause" @click="togglePlay" />
                <!-- 下一首 -->
                <font-awesome-icon icon="forward" id="next" @click="nextTrack" />
                <!-- 进度条归零 开始播放 -->
                <div class="hidden lg:block">
                    <font-awesome-icon icon="redo" @click="handleRedo" />
                </div>
                <!-- 打开播放列表 -->
                <div class="lg:hidden">
                    <font-awesome-icon icon="fa-solid fa-list" @click="musicListShow = !musicListShow" />
                </div>
            </div>

            <!-- 5. 音量 -->
            <div class="volume-container">
                <font-awesome-icon :icon="volumeIcon" class="volume-icon" id="volume-icon" @click="toggleMute" />
                <input type="range" class="volume-slider" id="volume-slider" min="0" max="100" v-model.number="volume"
                    :style="{ 'accent-color': config.mainColor }" />
            </div>

            <!-- 6. 歌词  手机端-->
            <div class="lyrics lg:hidden pt-6 h-40 overflow-y-auto text-center relative" ref="lyricsContainer">
                <div ref="lyricRef" class="space-y-2 py-12">
                    <p v-for="(l, i) in audioConfig.currentLyrics" :key="i" class="transition-all duration-300 px-4"
                        :class="i === activeLine ? 'text-white font-medium scale-105' : 'text-gray-400'"
                        @click="handleChActiveLyr(l)">
                        {{ l.text }}
                    </p>
                </div>
            </div>

        </div>
        <!-- 歌词  pc端 -->

        <div class="lyrics hidden lg:block lg:w-1/3 pt-6 h-80 overflow-y-auto text-center relative"
            ref="lyricsContainerPc">
            <div ref="lyricRefPc" class="space-y-2 py-12">
                <p v-for="(l, i) in audioConfig.currentLyrics" :key="i" class="transition-all duration-300 px-4"
                    :class="i === activeLine ? ' font-medium scale-105 ' : ''" @click="handleChActiveLyr(l)"
                    :style="{ 'color': i === activeLine ? config.textColor : (config.modeDark ? getDarkerActiveColor('#99a1af', 0.2) : '#99a1af') }">
                    {{ l.text }}
                </p>
            </div>


        </div>


        <el-dialog v-model="musicListShow" draggable center title="Music List" width="350">
            <!-- 搜索组件保持不变 -->
            <GlobalSearch type="music" />

            <!-- 播放列表表格 -->
            <el-table :data="audioConfig.list" stripe style="width: 100%" max-height="400" empty-text="No music yet">
                <!-- 歌名 + 歌手 -->
                <el-table-column label="Title / Artist">
                    <template #default="{ row }">
                        <div>
                            <!-- 优先显示中文歌名，没有再显示英文歌名 -->
                            <div class="font-bold">{{ row.songTitle || row.songEnglishTitle || '--' }}</div>
                            <div class="text-sm text-gray-500">{{ row.artistName || '--' }}</div>
                        </div>
                    </template>
                </el-table-column>
                <!-- 操作按钮 -->
                <el-table-column label="Operation" width="150" align="center">
                    <template #default="{ row }">
                        <div class="flex justify-center gap-2">
                            <el-button size="small" @click="loadTrack(row, true)" style="padding: 5px;">
                                <font-awesome-icon icon="fas fa-play" />Play
                            </el-button>
                            <el-button size="small"
                                @click="audioConfig.deleteAudioFromList(row); row.id === audioConfig.currentAudio?.id ? nextTrack() : ''"
                                style="padding: 5px;">
                                <font-awesome-icon icon="fas fa-trash" /> Del
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { useAudioConfigStore } from '@/store/audioStore'
import { useConfigStore } from '@/store/configStore'
import { getDarkerActiveColor } from '@/utils/getAutoColor'
import { ElMessage } from 'element-plus'
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import GlobalSearch from '@/components/GlobalSearch.vue'
import type { MusicType } from '@/type/music'
import { useAlbumConfigStore } from '@/store/albumStore'
const config = useConfigStore()
const audioConfig = useAudioConfigStore()
const albumStore=useAlbumConfigStore()
/* ---------- 音频实例 ---------- */
const audio = new Audio(audioConfig.getInitAudio().link)

audio.preload = 'auto'

/* ---------- 响应式状态 ---------- */
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(100)
const lastVolume = ref(1)
const albumPicture=computed<string[]>(()=>{
    const _a=audioConfig.currentAudio?.pic||audioConfig.currentAudio?.albumPic||[]
    if(_a.length>0){
        return  _a
    }else{
        const _b=audioConfig.currentAudio?.album
        if(_b){
            const c=albumStore.searchAlbum(_b)
            if(c.length>0){
                return c[0].pic||[]
            }
        }
    }
    return []
})
const picVersion = ref(0)
let picTimer: any = ''

const musicListShow = ref(false)

type PlayMode = 'random' | 'repeatAll' | 'repeatSingle'
const playType = ref<PlayMode>('repeatAll')

/* ---------- 计算属性 ---------- */
const progressPercent = computed(() =>
    duration.value ? `${(currentTime.value / duration.value) * 100}%` : '0%'
)
const volumeIcon = computed(() => {
    if (volume.value === 0) return 'volume-mute'
    return volume.value < 50 ? 'volume-down' : 'volume-up'
})

/* ---------- 工具函数 ---------- */
const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60).toString().padStart(2, '0')
    return `${m}:${s}`
}

function initPicTimer() {
    clearPicTimer()
    picTimer = setInterval(() => {
        picVersion.value++
    }, 15_000)
}
function clearPicTimer() {
    picVersion.value = 0;
    if (picTimer) {
        clearInterval(picTimer)
    }

}

// 歌词相关

function handleChActiveLyr(lyr: { text: string, time: number }) {
    if (lyr != audioConfig.currentLyrics[activeLine.value]) {
        const a = audioConfig.currentLyrics.find(_i => _i == lyr)
        if (a) {
            audio.currentTime = a.time
            currentTime.value = a.time
        }
    }
}


/* 计算当前高亮行索引 */
const activeLine = computed(() => {
    const list = audioConfig.currentLyrics
    let idx = -1
    for (let i = 0; i < list.length; i++) {
        if (currentTime.value >= list[i].time) idx = i
        else break
    }
    return idx
})

/* 让当前行始终保持在可视区 */
const lyricRef = ref<HTMLDivElement>()
const lyricRefPc = ref<HTMLDivElement>()
watch(activeLine, () => {
    nextTick(() => {
        if (lyricRef.value) {
            const target = lyricRef.value.children[activeLine.value] as HTMLElement
            target?.scrollIntoView({ behavior: 'smooth', block: 'center' })

        }
        if (lyricRefPc.value) {
            const target = lyricRefPc.value.children[activeLine.value] as HTMLElement
            target?.scrollIntoView({ behavior: 'smooth', block: 'center' })

        }
    })

})


// 歌词容器和内容引用
const lyricsContainer = ref<HTMLDivElement>()
const lyricsContainerPc = ref<HTMLDivElement>()


/* 自定义滚动函数 - 让当前行保持在可视区中间 */
const scrollToActiveLine = () => {
    if (!lyricsContainer.value || !lyricRef.value || activeLine.value === -1) return
    if (!lyricsContainerPc.value || !lyricRefPc.value) return

    /**手机*/

    function gun(lyricsContainer: HTMLDivElement, lyricRef: HTMLDivElement) {
        const container = lyricsContainer
        const activeElement = lyricRef.children[activeLine.value] as HTMLElement
        if (!activeElement) return

        // 计算目标滚动位置
        const containerHeight = container.clientHeight
        const elementOffset = activeElement.offsetTop
        const elementHeight = activeElement.offsetHeight

        // 将当前行滚动到容器中间
        const targetScrollTop = elementOffset - (containerHeight / 2) + (elementHeight / 2)

        // 使用平滑滚动
        container.scrollTo({
            top: targetScrollTop,
            behavior: 'smooth'
        })
    }

    gun(lyricsContainer.value, lyricRef.value)
    gun(lyricsContainerPc.value, lyricRefPc.value)


}
// 监听activeLine变化
watch(activeLine, () => {
    nextTick(() => {
        scrollToActiveLine()
    })
})



/* ---------- 播放控制 ---------- */
// 加载并播放一条音轨
function loadTrack(track: MusicType, autoplay = true) {
    audio.src = track.link
    audio.load()
    //设置 播放下一条
    audioConfig.setCurrentAudio(track)
    if (autoplay) {
        audio.play().catch(() => ElMessage.error('播放失败'))
    }
}

// 下一首
function nextTrack() {
    if (!audioConfig.list.length) return loadTrack(audioConfig.getInitAudio())
    let next: MusicType
    switch (playType.value) {
        case 'random':
            next = audioConfig.list[Math.floor(Math.random() * audioConfig.list.length)]
            break
        case 'repeatSingle':
            next = audioConfig.currentAudio || audioConfig.list[0]
            break
        case 'repeatAll':
        default:
            const idx = audioConfig.list.findIndex(t => t.link === audioConfig.currentAudio?.link)
            next = audioConfig.list[(idx + 1) % audioConfig.list.length]
            break
    }
    // 记录历史
    if (audioConfig.currentAudio) {
        audioConfig.historyAudio.unshift(audioConfig.currentAudio)
        if (audioConfig.historyAudio.length > 10) audioConfig.historyAudio.pop()
    }
    loadTrack(next)
}

// 上一首
function prevTrack() {
    if (audioConfig.historyAudio.length) {
        loadTrack(audioConfig.historyAudio.shift()!)
    } else {
        if (!audioConfig.list.length) return ElMessage('播放列表为空')
        const idx = audioConfig.list.findIndex(t => t.link === audioConfig.currentAudio?.link)
        const prev = audioConfig.list[(idx - 1 + audioConfig.list.length) % audioConfig.list.length]
        loadTrack(prev)
    }
}

/* ---------- 事件处理 ---------- */
const togglePlay = (force?: boolean) => {
    if (!audioConfig.currentAudio) {
        if (audioConfig.list.length > 0) {
            return loadTrack(audioConfig.list[0], true)
        } else {
            ElMessage('播放列表为空')
            return
        }
    }
    if (typeof force === 'boolean') {
        force ? audio.play().catch(() => ElMessage.error('播放失败'))
            : audio.pause()
    } else {
        isPlaying.value ? audio.pause() : audio.play().catch(() => ElMessage.error('播放失败'))
    }
}

const seekTo = (e: MouseEvent) => {
    if (!duration.value) return
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    audio.currentTime = percent * duration.value
}

const handleRedo = () => {
    audio.currentTime = 0
    togglePlay(true)
}

const handlePlayType = () => {
    const order: PlayMode[] = ['repeatAll', 'repeatSingle', 'random']
    const idx = (order.indexOf(playType.value) + 1) % 3
    playType.value = order[idx]
    ElMessage(playType.value === 'repeatAll' ? '列表循环' :
        playType.value === 'repeatSingle' ? '单曲循环' :
            '随机播放')
}

const toggleMute = () => {
    if (volume.value > 0) {
        lastVolume.value = volume.value / 100
        volume.value = 0
    } else {
        volume.value = lastVolume.value * 100
    }
}

/* ---------- 监听 ---------- */
watch(volume, v => (audio.volume = v / 100))

/* ---------- 生命周期 ---------- */
onMounted(() => {

    audio.addEventListener('loadedmetadata', () => (duration.value = audio.duration))
    audio.addEventListener('timeupdate', () => (currentTime.value = audio.currentTime))
    audio.addEventListener('play', () => (isPlaying.value = true))
    audio.addEventListener('pause', () => (isPlaying.value = false))
    audio.addEventListener('ended', () => {
        isPlaying.value = false
        // 播放结束自动下一首
        nextTrack()
    })

    if (!audioConfig.currentAudio && audioConfig.list.length > 0) {

        audioConfig.setCurrentAudio(audioConfig.list[0])
    }

    if (audioConfig.currentAudio) {
        loadTrack(audioConfig.currentAudio, false)
    }

    initPicTimer()
})

onUnmounted(() => {
    audio.pause()
    clearPicTimer()
})
</script>


<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    user-select: none;
}

.body {
    border-radius: 15px;
    max-height: 90vh;
    overflow: auto;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
}

.body::-webkit-scrollbar {
    width: 5px;
}

.body::-webkit-scrollbar-track {
    background: transparent;
}

/* rgba(116, 108, 108, 0.808) */
.body::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 5px;
}

.player-container {

    border-radius: 20px;
    padding: 25px;
    transition: transform 0.3s ease;
}

.shadow-light {
    box-shadow: 10px 5px 30px rgba(0, 0, 0, 0.5),
        inset 2px 1px 5px rgba(255, 253, 253, 0.651);
}

.shadow-dark {
    box-shadow: -1px -1px 3px rgba(172, 169, 169, 0.658);
}


.album-cover {
    position: relative;
    width: 100%;
    height: 13rem;
    border-radius: 15px;
    overflow: hidden;
    margin-bottom: 25px;
    box-shadow:
        inset -2px -3px 3px rgba(230, 228, 228, 0.863),
        inset 5px 5px 10px rgba(4, 4, 4, 0.687);
}

.album-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.album-cover::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0) 50%);
}

.album-cover img:hover {
    transform: scale(1.05);
}

.song-info {
    text-align: center;
    margin-bottom: 20px;
}

.song-title {
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 4px;
    text-shadow: 0 2px 4px rgba(80, 78, 78, 0.477);
}

.song-title2 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 4px;
}

.artist-name {
    margin-top: 4px;
    font-size: 16px;
    font-weight: 300;
}

.progress-container {
    margin: 20px 0;
}

.progress-bar {
    width: 100%;
    height: 6px;
    border-radius: 3px;
    cursor: pointer;
    position: relative;
}

.progress {
    width: 0;
    height: 100%;
    background: linear-gradient(90deg, #ffffff, #e0e0e0);
    border-radius: 3px;
    transition: width 0.1s linear;
    position: relative;
}

.progress::after {
    content: '';
    position: absolute;
    right: -5px;
    top: 50%;
    transform: translateY(-50%);
    width: 12px;
    height: 12px;
    background: #ffffff;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    opacity: 0;
    transition: opacity 0.2s;
}

.progress-bar:hover .progress::after {
    opacity: 1;
}

.time-info {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    margin-top: 8px;
}

/* 解决手机端 sticky hover */
@media (hover: none) {
    .controls>* {
        -webkit-tap-highlight-color: transparent;
        /* 去掉自带阴影 */
    }
}

.controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 25px 0;
    padding: 0 20px;
}

.controls>* {
    font-size: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.controls>* :hover {
    transform: scale(1.1);
    color: #ffffff;
}


.controls .fa-play,
.controls .fa-pause {
    font-size: 35px;
}

.volume-container {
    display: flex;
    align-items: center;
    margin-top: 15px;
    margin-bottom: 15px;
    padding: 0 20px;
}

.volume-icon {
    margin-right: 10px;
    cursor: pointer;
    transition: color 0.3s ease;
}

.volume-icon:hover {
    color: #ffffff;
    transform: scale(1.1);
}

.volume-slider {
    flex: 1;
    height: 4px;
    border-radius: 2px;
    background: #8b8888;
    outline: none;
    cursor: pointer;
}

.volume-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #9f9797;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.volume-slider::-webkit-slider-thumb:hover {
    transform: scale(1.2);
}



.lyrics::-webkit-scrollbar {
    width: 5px;
}

.lyrics::-webkit-scrollbar-track {
    background: transparent;
}

.lyrics::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 15px;
}

.loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 14px;
    display: none;
}
</style>