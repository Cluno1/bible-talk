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
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useBibleTalkStore } from '@/store/bibleTalkStore';
import { useMenuStore } from '@/store/menuStore';

const props = defineProps<{
    type: 'music' | undefined | 'page' //默认是搜索全部
}>()

/**               类型定义       */
export type GlobalSearchCallBackType = {
    value: string | number,
    router?: string,//页面路由
    //other ...
}

const loading = ref(false)
const bibleTalkStore = useBibleTalkStore()
const menuStore = useMenuStore()
const router = useRouter()
const pageString = '   ->'
const allCanRouter = computed(() => {
    console.log(menuStore.menuVersion, 'new version')
    return router.getRoutes().filter((_i) => _i.components !== undefined && _i.meta?.hidden !== true && _i.path !== '/')

})

const searchInput = ref('')
watch(searchInput, () => {
    const _i = searchInput.value.split(pageString)
    if (_i.length > 1) {
        searchInput.value = _i[0]
    }
})


const routerData = computed(() => {
    return allCanRouter.value.map((_i) => {
        return {
            value: (_i.meta?.title || _i.name) + pageString,
            router: _i.path
        }
    })
})
//页面的数据 搜索页面
function getPage(queryString: string): GlobalSearchCallBackType[] {
    return routerData.value.filter((_i) => typeof _i.value === 'string' && _i.value.includes(queryString))
}



//用户搜索一些东西后,可供用户选择的值... 函数
const querySearch = (queryString: string, cb: any) => {

    const results: GlobalSearchCallBackType[] = []
    if (!props.type || props.type == 'page') {
        results.push(...getPage(queryString))
    }

    // call callback function to return suggestions
    cb(results)
}

function handleSelect(item: GlobalSearchCallBackType) {
    if (loading.value) {
        return;
    }
    loading.value = true;
    if (item.router) {
        searchInput.value = ''
        router.push(item.router)
    } else {

        bibleTalkStore.getData(searchInput.value)
    }

    setTimeout(() => {
        loading.value = false
    }, 2000);

}

</script>