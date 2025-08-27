<template>
  <div v-if="bibleTalkStore.data">
    <OverView :data="bibleTalkStore.data" />
  </div>
</template>

<script lang="ts" setup>
import OverView from '@/components/OverView.vue';
import { useBibleTalkStore } from '@/store/bibleTalkStore';

const bibleTalkStore = useBibleTalkStore()

</script>

<style></style>