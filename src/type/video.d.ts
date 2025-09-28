import type { TextTrackInit } from "vidstack";
export interface VideoType {
  id: string;
  videoUrl: string; //URL
  title?: string; //标题
  albumId?: string; //隶属的专辑id
  describe?: string; //描述 添加作者或其他
  videoAlbumUrl?: string; /// webp格式  封面图片
  thumbnailsUrl?: string; //  vtt格式 点击进度条的缩略图
  /**
   * 
    src: , //字幕url  vtt格式
    label: 'English',  //字幕显示名称
    language: 'en-US',  //字幕标识
    kind: 'subtitles',   //类型, 'subtitles':是字幕 ; 'chapters':是章节题目
    default: true,      //一个字幕可以设置 默认,一个章节题目可以设置默认.不要多于一个
   */
  textTracks?: TextTrackInit[];
  meta?: any; //保留字段
}

export interface NetflixPaginationType {
  now?: number; // 当前页
  total?: number; // 总页数
  headPageHref?: string; // 首页
  lastPageHref?: string; // 上一页
  nextPageHref?: string; // 下一页
  tailPageHref?: string; // 尾页
}

export interface NetflixVideoCardType {
  videoPic?: string;
  score?: string; //评分
  remarks?: string; // 如: 更新到xx集  这样的信息
  title: string;
  href: string;
  meta?: {
    director?: string;
    roles?: string[];
    category?: string;
    region?: string;
    date?: string;  //发行的日期
    update?: string;  //更新时间
    introduction?: string; //简介
    other?: Array<{ key: string; val: string[] }>;
  };
  originSite?:SiteType;
  episodes?:netflixVideoEpisodeType;
}
/**
 * 单集结构
 */
export interface EpisodeItem {
  href?: string;
  player_url?:string;
  title: string;
}

/**
 * 剧集
 */
export interface netflixVideoEpisodeType {
  playerOrigin: string[]; // 所有播放源名称
  activePlayerOrigin?: string; // 当前选中的播放源
  activeEpisode?: EpisodeItem; // 当前选中的集数
  playerOriginEpisodeNum: number[]; // 每个源对应多少集
  playerOriginEpisodeList: EpisodeItem[][]; // 关键：直接是解析好的二维数组

}
//站源信息
export interface SiteType {
  api: string;
  name: string;
  detail?: string;
  selected: boolean;
  searchUrl?: string;
  detailUrl?: string; //剧集详情页接口  还没有视频   后面直接加 ..
  particularUrl?: string; //进入单独页面  必定有视频
}
