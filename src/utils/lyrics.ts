export async function loadLrc(lrcUrl: string) {
  const res = await fetch(lrcUrl);
  if (!res.ok) throw new Error(`网络错误 ${res.status}`);
  return parseLrc(await res.text());
}

export function parseLrc(raw: string) {
  const result: { time: number; text: string }[] = []

  raw.split(/\r?\n/).forEach(line => {
    // 去掉首尾空白
    line = line.trim()
    if (!line) return

    // 把这一行里所有时间戳一次性提出来
    const timeReg = /\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\]/g
    let match
    const times: number[] = []

    while ((match = timeReg.exec(line)) !== null) {
      const [, m, s, ms] = match
      const sec = +m * 60 + +s + ((ms ? +ms.padEnd(3, '0') : 0) / 1000)
      times.push(sec)
    }

    // 去掉所有时间戳后剩下的文本
    const text = line.replace(timeReg, '').trim()
    if (!text) return

    // 为每一个时间戳生成一条记录
    times.forEach(t => result.push({ time: t, text }))
  })

  // 按时间升序
  return result.sort((a, b) => a.time - b.time)
}

export function getInitLyrics(): { time: number; text: string }[] {
  return [
    {
      time: -1,
      text: "暂无歌词",
    },
  ];
}
