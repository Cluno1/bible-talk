
import { MusicType,MusicAlbum } from "./music"
/**               类型定义       */
export type GlobalSearchCallBackType = {
    value: string | number,
    router?: string,//页面路由 的路由 /home
    musicAlbum?: MusicAlbum,
    song?: MusicType,
    //other ...
}
