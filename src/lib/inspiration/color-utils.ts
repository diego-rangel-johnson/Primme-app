export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : { r: 0, g: 0, b: 0 };
}

export function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((x) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, "0")).join("")}`;
}

export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const { r, g, b } = hexToRgb(hex);
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break;
      case gn: h = ((bn - rn) / d + 2) / 6; break;
      case bn: h = ((rn - gn) / d + 4) / 6; break;
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function hslToHex(h: number, s: number, l: number): string {
  const sn = s / 100;
  const ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = ln - c / 2;
  let r = 0, g = 0, b = 0;

  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }

  return rgbToHex(Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255));
}

export function getContrastColor(hex: string): "black" | "white" {
  const { r, g, b } = hexToRgb(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "black" : "white";
}

export function getComplementary(hex: string): string {
  const { h, s, l } = hexToHsl(hex);
  return hslToHex((h + 180) % 360, s, l);
}

export function getAnalogous(hex: string): [string, string] {
  const { h, s, l } = hexToHsl(hex);
  return [hslToHex((h + 30) % 360, s, l), hslToHex((h + 330) % 360, s, l)];
}

export function getTriadic(hex: string): [string, string] {
  const { h, s, l } = hexToHsl(hex);
  return [hslToHex((h + 120) % 360, s, l), hslToHex((h + 240) % 360, s, l)];
}

export function getSplitComplementary(hex: string): [string, string] {
  const { h, s, l } = hexToHsl(hex);
  return [hslToHex((h + 150) % 360, s, l), hslToHex((h + 210) % 360, s, l)];
}

export function generateMonochromatic(hex: string, count = 5): string[] {
  const { h, s } = hexToHsl(hex);
  const step = 80 / (count - 1);
  return Array.from({ length: count }, (_, i) => hslToHex(h, s, 10 + step * i));
}

export type HarmonyType = "complementary" | "analogous" | "triadic" | "split-complementary" | "monochromatic";

export function getHarmony(hex: string, type: HarmonyType): string[] {
  switch (type) {
    case "complementary":
      return [hex, getComplementary(hex)];
    case "analogous":
      return [getAnalogous(hex)[1], hex, getAnalogous(hex)[0]];
    case "triadic":
      return [hex, ...getTriadic(hex)];
    case "split-complementary":
      return [hex, ...getSplitComplementary(hex)];
    case "monochromatic":
      return generateMonochromatic(hex);
    default:
      return [hex];
  }
}
