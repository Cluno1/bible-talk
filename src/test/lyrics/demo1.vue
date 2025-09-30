<template>
    <h1>test</h1>
</template>

<script setup lang="ts">
import { parseLrcTest } from '@/utils/lyrics';
import { lyrisDemo } from '../music/lyris';

const a = parseLrcTest(lyrisDemo)

a.forEach(i => {
    console.log(i.time + " " + i.text)
})

</script>