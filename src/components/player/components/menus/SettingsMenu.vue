<script setup lang="ts">
import type { MenuPlacement, TooltipPlacement } from 'vidstack';
import CaptionSubmenu from '../menus/CaptionSubmenu.vue';
import Menu from '../menus/Menu.vue';
import SpeedSubmenu from './SpeedSubmenu.vue';

const { placement, tooltipPlacement } = defineProps<{
  placement: MenuPlacement;
  tooltipPlacement: TooltipPlacement;
}>();
</script>

<template>
  <Menu :placement="placement" :tooltip-placement="tooltipPlacement">
    <template #button>
      <media-icon class="vds-rotate-icon" type="settings" />
    </template>
    <template #content>
      <CaptionSubmenu />
      <SpeedSubmenu/>
    </template>
    <template #tooltip-content>
      <span>Settings</span>
    </template>
  </Menu>
</template>
