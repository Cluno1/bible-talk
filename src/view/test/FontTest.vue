<template>
    <h1>test</h1>
    <pre>{{ msg }}</pre>
</template>

<script setup lang="ts">
import { parseLrc } from '@/utils/lyrics'
import { ref } from 'vue'

const msg = ref('loading…')

/* 先不用 parseLrc，只测试能否拿到文本 */
fetch('/方的言-赵英俊-歌词.lrc')
    .then(r => {
        console.log('HTTP 状态码：', r.status, r.statusText)
        if (!r.ok) throw new Error('404 or other error')
        return r.text()
    })
    .then(raw => {
        console.log('拿到文本长度：', raw.length)
        msg.value = raw.slice(0, 200)   // 只显示前 200 字符，避免控制台爆掉
        const a = parseLrc(raw)
        if (a.length > 0) {
            console.log(a[0].text, a[0].time)
            console.log(a.toString())
        }

    })
    .catch(err => {
        console.error(err)
        msg.value = String(err)
    })
</script>