import type { TextTrackInit } from 'vidstack';
export interface VideoType {
  id:string,
  videoUrl:string,  //URL
  title?:string,    //标题
  describe?:string, //描述 添加作者或其他
  videoAlbumUrl?:string,  /// webp格式  封面图片
  thumbnailsUrl?:string, //  vtt格式 点击进度条的缩略图
  /**
   * 
    src: , //字幕url  vtt格式
    label: 'English',  //字幕显示名称
    language: 'en-US',  //字幕标识
    kind: 'subtitles',   //类型, 'subtitles':是字幕 ; 'chapters':是章节题目
    default: true,      //一个字幕可以设置 默认,一个章节题目可以设置默认.不要多于一个
   */
  textTracks?: TextTrackInit[],
  meta?:any,//保留字段
}