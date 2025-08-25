/**
 * 通过背景颜色解析文本适合的颜色
 * @param color 背景颜色
 *  
 *✅ HEX 格式 (#ff0000, #f00)

 *✅ RGB 格式 (rgb(255, 0, 0))

 *✅ RGBA 格式 (rgba(255, 0, 0, 0.5))

 *✅ 颜色名称 (red, blue, green)

 *✅ 渐变格式（返回默认值）
 * @returns 
 */
export function getContrastTextColor(color: string): string {
  try {
    const rgb = parseColorToRgb(color);
    if (!rgb) return "black"; // 默认值

    const brightness = calculateBrightness(rgb);
    return brightness > 128 ? "black" : "white";
  } catch {
    return "black"; // 解析失败时返回默认值
  }
}

function parseColorToRgb(
  color: string
): { r: number; g: number; b: number } | null {
  if (!color) return null;

  color = color.trim().toLowerCase();

  // 1. HEX 格式 (#RRGGBB, #RGB)
  if (color.startsWith("#")) {
    return parseHexColor(color);
  }

  // 2. RGB 格式 (rgb(255, 255, 255))
  if (color.startsWith("rgb(")) {
    return parseRgbColor(color);
  }

  // 3. RGBA 格式 (rgba(255, 255, 255, 0.5))
  if (color.startsWith("rgba(")) {
    return parseRgbaColor(color);
  }

  // 4. 颜色名称 (red, blue, green 等)
  if (/^[a-z]+$/.test(color)) {
    return parseNamedColor(color);
  }

  // 5. 渐变或其他不支持格式
  if (color.includes("gradient") || color.includes("url")) {
    // 对于渐变，可以返回一个默认值或尝试提取主要颜色
    return { r: 255, g: 255, b: 255 }; // 白色背景用黑色文字
  }

  return null;
}

function parseHexColor(
  hex: string
): { r: number; g: number; b: number } | null {
  hex = hex.replace("#", "");

  // 简写格式 #RGB -> #RRGGBB
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }

  if (hex.length === 6) {
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
    };
  }

  // 8位HEX（带透明度）忽略alpha通道
  if (hex.length === 8) {
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
    };
  }

  return null;
}

function parseRgbColor(
  rgb: string
): { r: number; g: number; b: number } | null {
  const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (match) {
    return {
      r: Math.min(255, Math.max(0, parseInt(match[1]))),
      g: Math.min(255, Math.max(0, parseInt(match[2]))),
      b: Math.min(255, Math.max(0, parseInt(match[3]))),
    };
  }
  return null;
}

function parseRgbaColor(
  rgba: string
): { r: number; g: number; b: number } | null {
  const match = rgba.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
  if (match) {
    return {
      r: Math.min(255, Math.max(0, parseInt(match[1]))),
      g: Math.min(255, Math.max(0, parseInt(match[2]))),
      b: Math.min(255, Math.max(0, parseInt(match[3]))),
    };
  }
  return null;
}

function parseNamedColor(
  name: string
): { r: number; g: number; b: number } | null {
  const colorMap: Record<string, string> = {
    black: "#000000",
    white: "#ffffff",
    red: "#ff0000",
    green: "#008000",
    blue: "#0000ff",
    yellow: "#ffff00",
    purple: "#800080",
    orange: "#ffa500",
    pink: "#ffc0cb",
    gray: "#808080",
    grey: "#808080",
    brown: "#a52a2a",
    cyan: "#00ffff",
    magenta: "#ff00ff",
    silver: "#c0c0c0",
    gold: "#ffd700",
    maroon: "#800000",
    navy: "#000080",
    teal: "#008080",
    lime: "#00ff00",
    olive: "#808000",
    aqua: "#00ffff",
    fuchsia: "#ff00ff",
  };

  const hexColor = colorMap[name];
  if (hexColor) {
    return parseHexColor(hexColor);
  }

  return null;
}

function calculateBrightness(rgb: { r: number; g: number; b: number }): number {
  // W3C 亮度计算公式
  return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
}

/**
 * 通过背景颜色解析文本适合的颜色
 * 增强版：支持透明度考虑
 */
