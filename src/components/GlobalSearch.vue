<template>

    <div class="lg:hidden">
        <el-autocomplete v-model="searchInput" size='large' :fetch-suggestions="querySearch" clearable class="w-50"
            placeholder="search" @select="handleSelect">
            <template #append>
                <el-button :icon="Search" />
            </template>
        </el-autocomplete>
    </div>
    <!-- pc 端 -->
    <div class="hidden lg:block w-full">
        <el-autocomplete v-model="searchInput" :fetch-suggestions="querySearch" clearable class="w-50"
            placeholder="search" @select="handleSelect">
            <template #append>
                <el-button :icon="Search" />
            </template>
        </el-autocomplete>
    </div>


</template>


<script setup lang="ts">

import { Search } from '@element-plus/icons-vue';
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter()
const pageString = '   ->'
const allCanRouter = computed(() => router.getRoutes().filter((_i) => _i.components !== undefined && _i.meta?.hidden !== true && _i.path !== '/'))

const searchInput = ref('')
watch(searchInput, () => {
    const _i = searchInput.value.split(pageString)
    if (_i.length > 1) {
        searchInput.value = _i[0]
    }
})

const data = computed(() => {
    return allCanRouter.value.map((_i) => {
        return {
            value: (_i.meta?.title || _i.name) + pageString,
            router: _i.path
        }
    })
})

export type GlobalSearchCallBackType = {
    value: string | number,
    router?: string,
    //other ...
}


const querySearch = (queryString: string, cb: any) => {
    const results = data.value.filter((_i) => typeof _i.value === 'string' && _i.value.includes(queryString))
    // call callback function to return suggestions
    cb(results)
}

function handleSelect(item: GlobalSearchCallBackType) {
    console.log(item, 'item')

    if (item.router)
        router.push(item.router)
}

</script>