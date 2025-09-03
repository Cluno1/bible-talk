export async function loadLrc(lrcUrl: string) {
  const res = await fetch(lrcUrl);
  if (!res.ok) throw new Error(`网络错误 ${res.status}`);
  // return parseLrc(await res.text());
  const a=parseLrcTest(await res.text());
  return a;
}

export function parseLrc(raw: string) {
  const result: { time: number; text: string }[] = [];

  raw.split(/\r?\n/).forEach((line) => {
    // 去掉首尾空白
    line = line.trim();
    if (!line) return;

    // 把这一行里所有时间戳一次性提出来
    const timeReg = /\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\]/g;
    let match;
    const times: number[] = [];

    while ((match = timeReg.exec(line)) !== null) {
      const [, m, s, ms] = match;
      const sec = +m * 60 + +s + (ms ? +ms.padEnd(3, "0") : 0) / 1000;
      times.push(sec);
    }

    // 去掉所有时间戳后剩下的文本
    const text = line.replace(timeReg, "").trim();
    if (!text) return;

    // 为每一个时间戳生成一条记录
    times.forEach((t) => result.push({ time: t, text }));
  });

  // 按时间升序
  return result.sort((a, b) => a.time - b.time);
}

export interface LrcLine {
  time: number;
  text: string;
  isMeta?: boolean;
}
export function parseLrcTest(raw: string): LrcLine[] {
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  /* ---------- 1. 收集元数据 ---------- */
  const metaMap: Partial<Record<"title" | "artist" | "album" | "by", string>> =
    {}; //一个对象
  lines.forEach((l) => {
    const m = l.match(/^\[([a-z]+):(.+?)\]$/i);
    if (!m) return;

    const [_, key, value] = m;
    switch (key.toLowerCase()) {
      case "ti":
        metaMap.title = value;
        break;
      case "ar":
        metaMap.artist = value;
        break;
      case "al":
        metaMap.album = value;
        break;
      case "by":
        metaMap.by = value;
        break;
    }
  });

  /* ---------- 2. 扫描歌词，找出首行时间 ---------- */
  const timeReg = /\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\]/g;
  let firstLyricTime = Infinity;

  const lyric: LrcLine[] = [];

  lines.forEach((l) => {
    if (/^\[[a-z]+:.+\]$/i.test(l)) return; // 跳过纯标签行

    timeReg.lastIndex = 0;
    const times: number[] = [];
    let match;
    while ((match = timeReg.exec(l)) !== null) {
      const [, m, s, ms] = match;
      const sec = +m * 60 + +s + (ms ? +ms.padEnd(3, "0") : 0) / 1000;
      times.push(sec);
    }

    const text = l.replace(timeReg, "").trim();
    if (!text || !times.length) return;

    times.forEach((t) => {
      lyric.push({ time: t, text });
      if (t < firstLyricTime) firstLyricTime = t;
    });
  });

  /* ---------- 3. 构建 meta ---------- */
  const metaTime = isFinite(firstLyricTime)
    ? Math.max(firstLyricTime - 0.01, 0)
    : 0;

  const lastTime = lyric.length
    ? Math.max(...lyric.map((l) => l.time)) + 1 // 最后再加 1 秒
    : 0;

  const meta: LrcLine[] = [];
  const order: (keyof typeof metaMap)[] = ["title", "artist", "album"];
  order.forEach((k) => {
    if (metaMap[k] != null) {
      meta.push({ time: metaTime, text: `${k}:${metaMap[k]}`, isMeta: true });
    }
  });

  if (metaMap.by != null) {
    meta.push({ time: lastTime, text: `by:${metaMap.by}`, isMeta: true }); //制作信息放最后
  }

  /* ---------- 4. 按时间排序 ---------- */

  return [...lyric, ...meta].sort((a, b) => a.time - b.time);
}

export function getInitLyrics(): { time: number; text: string }[] {
  return [
    {
      time: -1,
      text: "暂无歌词",
    },
  ];
}
