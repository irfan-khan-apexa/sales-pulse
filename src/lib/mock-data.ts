// Mock Data for FMCG Sales Analytics
import { UserRole } from '@/config/api';

export interface Region {
  id: string;
  name: string;
  areas: Area[];
}

export interface Area {
  id: string;
  name: string;
  regionId: string;
  territories: Territory[];
}

export interface Territory {
  id: string;
  name: string;
  areaId: string;
  dsrs: DSR[];
}

export interface DSR {
  id: string;
  name: string;
  phone: string;
  territoryId: string;
  outlets: number;
  revenue: number;
  target: number;
  lastActive: string;
}

export interface Outlet {
  id: string;
  name: string;
  address: string;
  channel: 'GT' | 'MT' | 'Horeca';
  type: 'Kirana' | 'Supermarket' | 'Restaurant' | 'Hotel';
  dsrId: string;
  lastPurchaseDate: string;
  totalRevenue: number;
  isLapsed: boolean;
  contactPhone: string;
  skus: string[];
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
}

export interface SalesData {
  date: string;
  revenue: number;
  quantity: number;
  forecast?: number;
}

export interface Alert {
  id: string;
  severity: 'red' | 'orange' | 'green';
  title: string;
  description: string;
  entityType: 'region' | 'area' | 'territory' | 'dsr' | 'outlet' | 'product';
  entityId: string;
  timestamp: string;
}

export interface KPIData {
  revenueMTD: number;
  revenueTarget: number;
  targetPercent: number;
  avgSellingPrice: number;
  penetrationPercent: number;
  outletsCount: number;
  activeOutlets: number;
  lapsedOutlets: number;
  previousRevenueMTD: number;
}

// Mock Regions, Areas, Territories
export const mockRegions: Region[] = [
  {
    id: 'R1',
    name: 'North Region',
    areas: [
      {
        id: 'A1',
        name: 'Delhi NCR',
        regionId: 'R1',
        territories: [
          { id: 'T1', name: 'Central Delhi', areaId: 'A1', dsrs: [] },
          { id: 'T2', name: 'South Delhi', areaId: 'A1', dsrs: [] },
          { id: 'T3', name: 'Gurgaon', areaId: 'A1', dsrs: [] },
        ],
      },
      {
        id: 'A2',
        name: 'UP West',
        regionId: 'R1',
        territories: [
          { id: 'T4', name: 'Noida', areaId: 'A2', dsrs: [] },
          { id: 'T5', name: 'Ghaziabad', areaId: 'A2', dsrs: [] },
        ],
      },
    ],
  },
  {
    id: 'R2',
    name: 'South Region',
    areas: [
      {
        id: 'A3',
        name: 'Karnataka',
        regionId: 'R2',
        territories: [
          { id: 'T6', name: 'Bangalore Central', areaId: 'A3', dsrs: [] },
          { id: 'T7', name: 'Bangalore South', areaId: 'A3', dsrs: [] },
        ],
      },
      {
        id: 'A4',
        name: 'Tamil Nadu',
        regionId: 'R2',
        territories: [
          { id: 'T8', name: 'Chennai North', areaId: 'A4', dsrs: [] },
          { id: 'T9', name: 'Chennai South', areaId: 'A4', dsrs: [] },
        ],
      },
    ],
  },
  {
    id: 'R3',
    name: 'West Region',
    areas: [
      {
        id: 'A5',
        name: 'Maharashtra',
        regionId: 'R3',
        territories: [
          { id: 'T10', name: 'Mumbai Central', areaId: 'A5', dsrs: [] },
          { id: 'T11', name: 'Pune', areaId: 'A5', dsrs: [] },
        ],
      },
    ],
  },
];

