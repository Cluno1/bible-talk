<template>
 
    <div class="w-full aspect-video">
      <iframe :src="data.videoUrl" class="w-full h-full rounded-lg" frameborder="0" allowfullscreen />
    </div>
  
</template>

<script setup lang="ts">
import type { VideoType } from '@/type/video';

/* ---------- props & store ---------- */
defineProps<{ data: VideoType }>()

</script>



