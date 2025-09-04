import type { BibleTalkDataType } from "@/type/page";

export const helpDoc: BibleTalkDataType = {
  id: "help",
  hasOverview: false,
  title: "Web Doc",
  subTitle: "网站说明",
  titleLeftColor: "#00BFFF",
  titleColor: "#FFFFFF",
  name: "Help",
  englishName: "help",
  icon: "CollectionTag",
  children: [
    {
      id: "help-1",
      title: "1. 介绍  ",
      subTitle: "introduction",
      titleLeftColor: "#32CD32",
      titleColor: "#FFFFFF",
      name: "introduction",
      icon: "CollectionTag",
      englishName: "introduction",
      content: [
        { paragraphs: "网站有两个主题:一个是**搜索**,一个是**隐私**" },
        {
          paragraphs:
            "搜索对应的ID,然后回车,你可以到达网站的任何一个角落,只要你懂得怎么搜索",
        },
        {
          paragraphs:
            "**隐私**,你只能搜索到你已知的ID,这个ID可能是写该文章的作者发给你的一串唯一字符,也可能是某首歌曲作者发给你的唯一标识",
        },
        { paragraphs: "但不管怎么样,前提是你已经知道该ID" },
        {
          paragraphs:
            "如果你点击搜索条你大致会看到**这几种提示标志**(如果你有的话):**'^page'**, **'!song'**, **'@album'**,**'%video'**",
        },
        {
          paragraphs: " ",
        },
        {
          paragraphs:
            "**'^page'**,这个标志的提示意味着他是一个页面,点击后你会跳转到对应的页面",
        },
        { paragraphs: "比如现在如果你打开搜索,第一个会看到'^page  home'" },
        { paragraphs: "如果你现在点击它,你会跳转到home页面" },
        {
          paragraphs:
            "当然,你还可以做到让一个页面不出现在你的视野里面,只要你输入'rm help'然后回车,就会看到本文档已经从你的菜单中消失了",
        },
        { paragraphs: "搜索也不会有'^page help'的提示了" },
        { paragraphs: "这对于喜欢极简主义的用户来说很适合" },
        { paragraphs: "你只需要搜索help然后回车又可以查看help文档了" },
        {
          paragraphs:
            "当然,如果你在尝试删除home页面,你会发现无论怎么努力都删除不它,因为home页面很基础,保留它是很重要的",
        },
        {
          paragraphs:
            "另外,你可以尝试搜索'setting'进入setting页面逛逛,一些奇奇怪怪的设置都会放该页面",
        },
        {
          paragraphs:
            "如果你希望快速找到某个页面,那么搜索'^'+对应的页面名称或页面唯一ID是个很好的途径,'^'意味着你只搜索页面",
        },
        {
          paragraphs: " ",
        },
        {
          paragraphs:
            "**'!song'**,这个标志的提示意味着他是一首歌曲,点击后会把该歌曲添加到你的播放列表,并且会自动跳转到播放器页面",
        },
        {
          paragraphs:
            "如果你搜索'方的言',它会将赵英俊的<<方的言>>加入到你的播放器,你就可以欣赏该歌曲了",
        },
        {
          paragraphs:
            "如果你搜索'old-man-sea',它会将ヨルシカ的<<老人と海>>加入到你的播放器,你就可以欣赏该歌曲了",
        },
        {
          paragraphs:
            "当然,输入'rm 方的言',<<方的言>>会彻底从你的播放列表,搜索提示里面消失",
        },
        { paragraphs: "如果它属于某一张专辑里面,也会在专辑里面删除" },
        {
          paragraphs:
            "(只是不在你的本地了,当然不能是真正的把数据删除,不然其他用户可就没有了)",
        },
        {
          paragraphs:
            "如果你希望快速找到某首歌曲,那么搜索'!'+对应的歌曲名称或歌曲唯一ID是个很好的途径,'!'意味着你只搜索歌曲",
        },
        {
          paragraphs: " ",
        },
        {
          paragraphs:
            "**'@album'**,这个标志的提示意味着他是一个专辑,点击后你会跳转到对应的专辑里面",
        },
        {
          paragraphs:
            "同时如果你已经知道一些专辑ID,搜索它,你会在首页看到该专辑,也会在搜索里面看到全部该专辑的歌曲的提示",
        },
        {
          paragraphs:
            "如果你希望快速找到某张专辑,那么搜索'@'+对应的专辑名称或专辑唯一ID是个很好的途径,'@'意味着你只搜索专辑",
        },
        {
          paragraphs: " ",
        },
        {
          paragraphs:
            "**'%video'**,这个标志的提示意味着他是一条视频,点击后会把该视频加入你的本地,并自动跳转到视频播放器）",
        },
        {
          paragraphs:
            "如果你搜索'守候',它会将赵英俊的《守候》的Live视频 加入到你的播放器,你就可以直接观看了",
        },
        {
          paragraphs:
            "如果你搜索'videodemo',它会将blender开源动画视频的《Sprite Fright》视频 加入到你的播放器.",
        },
        {
          paragraphs: "输入'rm 守候',该视频会从你的播放器里消失",
        },
        {
          paragraphs:
            "如果你希望**只搜视频**,用'%'+视频名称或唯一 ID 即可,例如'%Sprite Fright'",
        },
      ],
    },
    {
      id: "help-2",
      title: "2. 补充  ",
      subTitle: "End",
      titleLeftColor: "#32CD32",
      titleColor: "#FFFFFF",
      name: "End",
      englishName: "end",
      content: [
        {
          paragraphs: " Give back to live what is live's,and have a break~",
        },
      ],
    },
  ],
};
