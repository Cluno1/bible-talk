<template>
    <div>
    <el-collapse v-model="activeNames"  accordion expand-icon-position="left" class="lg:w-9/12 w-full">
            <el-collapse-item  :name='1' >
                <template #title>
                    <span class="lg:text-2xl">
                        模式切换
                    </span>
                    
                </template>
                <Dark/>
            </el-collapse-item>

            <el-collapse-item  :name='2' >
                <template #title>
                    <span class="lg:text-2xl">
                        全屏
                    </span>
                    
                </template>
                <FullScreen/>
            </el-collapse-item>

        </el-collapse>
    </div>
</template>

<script setup lang="ts">
import Dark from '@/components/Dark.vue';
import FullScreen from '@/components/FullScreen.vue';
import { ref } from 'vue';

const activeNames = ref([1, 2]);

</script>