// Mock DSRs
export const mockDSRs: DSR[] = [
  { id: 'DSR1', name: 'Rahul Sharma', phone: '+91 98765 43210', territoryId: 'T1', outlets: 45, revenue: 234500, target: 250000, lastActive: '2024-01-15' },
  { id: 'DSR2', name: 'Priya Singh', phone: '+91 98765 43211', territoryId: 'T1', outlets: 52, revenue: 289000, target: 275000, lastActive: '2024-01-15' },
  { id: 'DSR3', name: 'Amit Kumar', phone: '+91 98765 43212', territoryId: 'T2', outlets: 38, revenue: 178000, target: 200000, lastActive: '2024-01-14' },
  { id: 'DSR4', name: 'Neha Gupta', phone: '+91 98765 43213', territoryId: 'T3', outlets: 61, revenue: 345000, target: 320000, lastActive: '2024-01-15' },
  { id: 'DSR5', name: 'Vikram Patel', phone: '+91 98765 43214', territoryId: 'T4', outlets: 42, revenue: 198000, target: 220000, lastActive: '2024-01-13' },
  { id: 'DSR6', name: 'Sunita Devi', phone: '+91 98765 43215', territoryId: 'T5', outlets: 55, revenue: 267000, target: 260000, lastActive: '2024-01-15' },
  { id: 'DSR7', name: 'Rajesh Verma', phone: '+91 98765 43216', territoryId: 'T6', outlets: 48, revenue: 312000, target: 300000, lastActive: '2024-01-15' },
  { id: 'DSR8', name: 'Anita Rao', phone: '+91 98765 43217', territoryId: 'T7', outlets: 39, revenue: 189000, target: 210000, lastActive: '2024-01-14' },
  { id: 'DSR9', name: 'Mohammed Ali', phone: '+91 98765 43218', territoryId: 'T8', outlets: 57, revenue: 278000, target: 280000, lastActive: '2024-01-15' },
  { id: 'DSR10', name: 'Kavitha Nair', phone: '+91 98765 43219', territoryId: 'T9', outlets: 44, revenue: 223000, target: 240000, lastActive: '2024-01-12' },
];

// Mock Products
export const mockProducts: Product[] = [
  { id: 'SKU1', name: 'Premium Biscuits 200g', category: 'Biscuits', price: 45, unit: 'pack' },
  { id: 'SKU2', name: 'Chocolate Cookies 150g', category: 'Biscuits', price: 55, unit: 'pack' },
  { id: 'SKU3', name: 'Instant Noodles 70g', category: 'Noodles', price: 14, unit: 'pack' },
  { id: 'SKU4', name: 'Masala Noodles 4-pack', category: 'Noodles', price: 50, unit: 'pack' },
  { id: 'SKU5', name: 'Hair Oil 100ml', category: 'Personal Care', price: 85, unit: 'bottle' },
  { id: 'SKU6', name: 'Shampoo 200ml', category: 'Personal Care', price: 120, unit: 'bottle' },
  { id: 'SKU7', name: 'Detergent Powder 1kg', category: 'Home Care', price: 95, unit: 'pack' },
  { id: 'SKU8', name: 'Floor Cleaner 500ml', category: 'Home Care', price: 65, unit: 'bottle' },
  { id: 'SKU9', name: 'Tea 250g', category: 'Beverages', price: 110, unit: 'pack' },
  { id: 'SKU10', name: 'Coffee 100g', category: 'Beverages', price: 145, unit: 'jar' },
];

