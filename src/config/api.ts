// API Configuration - Switch between mock and real APIs
export const API_CONFIG = {
  USE_MOCKS: true,
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  METABASE_EMBED_URL: import.meta.env.VITE_METABASE_EMBED_URL || '',
  USE_METABASE_EMBED: false,
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
};

export type UserRole = 'RSM' | 'ASM' | 'TSM' | 'SO' | 'DSR';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  regionId?: string;
  areaId?: string;
  territoryId?: string;
  dsrId?: string;
}

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  RSM: 5,
  ASM: 4,
  TSM: 3,
  SO: 2,
  DSR: 1,
};

export const ROLE_LABELS: Record<UserRole, string> = {
  RSM: 'Regional Sales Manager',
  ASM: 'Area Sales Manager',
  TSM: 'Territory Sales Manager',
  SO: 'Sales Officer',
  DSR: 'Distribution Sales Representative',
};
