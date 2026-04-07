import type { RoomCategory, StyleTag } from "./types";

// ── Material ──

export type MaterialCategory =
  | "paint"
  | "tile"
  | "countertop"
  | "fixture"
  | "hardware"
  | "flooring"
  | "lighting"
  | "cabinetry";

export interface Material {
  id: string;
  providerId: string;
  name: string;
  brand: string;
  category: MaterialCategory;
  imageUrl: string;
  specs: Record<string, string>;
  pricePerUnit: number;
  unit: string;
  isFavorite: boolean;
  tags: string[];
}

export interface MaterialBundle {
  id: string;
  providerId: string;
  name: string;
  description: string;
  materialIds: string[];
  totalPrice: number;
  category: RoomCategory;
  createdAt: string;
}

// ── Portfolio ──

export interface MaterialReference {
  materialId: string;
  name: string;
  brand: string;
  quantity: number;
  unit: string;
}

export interface PortfolioProject {
  id: string;
  providerId: string;
  title: string;
  description: string;
  beforeImageUrl: string;
  afterImageUrl: string;
  category: RoomCategory;
  style: StyleTag;
  tags: string[];
  materials: MaterialReference[];
  scope: string;
  budget: { min: number; max: number };
  duration: string;
  sqft: number;
  isPublic: boolean;
  viewCount: number;
  saveCount: number;
  createdAt: string;
}

// ── Assessment ──

export type AssessmentStatus = "draft" | "in_progress" | "complete" | "sent";

export type ScopeCategory = "preparation" | "materials" | "labor" | "finishing";

export type PhotoCategory = "before" | "during" | "detail" | "issue";

export type UrgencyLevel = "low" | "normal" | "high" | "urgent";

export interface ScopeItem {
  id: string;
  description: string;
  category: ScopeCategory;
  estimatedCost: { min: number; max: number };
  materialQty: number;
  materialUnit: string;
  isIncluded: boolean;
}

export interface SitePhoto {
  id: string;
  url: string;
  category: PhotoCategory;
  caption?: string;
}

export interface PricingLineItem {
  id: string;
  scopeItemId: string;
  description: string;
  materialCost: number;
  laborHours: number;
  laborRate: number;
  subtotal: number;
}

export interface PricingBreakdown {
  lineItems: PricingLineItem[];
  materialTotal: number;
  laborTotal: number;
  subtotal: number;
  profitMargin: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
}

export interface Assessment {
  id: string;
  providerId: string;
  title: string;
  clientName: string;
  address: string;
  roomType: RoomCategory;
  estimatedSqft: number;
  projectDescription: string;
  urgency: UrgencyLevel;
  sitePhotos: SitePhoto[];
  fieldNotes: string;
  visitDate: string;
  visitCompleted: boolean;
  imageUrls: string[];
  condition: "excellent" | "good" | "fair" | "poor";
  conditionNotes: string[];
  scopeItems: ScopeItem[];
  totalEstimate: { min: number; max: number };
  materialRecommendations: {
    name: string;
    brand: string;
    quantity: number;
    unit: string;
    unitPrice: number;
  }[];
  pricing: PricingBreakdown | null;
  status: AssessmentStatus;
  createdAt: string;
  updatedAt: string;
}

// ── Proposal ──

export type ProposalStatus = "draft" | "sent" | "viewed" | "accepted" | "declined";
export type ProposalTemplate = "minimal" | "premium" | "detailed";

export type ProposalBlockType =
  | "before-after"
  | "materials"
  | "palette"
  | "timeline"
  | "cost"
  | "text";

export interface ProposalBlock {
  id: string;
  type: ProposalBlockType;
  order: number;
  data: Record<string, unknown>;
}

export interface Proposal {
  id: string;
  providerId: string;
  clientName: string;
  projectTitle: string;
  template: ProposalTemplate;
  blocks: ProposalBlock[];
  totalCost: number;
  status: ProposalStatus;
  sentAt?: string;
  viewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Trends ──

export interface StyleTrend {
  style: StyleTag;
  searches: number;
  change: number; // percentage change
}

export interface CategoryDemand {
  category: RoomCategory;
  label: string;
  projects: number;
  avgBudget: number;
  change: number;
}

export interface PriceBenchmark {
  category: RoomCategory;
  label: string;
  avgPrice: number;
  yourPrice: number;
  minPrice: number;
  maxPrice: number;
}

export interface TrendData {
  styleTrends: StyleTrend[];
  popularColors: { hex: string; name: string; saves: number }[];
  categoryDemand: CategoryDemand[];
  priceBenchmarks: PriceBenchmark[];
  seasonalHighlight: {
    season: string;
    topCategory: string;
    description: string;
  };
}
