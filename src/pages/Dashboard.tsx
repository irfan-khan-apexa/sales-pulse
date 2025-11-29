import { useMemo } from 'react';
import { 
  IndianRupee, 
  Target, 
  Store, 
  TrendingUp,
  Users,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { KPICard } from '@/components/dashboard/KPICard';
import {AlertsFeed} from '@/components/dashboard/AlertsFeed';
import { SalesChart } from '@/components/dashboard/SalesChart';
import { SKUParetoChart } from '@/components/dashboard/SKUParetoChart';
import { DSRTable } from '@/components/dashboard/DSRTable';
import { GlobalFilters } from '@/components/dashboard/GlobalFilters';
import { 
  generateKPIData, 
  generateSalesTimeSeries, 
  generateSKUPareto,
  mockAlerts,
  mockDSRs
} from '@/lib/mock-data';
import { ROLE_LABELS } from '@/config/api';

export default function Dashboard() {
  const { user } = useAuth();
  
  const kpiData = useMemo(() => 
    generateKPIData(user?.role || 'RSM', user?.regionId), 
    [user?.role, user?.regionId]
  );
  
  const salesData = useMemo(() => generateSalesTimeSeries(30), []);
  const paretoData = useMemo(() => generateSKUPareto(), []);

  const revenueTrend = useMemo(() => {
    const change = ((kpiData.revenueMTD - kpiData.previousRevenueMTD) / kpiData.previousRevenueMTD) * 100;
    return Math.round(change);
  }, [kpiData]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name || 'User'}
            <span className="mx-2">•</span>
            <span className="text-primary font-medium">{ROLE_LABELS[user?.role || 'RSM']}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Last updated:</span>
          <span className="font-medium text-foreground">
            {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Global Filters */}
      <GlobalFilters />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Revenue MTD"
          value={kpiData.revenueMTD}
          format="currency"
          trend={revenueTrend}
          trendLabel="vs last month"
          icon={<IndianRupee className="h-5 w-5" />}
        />
        <KPICard
          title="Target Achievement"
          value={kpiData.targetPercent}
          format="percent"
          subtitle={`Target: ₹${(kpiData.revenueTarget / 100000).toFixed(1)}L`}
          trend={kpiData.targetPercent >= 100 ? 5 : -5}
          icon={<Target className="h-5 w-5" />}
        />
        <KPICard
          title="Active Outlets"
          value={kpiData.activeOutlets}
          format="number"
          subtitle={`${kpiData.lapsedOutlets} lapsed`}
          trend={-2}
          trendLabel="vs last week"
          icon={<Store className="h-5 w-5" />}
        />
        <KPICard
          title="SKU Penetration"
          value={kpiData.penetrationPercent}
          format="percent"
          subtitle="Avg across outlets"
          trend={8}
          trendLabel="vs last month"
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart 
          data={salesData} 
          title="Daily Sales Trend (MTD)"
          showForecast 
        />
        <SKUParetoChart 
          data={paretoData}
          title="SKU Revenue Contribution"
        />
      </div>

      {/* Bottom Row - DSR Table & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DSRTable 
          data={mockDSRs} 
          className="lg:col-span-2"
          title="DSR Performance Overview"
        />
        <AlertsFeed 
          alerts={mockAlerts}
          maxItems={5}
        />
      </div>
    </div>
  );
}
