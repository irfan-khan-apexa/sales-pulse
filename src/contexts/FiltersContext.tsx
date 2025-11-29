import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface Filters {
  dateRange: 'last7' | 'last30' | 'last90' | 'custom';
  startDate?: string;
  endDate?: string;
  regionId?: string;
  areaId?: string;
  territoryId?: string;
  dsrId?: string;
  skuIds?: string[];
  channel?: 'GT' | 'MT' | 'Horeca';
  outletType?: string;
}

interface FiltersContextType {
  filters: Filters;
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  setFilters: (filters: Partial<Filters>) => void;
  resetFilters: () => void;
  getDateRange: () => { start: string; end: string };
}

const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

const DEFAULT_FILTERS: Filters = {
  dateRange: 'last30',
};

function parseFiltersFromParams(params: URLSearchParams): Partial<Filters> {
  const filters: Partial<Filters> = {};
  
  const dateRange = params.get('dateRange');
  if (dateRange && ['last7', 'last30', 'last90', 'custom'].includes(dateRange)) {
    filters.dateRange = dateRange as Filters['dateRange'];
  }
  
  const startDate = params.get('startDate');
  if (startDate) filters.startDate = startDate;
  
  const endDate = params.get('endDate');
  if (endDate) filters.endDate = endDate;
  
  const regionId = params.get('regionId');
  if (regionId) filters.regionId = regionId;
  
  const areaId = params.get('areaId');
  if (areaId) filters.areaId = areaId;
  
  const territoryId = params.get('territoryId');
  if (territoryId) filters.territoryId = territoryId;
  
  const dsrId = params.get('dsrId');
  if (dsrId) filters.dsrId = dsrId;
  
  const skuIds = params.get('skuIds');
  if (skuIds) filters.skuIds = skuIds.split(',');
  
  const channel = params.get('channel');
  if (channel && ['GT', 'MT', 'Horeca'].includes(channel)) {
    filters.channel = channel as Filters['channel'];
  }
  
  const outletType = params.get('outletType');
  if (outletType) filters.outletType = outletType;
  
  return filters;
}

function filtersToParams(filters: Filters): Record<string, string> {
  const params: Record<string, string> = {};
  
  if (filters.dateRange !== 'last30') params.dateRange = filters.dateRange;
  if (filters.startDate) params.startDate = filters.startDate;
  if (filters.endDate) params.endDate = filters.endDate;
  if (filters.regionId) params.regionId = filters.regionId;
  if (filters.areaId) params.areaId = filters.areaId;
  if (filters.territoryId) params.territoryId = filters.territoryId;
  if (filters.dsrId) params.dsrId = filters.dsrId;
  if (filters.skuIds?.length) params.skuIds = filters.skuIds.join(',');
  if (filters.channel) params.channel = filters.channel;
  if (filters.outletType) params.outletType = filters.outletType;
  
  return params;
}

export function FiltersProvider({ children }: { children: React.ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFiltersState] = useState<Filters>(() => ({
    ...DEFAULT_FILTERS,
    ...parseFiltersFromParams(searchParams),
  }));

  const setFilter = useCallback(<K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFiltersState(prev => ({ ...prev, [key]: value }));
  }, []);

  const setFilters = useCallback((newFilters: Partial<Filters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
  }, []);

  const getDateRange = useCallback(() => {
    const today = new Date();
    let start: Date;
    
    switch (filters.dateRange) {
      case 'last7':
        start = new Date(today);
        start.setDate(start.getDate() - 7);
        break;
      case 'last90':
        start = new Date(today);
        start.setDate(start.getDate() - 90);
        break;
      case 'custom':
        return {
          start: filters.startDate || today.toISOString().split('T')[0],
          end: filters.endDate || today.toISOString().split('T')[0],
        };
      case 'last30':
      default:
        start = new Date(today);
        start.setDate(start.getDate() - 30);
        break;
    }
    
    return {
      start: start.toISOString().split('T')[0],
      end: today.toISOString().split('T')[0],
    };
  }, [filters]);

  // Sync filters to URL
  useEffect(() => {
    const params = filtersToParams(filters);
    const newSearchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      newSearchParams.set(key, value);
    });
    setSearchParams(newSearchParams, { replace: true });
  }, [filters, setSearchParams]);

  return (
    <FiltersContext.Provider value={{ filters, setFilter, setFilters, resetFilters, getDateRange }}>
      {children}
    </FiltersContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FiltersContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FiltersProvider');
  }
  return context;
}