// Mock Outlets
export const mockOutlets: Outlet[] = [
  { id: 'O1', name: 'Sharma General Store', address: '123 Main Road, Central Delhi', channel: 'GT', type: 'Kirana', dsrId: 'DSR1', lastPurchaseDate: '2024-01-14', totalRevenue: 45000, isLapsed: false, contactPhone: '+91 11 2345 6789', skus: ['SKU1', 'SKU3', 'SKU5', 'SKU7'] },
  { id: 'O2', name: 'Gupta Provisions', address: '45 Market Street, Central Delhi', channel: 'GT', type: 'Kirana', dsrId: 'DSR1', lastPurchaseDate: '2023-12-10', totalRevenue: 32000, isLapsed: true, contactPhone: '+91 11 2345 6790', skus: ['SKU1', 'SKU2'] },
  { id: 'O3', name: 'Metro Supermart', address: '78 Ring Road, South Delhi', channel: 'MT', type: 'Supermarket', dsrId: 'DSR2', lastPurchaseDate: '2024-01-15', totalRevenue: 125000, isLapsed: false, contactPhone: '+91 11 2345 6791', skus: ['SKU1', 'SKU2', 'SKU3', 'SKU4', 'SKU5', 'SKU6', 'SKU7', 'SKU8'] },
  { id: 'O4', name: 'Quick Mart', address: '22 DLF Phase 2, Gurgaon', channel: 'MT', type: 'Supermarket', dsrId: 'DSR4', lastPurchaseDate: '2024-01-13', totalRevenue: 89000, isLapsed: false, contactPhone: '+91 124 456 7890', skus: ['SKU1', 'SKU3', 'SKU5', 'SKU9'] },
  { id: 'O5', name: 'Hotel Grand Palace', address: '99 MG Road, Gurgaon', channel: 'Horeca', type: 'Hotel', dsrId: 'DSR4', lastPurchaseDate: '2024-01-10', totalRevenue: 67000, isLapsed: false, contactPhone: '+91 124 456 7891', skus: ['SKU9', 'SKU10'] },
  { id: 'O6', name: 'Singh Traders', address: '15 Sector 18, Noida', channel: 'GT', type: 'Kirana', dsrId: 'DSR5', lastPurchaseDate: '2023-12-20', totalRevenue: 28000, isLapsed: true, contactPhone: '+91 120 234 5678', skus: ['SKU1', 'SKU7'] },
  { id: 'O7', name: 'Family Bazaar', address: '88 Mahatma Gandhi Road, Bangalore', channel: 'MT', type: 'Supermarket', dsrId: 'DSR7', lastPurchaseDate: '2024-01-15', totalRevenue: 156000, isLapsed: false, contactPhone: '+91 80 4567 8901', skus: ['SKU1', 'SKU2', 'SKU3', 'SKU4', 'SKU5', 'SKU6', 'SKU7', 'SKU8', 'SKU9', 'SKU10'] },
  { id: 'O8', name: 'Corner Shop', address: '33 Anna Nagar, Chennai', channel: 'GT', type: 'Kirana', dsrId: 'DSR9', lastPurchaseDate: '2024-01-11', totalRevenue: 19000, isLapsed: false, contactPhone: '+91 44 2345 6789', skus: ['SKU1', 'SKU3'] },
];

// Mock Alerts
export const mockAlerts: Alert[] = [
  {
    id: 'AL1',
    severity: 'red',
    title: 'Critical Revenue Drop',
    description: 'Product Premium Biscuits 200g is −35% vs last month in Territory Central Delhi while the region is +10%. Top outlets: Gupta Provisions (−80%), Singh Traders (−60%).',
    entityType: 'territory',
    entityId: 'T1',
    timestamp: '2024-01-15T09:30:00Z',
  },
  {
    id: 'AL2',
    severity: 'orange',
    title: 'Low SKU Penetration',
    description: 'SKU Coffee 100g is sold in only 12% of outlets versus category average 68%. Consider promotional push in South Delhi.',
    entityType: 'product',
    entityId: 'SKU10',
    timestamp: '2024-01-15T08:15:00Z',
  },
  {
    id: 'AL3',
    severity: 'orange',
    title: 'Lapsed Outlets Alert',
    description: '8 outlets in Noida territory have no purchases in last 30 days — follow up required.',
    entityType: 'territory',
    entityId: 'T4',
    timestamp: '2024-01-14T16:45:00Z',
  },
  {
    id: 'AL4',
    severity: 'green',
    title: 'Target Achievement',
    description: 'DSR Neha Gupta has exceeded monthly target by 8% in Gurgaon territory. Revenue: ₹3,45,000.',
    entityType: 'dsr',
    entityId: 'DSR4',
    timestamp: '2024-01-14T14:20:00Z',
  },
  {
    id: 'AL5',
    severity: 'red',
    title: 'DSR Inactive',
    description: 'DSR Kavitha Nair has not logged activity for 3 days in Chennai South territory.',
    entityType: 'dsr',
    entityId: 'DSR10',
    timestamp: '2024-01-15T07:00:00Z',
  },
  {
    id: 'AL6',
    severity: 'green',
    title: 'New Outlet Onboarded',
    description: 'Metro Supermart successfully onboarded with 8 SKUs. First order value: ₹1,25,000.',
    entityType: 'outlet',
    entityId: 'O3',
    timestamp: '2024-01-13T11:30:00Z',
  },
];

