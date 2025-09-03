<template>

    <el-switch v-model="config.modeDark" class="ml-3" inline-prompt :active-icon="Moon" :inactive-icon="Sunny" :style="{
        '--el-switch-on-color': pink,
        '--el-switch-off-color': blue,
    }" />
    
</template>

<script lang="ts" setup>
import { Moon, Sunny } from '@element-plus/icons-vue';
import { useConfigStore } from '../store/configStore';
import { blue, pink } from '../utils/color';
const config = useConfigStore();


</script>