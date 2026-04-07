import {
  MOCK_PORTFOLIO,
  MOCK_ASSESSMENTS,
  MOCK_PROPOSALS,
  MOCK_MATERIALS,
  MOCK_MATERIAL_BUNDLES,
  MOCK_TREND_DATA,
} from "./provider-seed-data";
import type {
  PortfolioProject,
  Assessment,
  Proposal,
  Material,
  MaterialBundle,
  MaterialCategory,
  TrendData,
} from "./provider-types";
import type { RoomCategory, StyleTag } from "./types";

const LS_PORTFOLIO = "primme_provider_portfolio";
const LS_ASSESSMENTS = "primme_provider_assessments";
const LS_PROPOSALS = "primme_provider_proposals";
const LS_MATERIALS = "primme_provider_materials";
const LS_BUNDLES = "primme_provider_bundles";

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

// ── Portfolio ──

export function getPortfolioProjects(filters?: {
  category?: RoomCategory;
  style?: StyleTag;
  search?: string;
}): PortfolioProject[] {
  let projects = readLS<PortfolioProject[]>(LS_PORTFOLIO, MOCK_PORTFOLIO);
  if (filters?.category) projects = projects.filter((p) => p.category === filters.category);
  if (filters?.style) projects = projects.filter((p) => p.style === filters.style);
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    projects = projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q))
    );
  }
  return projects;
}

export function getPortfolioProject(id: string): PortfolioProject | undefined {
  return readLS<PortfolioProject[]>(LS_PORTFOLIO, MOCK_PORTFOLIO).find((p) => p.id === id);
}

export function createPortfolioProject(
  project: Omit<PortfolioProject, "id" | "providerId" | "viewCount" | "saveCount" | "createdAt">
): PortfolioProject {
  const projects = readLS<PortfolioProject[]>(LS_PORTFOLIO, MOCK_PORTFOLIO);
  const newProject: PortfolioProject = {
    ...project,
    id: `port-${Date.now()}`,
    providerId: "usr_provider_1",
    viewCount: 0,
    saveCount: 0,
    createdAt: new Date().toISOString(),
  };
  projects.unshift(newProject);
  writeLS(LS_PORTFOLIO, projects);
  return newProject;
}

export function updatePortfolioProject(id: string, updates: Partial<PortfolioProject>): PortfolioProject | null {
  const projects = readLS<PortfolioProject[]>(LS_PORTFOLIO, MOCK_PORTFOLIO);
  const idx = projects.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  projects[idx] = { ...projects[idx], ...updates };
  writeLS(LS_PORTFOLIO, projects);
  return projects[idx];
}

export function deletePortfolioProject(id: string): boolean {
  const projects = readLS<PortfolioProject[]>(LS_PORTFOLIO, MOCK_PORTFOLIO);
  const filtered = projects.filter((p) => p.id !== id);
  if (filtered.length === projects.length) return false;
  writeLS(LS_PORTFOLIO, filtered);
  return true;
}

// ── Assessments ──

export function getAssessments(filters?: {
  status?: Assessment["status"];
  search?: string;
}): Assessment[] {
  let assessments = readLS<Assessment[]>(LS_ASSESSMENTS, MOCK_ASSESSMENTS);
  if (filters?.status) assessments = assessments.filter((a) => a.status === filters.status);
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    assessments = assessments.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.clientName.toLowerCase().includes(q) ||
        a.address.toLowerCase().includes(q)
    );
  }
  return assessments;
}

export function getAssessment(id: string): Assessment | undefined {
  return readLS<Assessment[]>(LS_ASSESSMENTS, MOCK_ASSESSMENTS).find((a) => a.id === id);
}

export function createAssessment(assessment: Omit<Assessment, "id" | "providerId" | "createdAt" | "updatedAt">): Assessment {
  const assessments = readLS<Assessment[]>(LS_ASSESSMENTS, MOCK_ASSESSMENTS);
  const now = new Date().toISOString();
  const newAssessment: Assessment = {
    ...assessment,
    id: `assess-${Date.now()}`,
    providerId: "usr_provider_1",
    createdAt: now,
    updatedAt: now,
  };
  assessments.unshift(newAssessment);
  writeLS(LS_ASSESSMENTS, assessments);
  return newAssessment;
}

export function updateAssessment(id: string, updates: Partial<Assessment>): Assessment | null {
  const assessments = readLS<Assessment[]>(LS_ASSESSMENTS, MOCK_ASSESSMENTS);
  const idx = assessments.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  assessments[idx] = { ...assessments[idx], ...updates, updatedAt: new Date().toISOString() };
  writeLS(LS_ASSESSMENTS, assessments);
  return assessments[idx];
}

