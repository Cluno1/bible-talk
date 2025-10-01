/*
 * @Date: 2025-10-01 14:25:02
 * @LastEditors: zld 17875477802@163.com
 * @LastEditTime: 2025-10-01 14:25:49
 * @FilePath: \bible-talk\src\utils\audioutls.ts
 */
/**
 * 浏览器 <video> 标签原生支持的音频 MIME 类型
 * 来源：WHATWG + MDN 实测（Chrome/Firefox/Safari/Edge 2025-Q3）
 */
export const AUDIO_MIME_TYPES = [
    'audio/mp4',             // AAC in MP4
    'audio/m4a',             // 同上，只是后缀不同
    'audio/mp3',
    'audio/mpeg',
    'audio/ogg',
    'audio/opus',
    'audio/wav',
    'audio/wave',
    'audio/x-wav',
    'audio/webm',            // Vorbis/Opus in WebM
    'audio/flac',            // 主流浏览器已原生支持
    'audio/aac',
    'audio/x-m4a',           // iOS 低版本兼容
  ] as const;
  
  /**
   * 常见音频文件后缀（补漏用，防止 MIME 没给）
   */
  const AUDIO_EXT = /\.(mp3|m4a|aac|ogg|opus|wav|flac|webm|mp4)$/i;
  
  /**
   * 判断 url 是否像一条可直接被 <video> 播放的音频直链
   * 注意：这是「最佳猜测」，非 100% 保证。
   */
  export function isAudioUrl(url: string): boolean {
    if (typeof url !== 'string') return false;
  
    try {
      const { pathname, searchParams } = new URL(url);
  
      // 1. 优先看后缀
      if (AUDIO_EXT.test(pathname)) return true;
  
      // 2. 再看查询参数里有没有 mime/type
      const mime = searchParams.get('mime') || searchParams.get('type');
      if (mime && AUDIO_MIME_TYPES.includes(mime as any)) return true;
  
      // 3. 兜底：把 .mp4 等视频容器也放过，但要求参数显式标记为音频
      if (pathname.endsWith('.mp4') && mime?.startsWith('audio/')) return true;
  
      return false;
    } catch {
      // 非法 URL
      return false;
    }
  }
  