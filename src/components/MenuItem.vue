<!-- src/layout/components/MenuItem.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { getIcon } from '@/utils/icon'

const props = defineProps<{
    route: RouteRecordRaw
    basePath: String
}>()

const fullPath = computed(() => {
    if (props.route.path.includes('/')) {
        return props.basePath + props.route.path
    } else {
        return props.basePath + '/' + props.route.path
    }
})
const hasChildren = computed(//是否有子路由
    () =>
        props.route.children && props.route.children.length > 0 &&
        props.route.children.some((c) => !c.meta?.hidden)
)
</script>

<template>
    <!-- 叶子节点 -->
    <el-menu-item v-if="!hasChildren" :index="fullPath">
        <el-icon v-if="route.meta?.icon">
            <component :is="getIcon(route.meta.icon as string)" />
        </el-icon>
        <template #title>{{ route.meta?.title || route.name }}</template>
    </el-menu-item>

    <!-- 子菜单 -->
    <el-sub-menu v-else :index="fullPath">
        <template #title>
            <el-icon v-if="route.meta?.icon">
                <component :is="getIcon(route.meta.icon as string)" />
            </el-icon>
            <span>{{ route.meta?.title || route.name }}</span>
        </template>

        <MenuItem v-for="child in route.children" :key="String(child.path) + String(child.name || '')" :route="child"
            :base-path="fullPath" />
    </el-sub-menu>
</template>