// Generate time series data
export function generateSalesTimeSeries(days: number = 30): SalesData[] {
  const data: SalesData[] = [];
  const baseRevenue = 50000;
  const today = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const dayOfWeek = date.getDay();
    const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.7 : 1;
    const randomVariation = 0.8 + Math.random() * 0.4;
    const trend = 1 + (days - i) * 0.005;
    
    const revenue = Math.round(baseRevenue * weekendMultiplier * randomVariation * trend);
    const quantity = Math.round(revenue / 45);
    const forecast = i <= 7 ? Math.round(baseRevenue * trend * 1.1) : undefined;
    
    data.push({
      date: date.toISOString().split('T')[0],
      revenue,
      quantity,
      forecast,
    });
  }
  
  return data;
}

// Generate KPI data based on role and filters
export function generateKPIData(role: UserRole, entityId?: string): KPIData {
  const multipliers: Record<UserRole, number> = {
    RSM: 10,
    ASM: 5,
    TSM: 2,
    SO: 1.5,
    DSR: 1,
  };
  
  const baseRevenue = 250000 * multipliers[role];
  const variation = 0.9 + Math.random() * 0.2;
  const revenueMTD = Math.round(baseRevenue * variation);
  const revenueTarget = Math.round(baseRevenue * 1.1);
  const previousRevenueMTD = Math.round(revenueMTD * (0.85 + Math.random() * 0.3));
  
  return {
    revenueMTD,
    revenueTarget,
    targetPercent: Math.round((revenueMTD / revenueTarget) * 100),
    avgSellingPrice: Math.round(45 + Math.random() * 30),
    penetrationPercent: Math.round(55 + Math.random() * 35),
    outletsCount: Math.round(50 * multipliers[role]),
    activeOutlets: Math.round(40 * multipliers[role]),
    lapsedOutlets: Math.round(10 * multipliers[role]),
    previousRevenueMTD,
  };
}

// SKU Penetration Heatmap Data
export interface PenetrationCell {
  outletId: string;
  outletName: string;
  skuId: string;
  skuName: string;
  hasSKU: boolean;
  lastPurchase?: string;
}

export function generatePenetrationHeatmap(): PenetrationCell[] {
  const cells: PenetrationCell[] = [];
  
  mockOutlets.slice(0, 6).forEach(outlet => {
    mockProducts.slice(0, 6).forEach(product => {
      cells.push({
        outletId: outlet.id,
        outletName: outlet.name,
        skuId: product.id,
        skuName: product.name,
        hasSKU: outlet.skus.includes(product.id),
        lastPurchase: outlet.skus.includes(product.id) ? outlet.lastPurchaseDate : undefined,
      });
    });
  });
  
  return cells;
}

// SKU Pareto Data
export interface SKUPareto {
  id: string;
  name: string;
  revenue: number;
  share: number;
  cumulativeShare: number;
}

export function generateSKUPareto(): SKUPareto[] {
  const skuRevenues = mockProducts.map(p => ({
    ...p,
    revenue: Math.round(50000 + Math.random() * 200000),
  })).sort((a, b) => b.revenue - a.revenue);
  
  const totalRevenue = skuRevenues.reduce((sum, s) => sum + s.revenue, 0);
  let cumulative = 0;
  
  return skuRevenues.map(sku => {
    const share = (sku.revenue / totalRevenue) * 100;
    cumulative += share;
    return {
      id: sku.id,
      name: sku.name,
      revenue: sku.revenue,
      share: Math.round(share * 10) / 10,
      cumulativeShare: Math.round(cumulative * 10) / 10,
    };
  });
}
