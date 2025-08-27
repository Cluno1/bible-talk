<template>
    <div class="w-full flex flex-col justify-center items-center" :style="{ 'color': configStore.textColor }">
        <h1 class="mb-5 text-4xl">{{ data.title }} </h1>
        <h1 class="mb-10 text-2xl">{{ data.subTitle }} </h1>
        <el-collapse v-model="activeName" accordion expand-icon-position="left" class="lg:w-9/12 w-full">
            <el-collapse-item :icon="iconsArr[index]" :name=index v-for="(childen, index) in data.children"
                :key="index">
                <template #title>
                    <span class="lg:text-2xl">
                        {{ childen.title }}
                    </span>
                    {{ childen.subTitle }}
                </template>
                <nav v-if="Array.isArray(childen.children) && childen.children?.length>0" >
                    <router-link :to="`/${data.name}/${childen.name}`">
                        <p class="mb-1" v-for="(cchilden, cindex) in childen.children" :key="index + '-' + cindex">{{
                            cchilden.title }}</p>
                    </router-link>
                </nav>
            </el-collapse-item>

        </el-collapse>
    </div>
</template>

<script lang="ts" setup>
import type { BibleTalkDataType } from '@/store/bibleTalkStore';
import { useConfigStore } from '@/store/configStore';
import * as icons from '@element-plus/icons-vue';



const iconsArr = [icons['Stopwatch'], icons['Key'], icons['Opportunity']]

import { ref } from 'vue'

defineProps<{
    data: BibleTalkDataType
}>()

const configStore = useConfigStore()
const activeName = ref()




</script>

<style></style>