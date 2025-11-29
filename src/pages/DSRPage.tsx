import { useState, useMemo } from 'react';
import { Search, Filter, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DSRTable } from '@/components/dashboard/DSRTable';
import { GlobalFilters } from '@/components/dashboard/GlobalFilters';
import { KPICard } from '@/components/dashboard/KPICard';
import { mockDSRs } from '@/lib/mock-data';
import { Users, TrendingUp, Target, AlertTriangle } from 'lucide-react';

export default function DSRPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredDSRs = useMemo(() => {
    if (!searchQuery) return mockDSRs;
    const query = searchQuery.toLowerCase();
    return mockDSRs.filter(dsr => 
      dsr.name.toLowerCase().includes(query) ||
      dsr.phone.includes(query) ||
      dsr.territoryId.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const stats = useMemo(() => {
    const totalRevenue = mockDSRs.reduce((sum, d) => sum + d.revenue, 0);
    const totalTarget = mockDSRs.reduce((sum, d) => sum + d.target, 0);
    const onTarget = mockDSRs.filter(d => d.revenue >= d.target).length;
    const belowTarget = mockDSRs.length - onTarget;
    
    return {
      totalDSRs: mockDSRs.length,
      totalRevenue,
      avgAchievement: Math.round((totalRevenue / totalTarget) * 100),
      onTarget,
      belowTarget,
    };
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">DSR Performance</h1>
          <p className="text-muted-foreground">
            Monitor and analyze Distribution Sales Representative performance
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Global Filters */}
      <GlobalFilters />

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total DSRs"
          value={stats.totalDSRs}
          format="number"
          icon={<Users className="h-5 w-5" />}
        />
        <KPICard
          title="Total Revenue"
          value={stats.totalRevenue}
          format="currency"
          trend={12}
          trendLabel="vs last month"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <KPICard
          title="On Target"
          value={stats.onTarget}
          format="number"
          subtitle={`${Math.round((stats.onTarget / stats.totalDSRs) * 100)}% of DSRs`}
          icon={<Target className="h-5 w-5" />}
        />
        <KPICard
          title="Below Target"
          value={stats.belowTarget}
          format="number"
          subtitle="Needs attention"
          icon={<AlertTriangle className="h-5 w-5" />}
        />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search DSRs by name, phone, or territory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          More Filters
        </Button>
      </div>

      {/* DSR Table */}
      <DSRTable 
        data={filteredDSRs}
        title={`DSR List ${searchQuery ? `(${filteredDSRs.length} results)` : ''}`}
      />
    </div>
  );
}
