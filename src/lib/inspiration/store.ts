import { FEED_ITEMS, PAINT_COLORS, COLOR_PALETTES, MOCK_MOODBOARDS } from "./seed-data";
import type {
  FeedItem,
  PaintColor,
  Moodboard,
  MoodboardItem,
  ColorPalette,
  RoomCategory,
  StyleTag,
  ColorFamily,
} from "./types";

const LS_BOARDS = "primme_moodboards";
const LS_SAVES = "primme_inspiration_saves";
const LS_PALETTES = "primme_color_palettes";

function readLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLS<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

// ── Feed ──
export function getFeedItems(filters?: {
  category?: RoomCategory;
  style?: StyleTag;
  type?: FeedItem["type"];
  search?: string;
  page?: number;
  pageSize?: number;
}): { items: FeedItem[]; total: number; hasMore: boolean } {
  let items = [...FEED_ITEMS];

  if (filters?.category) {
    items = items.filter((i) => i.category === filters.category);
  }
  if (filters?.style) {
    items = items.filter((i) => i.style === filters.style);
  }
  if (filters?.type) {
    items = items.filter((i) => i.type === filters.type);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    items = items.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.tags.some((t) => t.includes(q)) ||
        i.description?.toLowerCase().includes(q) ||
        i.color?.name.toLowerCase().includes(q)
    );
  }

  const total = items.length;
  const page = filters?.page ?? 1;
  const pageSize = filters?.pageSize ?? 12;
  const start = (page - 1) * pageSize;
  const paged = items.slice(start, start + pageSize);

  return { items: paged, total, hasMore: start + pageSize < total };
}

export function getFeedItem(id: string): FeedItem | undefined {
  return FEED_ITEMS.find((i) => i.id === id);
}

// ── Moodboards ──
export function getMoodboards(): Moodboard[] {
  return readLS<Moodboard[]>(LS_BOARDS, MOCK_MOODBOARDS);
}

export function getMoodboard(id: string): Moodboard | undefined {
  return getMoodboards().find((b) => b.id === id);
}

export function createMoodboard(title: string, description = ""): Moodboard {
  const boards = getMoodboards();
  const board: Moodboard = {
    id: `board-${Date.now()}`,
    userId: "usr_client_1",
    title,
    description,
    coverImageUrl: "",
    isPublic: false,
    items: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  boards.unshift(board);
  writeLS(LS_BOARDS, boards);
  return board;
}

export function updateMoodboard(id: string, updates: Partial<Moodboard>): Moodboard | null {
  const boards = getMoodboards();
  const idx = boards.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  boards[idx] = { ...boards[idx], ...updates, updatedAt: new Date().toISOString() };
  writeLS(LS_BOARDS, boards);
  return boards[idx];
}

export function deleteMoodboard(id: string): boolean {
  const boards = getMoodboards();
  const filtered = boards.filter((b) => b.id !== id);
  if (filtered.length === boards.length) return false;
  writeLS(LS_BOARDS, filtered);
  return true;
}

export function addItemToMoodboard(boardId: string, item: Omit<MoodboardItem, "id" | "moodboardId" | "createdAt">): MoodboardItem | null {
  const boards = getMoodboards();
  const idx = boards.findIndex((b) => b.id === boardId);
  if (idx === -1) return null;
  const newItem: MoodboardItem = {
    ...item,
    id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    moodboardId: boardId,
    createdAt: new Date().toISOString(),
  };
  boards[idx].items.push(newItem);
  boards[idx].updatedAt = new Date().toISOString();
  writeLS(LS_BOARDS, boards);
  return newItem;
}

export function updateMoodboardItem(boardId: string, itemId: string, updates: Partial<MoodboardItem>): boolean {
  const boards = getMoodboards();
  const boardIdx = boards.findIndex((b) => b.id === boardId);
  if (boardIdx === -1) return false;
  const itemIdx = boards[boardIdx].items.findIndex((i) => i.id === itemId);
  if (itemIdx === -1) return false;
  boards[boardIdx].items[itemIdx] = { ...boards[boardIdx].items[itemIdx], ...updates };
  boards[boardIdx].updatedAt = new Date().toISOString();
  writeLS(LS_BOARDS, boards);
  return true;
}

export function removeItemFromMoodboard(boardId: string, itemId: string): boolean {
  const boards = getMoodboards();
  const boardIdx = boards.findIndex((b) => b.id === boardId);
  if (boardIdx === -1) return false;
  boards[boardIdx].items = boards[boardIdx].items.filter((i) => i.id !== itemId);
  boards[boardIdx].updatedAt = new Date().toISOString();
  writeLS(LS_BOARDS, boards);
  return true;
}

// ── Saves ──
export function getSavedFeedIds(): Set<string> {
  return new Set(readLS<string[]>(LS_SAVES, []));
}

export function toggleSaveFeedItem(feedItemId: string): boolean {
  const saves = readLS<string[]>(LS_SAVES, []);
  const idx = saves.indexOf(feedItemId);
  if (idx >= 0) {
    saves.splice(idx, 1);
    writeLS(LS_SAVES, saves);
    return false;
  }
  saves.push(feedItemId);
  writeLS(LS_SAVES, saves);
  return true;
}

// ── Colors ──
export function getPaintColors(filters?: {
  brand?: PaintColor["brand"];
  family?: ColorFamily;
  search?: string;
}): PaintColor[] {
  let colors = [...PAINT_COLORS];
  if (filters?.brand) colors = colors.filter((c) => c.brand === filters.brand);
  if (filters?.family) colors = colors.filter((c) => c.family === filters.family);
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    colors = colors.filter(
      (c) => c.name.toLowerCase().includes(q) || c.hex.toLowerCase().includes(q) || c.brandDisplayName.toLowerCase().includes(q)
    );
  }
  return colors;
}

export function getPaintColor(id: string): PaintColor | undefined {
  return PAINT_COLORS.find((c) => c.id === id);
}

// ── Palettes ──
export function getColorPalettes(): ColorPalette[] {
  const custom = readLS<ColorPalette[]>(LS_PALETTES, []);
  return [...custom, ...COLOR_PALETTES];
}

export function saveColorPalette(palette: Omit<ColorPalette, "id" | "createdAt">): ColorPalette {
  const palettes = readLS<ColorPalette[]>(LS_PALETTES, []);
  const newPal: ColorPalette = {
    ...palette,
    id: `pal-custom-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  palettes.unshift(newPal);
  writeLS(LS_PALETTES, palettes);
  return newPal;
}

export function deleteColorPalette(id: string): boolean {
  const palettes = readLS<ColorPalette[]>(LS_PALETTES, []);
  const filtered = palettes.filter((p) => p.id !== id);
  if (filtered.length === palettes.length) return false;
  writeLS(LS_PALETTES, filtered);
  return true;
}
