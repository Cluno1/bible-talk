<template>
  <Article
    title="The important of Evangelization"
    sub-title="传福音的重要性"
    :sections="sections"
    :reference="reference"
  />
</template>

<script setup lang="ts">
import Article from '@/components/Article.vue'

/* 把注释里的 4 个要点直接变成 4 个 section */
const sections = [
  {
    title: '1. 传福音是我们的特权',
    paragraphs: [
      '其他人或老师传授的知识不叫传福音，而是叫传授观点或技巧.',
      '福音和神相关，曾经领受过，并且现在行出来的才能传福音。',
      '结果子是我们的特权：',
      '“你们多结果子，我父就因此得荣耀，你们也就是我的门徒了。”（约翰福音 15:8）'
    ]
  },
  {
    title: '2. 耶稣基督的命令',
    paragraphs: [
      '“你们要把我的道，把福音传遍地极，使万民做我的门徒。”（马太福音 28:19-20）',
      '“照经上所写的，基督必受害，第三日从死里复活，并且人要奉他的名传悔改、赦罪的道，从耶路撒冷起直传到万邦。你们就是这些事的见证。”（路加福音 24:46-48）',
      '“我已经立你作外邦人的光，叫你施行救恩，直到地极。”（使徒行传 13:47）'
    ]
  },
  {
    title: '3. 神的爱激励我们',
    paragraphs: [
      '传福音因为圣灵借着基督的爱激励我们，使我们没有可能不过一个传福音的生活。'
    ]
  },
  {
    title: '4. 人的需要',
    paragraphs: [
      '“世人都犯了罪，亏缺了神的荣耀。”（罗马书 3:23）',
      '“你们活在世上没有神，没有指望，没有生命。”（以弗所书 2:12；4:19）'
    ]
  }
]

/* 如果没有别的引用，可删掉 reference；或保留原链接 */
const reference = {
  text: ' 唐崇荣:为什么要传福音？',
  link: 'https://shengchengnet.com/Article/ShowArticle.asp?ArticleID=275'
}
</script>