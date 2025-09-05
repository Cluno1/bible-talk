<template>
  <media-radio
    class="ring-media-focus group relative flex w-full cursor-pointer select-none items-center justify-start rounded-sm p-2.5 outline-none data-[hocus]:bg-white/10 data-[focus]:ring-[3px]">
    <!-- <media-icon class="h-4 w-4 text-white group-data-[checked]:hidden" type="radio-button" />
    <media-icon
      class="text-media-brand hidden h-4 w-4 group-data-[checked]:block"
      type="radio-button-selected"
    /> -->

    <svg class="h-2 w-2 text-white " viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" />
    </svg>

    <!-- <svg class="h-2 w-2 text-media-brand hidden checked-icon" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" />
      <circle cx="12" cy="12" r="5" />
    </svg>   -->
    <span class="ml-2" data-part="label"></span>
  </media-radio>
</template>

