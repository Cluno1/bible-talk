<script setup lang="ts">
import MenuRadio from './MenuRadio.vue';
import Submenu from './Submenu.vue';
</script>

<template>
    <Submenu label="Speed">
        <template #icon>
            <media-icon class="h-5 w-5" type="odometer" />
        </template>
        <template #content>
            <media-speed-radio-group class="w-full flex flex-col">
                <template>
                    <MenuRadio />
                </template>
            </media-speed-radio-group>
        </template>
    </Submenu>
</template>
