export interface Moodboard {
  id: string;
  userId: string;
  title: string;
  description: string;
  coverImageUrl: string;
  isPublic: boolean;
  items: MoodboardItem[];
  createdAt: string;
  updatedAt: string;
}

export interface MoodboardItem {
  id: string;
  moodboardId: string;
  type: "image" | "color" | "text" | "note";
  content: MoodboardItemContent;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  zIndex: number;
  createdAt: string;
}

export type MoodboardItemContent =
  | { src: string; alt?: string }
  | { hex: string; name?: string; brand?: string }
  | { text: string }
  | { note: string };

export interface FeedItem {
  id: string;
  type: "room" | "color" | "texture" | "finish";
  title: string;
  description?: string;
  imageUrl: string;
  category: RoomCategory;
  style: StyleTag;
  tags: string[];
  color?: { hex: string; name: string; brand?: string };
  savedCount: number;
}

export type RoomCategory =
  | "living-room"
  | "kitchen"
  | "bedroom"
  | "bathroom"
  | "exterior"
  | "office"
  | "dining-room"
  | "hallway";

export type StyleTag =
  | "modern"
  | "traditional"
  | "coastal"
  | "industrial"
  | "scandinavian"
  | "art-deco"
  | "farmhouse"
  | "minimalist"
  | "bohemian"
  | "mid-century"
  | "contemporary"
  | "rustic";

export interface PaintColor {
  id: string;
  hex: string;
  name: string;
  brand: "sherwin-williams" | "benjamin-moore" | "farrow-ball" | "behr";
  brandDisplayName: string;
  lrv: number;
  family: ColorFamily;
  rgb: { r: number; g: number; b: number };
}

export type ColorFamily =
  | "white"
  | "gray"
  | "beige"
  | "brown"
  | "black"
  | "blue"
  | "green"
  | "red"
  | "orange"
  | "yellow"
  | "purple"
  | "pink"
  | "teal";

export interface ColorPalette {
  id: string;
  userId?: string;
  name: string;
  colors: string[];
  sourceImageUrl?: string;
  style?: StyleTag;
  createdAt: string;
}

export interface VisualizerSession {
  id: string;
  userId: string;
  originalImageUrl: string;
  selectedColors: PaintColor[];
  results: VisualizerResult[];
  createdAt: string;
}

export interface VisualizerResult {
  id: string;
  color: PaintColor;
  resultImageUrl: string;
  createdAt: string;
}

export interface InspirationSave {
  id: string;
  userId: string;
  feedItemId: string;
  moodboardId?: string;
  createdAt: string;
}
