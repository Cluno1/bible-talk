<template>
    <div>
        <div class="lg:hidden mb-10">
            <GlobalSearch />
        </div>
        <h1>Bible Talk</h1>
        <nav>
            <span>Topic: <router-link to="/bibleTalk/overview"><b>传福音 恩赐</b></router-link></span>
        </nav>
        <el-button @click="_han">get data</el-button>
    </div>
</template>

<script setup lang="ts">
import GlobalSearch from '@/components/GlobalSearch.vue';
import { useBibleTalkStore } from '@/store/bibleTalkStore';
import { useRouter } from 'vue-router';
const bibleTalkStore = useBibleTalkStore()

const router = useRouter()

function _han() {
    console.log(router.getRoutes(),'router before')
    bibleTalkStore.getData()
    console.log(router.getRoutes(),'router after')
}
</script>