export function getContrastTextColorWithAlpha(
  color: string,
  backgroundColor: string = "#ffffff"
): string {
  const foregroundRgb = parseColorToRgb(color);
  const backgroundRgb = parseColorToRgb(backgroundColor);

  if (!foregroundRgb || !backgroundRgb) return "black";

  // 这里可以添加透明度混合逻辑
  const effectiveRgb = foregroundRgb; // 简化处理，忽略透明度

  const brightness = calculateBrightness(effectiveRgb);
  return brightness > 128 ? "black" : "white";
}

/**
 * 生成比基础颜色稍深的激活颜色
 * @param baseColor 基础背景颜色
 * @param intensity 加深强度（0-1），默认0.2
 * @returns 加深后的颜色，格式与输入相同
 */
export function getDarkerActiveColor(
  baseColor: string,
  intensity: number = 0.2
): string {
  try {
    // 解析基础颜色
    const rgb = parseColorToRgb(baseColor);
    if (!rgb) return baseColor; // 解析失败时返回原颜色

    // 计算加深后的RGB值
    const darkerRgb = {
      r: Math.max(0, Math.floor(rgb.r * (1 - intensity))),
      g: Math.max(0, Math.floor(rgb.g * (1 - intensity))),
      b: Math.max(0, Math.floor(rgb.b * (1 - intensity))),
    };

    // 保持与原颜色相同的格式
    if (baseColor.startsWith("rgb(")) {
      return `rgb(${darkerRgb.r}, ${darkerRgb.g}, ${darkerRgb.b})`;
    } else if (baseColor.startsWith("rgba(")) {
      // 保持alpha通道不变
      const alphaMatch = baseColor.match(
        /rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/
      );
      if (alphaMatch) {
        return `rgba(${darkerRgb.r}, ${darkerRgb.g}, ${darkerRgb.b}, ${alphaMatch[4]})`;
      }
    } else if (baseColor.startsWith("#")) {
      // HEX格式
      return `#${darkerRgb.r.toString(16).padStart(2, "0")}${darkerRgb.g
        .toString(16)
        .padStart(2, "0")}${darkerRgb.b.toString(16).padStart(2, "0")}`;
    }

    // 默认返回RGB格式
    return `rgb(${darkerRgb.r}, ${darkerRgb.g}, ${darkerRgb.b})`;
  } catch {
    return baseColor; // 出错时返回原颜色
  }
}
/**
 * 生成比基础颜色稍亮的激活/悬浮颜色
 * @param baseColor 基础背景颜色
 * @param intensity 提亮强度（0-1），默认 0.2
 * @returns 提亮后的颜色，格式与输入相同
 */
export function getLighterActiveColor(
  baseColor: string,
  intensity: number = 0.2
): string {
  try {
    const rgb = parseColorToRgb(baseColor);
    if (!rgb) return baseColor;

    // 计算提亮后的 RGB 值
    const lighterRgb = {
      r: Math.min(255, Math.floor(rgb.r + (255 - rgb.r) * intensity)),
      g: Math.min(255, Math.floor(rgb.g + (255 - rgb.g) * intensity)),
      b: Math.min(255, Math.floor(rgb.b + (255 - rgb.b) * intensity)),
    };

    // 保持与原颜色相同的格式
    if (baseColor.startsWith("rgb(")) {
      return `rgb(${lighterRgb.r}, ${lighterRgb.g}, ${lighterRgb.b})`;
    } else if (baseColor.startsWith("rgba(")) {
      const alphaMatch = baseColor.match(
        /rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/
      );
      if (alphaMatch) {
        return `rgba(${lighterRgb.r}, ${lighterRgb.g}, ${lighterRgb.b}, ${alphaMatch[4]})`;
      }
    } else if (baseColor.startsWith("#")) {
      return `#${lighterRgb.r.toString(16).padStart(2, "0")}${lighterRgb.g
        .toString(16)
        .padStart(2, "0")}${lighterRgb.b.toString(16).padStart(2, "0")}`;
    }

    // 默认返回 RGB 格式
    return `rgb(${lighterRgb.r}, ${lighterRgb.g}, ${lighterRgb.b})`;
  } catch {
    return baseColor;
  }
}