export function deleteAssessment(id: string): boolean {
  const assessments = readLS<Assessment[]>(LS_ASSESSMENTS, MOCK_ASSESSMENTS);
  const filtered = assessments.filter((a) => a.id !== id);
  if (filtered.length === assessments.length) return false;
  writeLS(LS_ASSESSMENTS, filtered);
  return true;
}

// ── Proposals ──

export function getProposals(): Proposal[] {
  return readLS<Proposal[]>(LS_PROPOSALS, MOCK_PROPOSALS);
}

export function getProposal(id: string): Proposal | undefined {
  return getProposals().find((p) => p.id === id);
}

export function createProposal(proposal: Omit<Proposal, "id" | "providerId" | "createdAt" | "updatedAt">): Proposal {
  const proposals = getProposals();
  const now = new Date().toISOString();
  const newProposal: Proposal = {
    ...proposal,
    id: `prop-${Date.now()}`,
    providerId: "usr_provider_1",
    createdAt: now,
    updatedAt: now,
  };
  proposals.unshift(newProposal);
  writeLS(LS_PROPOSALS, proposals);
  return newProposal;
}

export function updateProposal(id: string, updates: Partial<Proposal>): Proposal | null {
  const proposals = getProposals();
  const idx = proposals.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  proposals[idx] = { ...proposals[idx], ...updates, updatedAt: new Date().toISOString() };
  writeLS(LS_PROPOSALS, proposals);
  return proposals[idx];
}

export function deleteProposal(id: string): boolean {
  const proposals = getProposals();
  const filtered = proposals.filter((p) => p.id !== id);
  if (filtered.length === proposals.length) return false;
  writeLS(LS_PROPOSALS, filtered);
  return true;
}

// ── Materials ──

export function getMaterials(filters?: {
  category?: MaterialCategory;
  search?: string;
  favoritesOnly?: boolean;
}): Material[] {
  let materials = readLS<Material[]>(LS_MATERIALS, MOCK_MATERIALS);
  if (filters?.category) materials = materials.filter((m) => m.category === filters.category);
  if (filters?.favoritesOnly) materials = materials.filter((m) => m.isFavorite);
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    materials = materials.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.brand.toLowerCase().includes(q) ||
        m.tags.some((t) => t.includes(q))
    );
  }
  return materials;
}

export function getMaterial(id: string): Material | undefined {
  return readLS<Material[]>(LS_MATERIALS, MOCK_MATERIALS).find((m) => m.id === id);
}

export function createMaterial(material: Omit<Material, "id" | "providerId">): Material {
  const materials = readLS<Material[]>(LS_MATERIALS, MOCK_MATERIALS);
  const newMaterial: Material = {
    ...material,
    id: `mat-${Date.now()}`,
    providerId: "usr_provider_1",
  };
  materials.unshift(newMaterial);
  writeLS(LS_MATERIALS, materials);
  return newMaterial;
}

export function updateMaterial(id: string, updates: Partial<Material>): Material | null {
  const materials = readLS<Material[]>(LS_MATERIALS, MOCK_MATERIALS);
  const idx = materials.findIndex((m) => m.id === id);
  if (idx === -1) return null;
  materials[idx] = { ...materials[idx], ...updates };
  writeLS(LS_MATERIALS, materials);
  return materials[idx];
}

export function toggleMaterialFavorite(id: string): boolean {
  const materials = readLS<Material[]>(LS_MATERIALS, MOCK_MATERIALS);
  const idx = materials.findIndex((m) => m.id === id);
  if (idx === -1) return false;
  materials[idx].isFavorite = !materials[idx].isFavorite;
  writeLS(LS_MATERIALS, materials);
  return materials[idx].isFavorite;
}

export function deleteMaterial(id: string): boolean {
  const materials = readLS<Material[]>(LS_MATERIALS, MOCK_MATERIALS);
  const filtered = materials.filter((m) => m.id !== id);
  if (filtered.length === materials.length) return false;
  writeLS(LS_MATERIALS, filtered);
  return true;
}

// ── Material Bundles ──

export function getMaterialBundles(): MaterialBundle[] {
  return readLS<MaterialBundle[]>(LS_BUNDLES, MOCK_MATERIAL_BUNDLES);
}

// ── Trends ──

export function getTrendData(): TrendData {
  return MOCK_TREND_DATA;
}
