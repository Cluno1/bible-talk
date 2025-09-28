import type { NetflixVideoCardType } from "@/type/video";
import { defineStore } from "pinia";
import { ref } from "vue";

export const usefilmStore = defineStore("filmStore", () => {
  const filmCard = ref<NetflixVideoCardType>({
        title: '',
        href: ''
    });

  return {
    filmCard,
  };
});
