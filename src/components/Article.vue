<template>
    <div class="h-full w-full">
        <el-card class="max-w-4xl mx-auto p-6 md:p-10 shadow-xl rounded-2xl mb-20 relative">
            <!-- 返回 -->
            <el-button class=" absolute left-0 top-0" @click="router.go(-1)"><el-icon>
                    <Back />
                </el-icon>back</el-button>
            <!-- 标题区 -->
            <h1 v-if="title" class="text-3xl sm:text-2xl md:text-4xl font-bold text-center mb-2"
                :style="{ color: config.mainColor }">
                {{ title }}
            </h1>
            <h4 v-if="subTitle" class="text-lg md:text-2xl font-bold text-center mb-8"
                :style="{ color: config.mainColor }">
                {{ subTitle }}
            </h4>

            <!-- 正文 -->
            <article class="space-y-10 mb-10 leading-relaxed">
                <section v-for="(sec, i) in sections" :key="i">
                    <h2 class="text-xl md:text-2xl font-semibold mb-3 border-l-4 pl-3"
                        :style="{ 'borderLeftColor': sec.titleLeftColor || getDarkerActiveColor(color[i % color.length], 0.1) }">
                        {{ sec.title }}
                    </h2>

                    <p v-for="(p, j) in sec.paragraphs" :key="`${i}-${j}`" class="gospel-p mb-4"
                        :class="{ highlight: activeId === `${i}-${j}` }"
                        :style="{ 'color': activeId === `${i}-${j}` ? config.mainColor : '' }"
                        @click="toggleHighlight(`${i}-${j}`)">
                        {{ p }}
                    </p>
                </section>
                <!-- 底部参考资料 -->
                <section v-if="reference">
                    <p class="italic mb-4 text-sm to-gray-400">
                        参考资料:
                        <a :href="reference.link" target="_blank" rel="noopener" class="underline"
                            :style="{ color: config.mainColor }">
                            {{ reference.text }}
                        </a>
                    </p>
                </section>
            </article>
        </el-card>

        <div style="height: 1px"></div>
    </div>
</template>

<script setup lang="ts">
import { useConfigStore } from '@/store/configStore'
import { color } from '@/utils/color'
import { getDarkerActiveColor } from '@/utils/getAutoColor'
import { ref } from 'vue'
import router from '@/router'
import { Back } from '@element-plus/icons-vue'

/* ---------- 类型 ---------- */
export interface Section {
    title: string
    titleLeftColor?: string
    paragraphs: string[]
}

export interface Reference {
    text: string
    link: string
}

/* ---------- Props ---------- */
withDefaults(
    defineProps<{
        title?: string
        subTitle?: string
        sections: Section[]
        reference?: Reference
    }>(),
    {
        subTitle: '',
    }
)

const config = useConfigStore()

/** 高亮交互  */
const activeId = ref<string | null>(null)

function toggleHighlight(id: string) {
    activeId.value = activeId.value === id ? null : id
}
</script>

<style scoped>
.gospel-p {
    transition: color 0.2s;
}

.highlight {
    scroll-margin-top: 3rem;
}
</style>