import { useState } from 'react';
import { ChevronRight, MapPin, Building2, Users, Store } from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';
import { GlobalFilters } from '@/components/dashboard/GlobalFilters';
import { mockRegions, mockDSRs } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function HierarchyPage() {
  const [expandedRegions, setExpandedRegions] = useState<string[]>(['R1']);
  const [expandedAreas, setExpandedAreas] = useState<string[]>([]);

  const toggleRegion = (regionId: string) => {
    setExpandedRegions(prev =>
      prev.includes(regionId)
        ? prev.filter(id => id !== regionId)
        : [...prev, regionId]
    );
  };

  const toggleArea = (areaId: string) => {
    setExpandedAreas(prev =>
      prev.includes(areaId)
        ? prev.filter(id => id !== areaId)
        : [...prev, areaId]
    );
  };

  const getDSRsForTerritory = (territoryId: string) => {
    return mockDSRs.filter(dsr => dsr.territoryId === territoryId);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Sales Hierarchy</h1>
        <p className="text-muted-foreground">
          Navigate through regions, areas, territories, and DSR assignments
        </p>
      </div>

      {/* Global Filters */}
      <GlobalFilters />

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Regions"
          value={mockRegions.length}
          format="number"
          icon={<MapPin className="h-5 w-5" />}
        />
        <KPICard
          title="Total Areas"
          value={mockRegions.reduce((sum, r) => sum + r.areas.length, 0)}
          format="number"
          icon={<Building2 className="h-5 w-5" />}
        />
        <KPICard
          title="Total Territories"
          value={mockRegions.reduce((sum, r) => 
            sum + r.areas.reduce((aSum, a) => aSum + a.territories.length, 0), 0
          )}
          format="number"
          icon={<Store className="h-5 w-5" />}
        />
        <KPICard
          title="Active DSRs"
          value={mockDSRs.length}
          format="number"
          icon={<Users className="h-5 w-5" />}
        />
      </div>

      {/* Hierarchy Tree */}
      <div className="bg-card rounded-lg border border-border">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Organization Structure</h3>
          <p className="text-sm text-muted-foreground">Click to expand and explore the hierarchy</p>
        </div>

        <div className="p-4">
          {mockRegions.map(region => {
            const isRegionExpanded = expandedRegions.includes(region.id);
            const regionRevenue = mockDSRs
              .filter(d => region.areas.some(a => 
                a.territories.some(t => t.id === d.territoryId)
              ))
              .reduce((sum, d) => sum + d.revenue, 0);

            return (
              <div key={region.id} className="mb-2">
                {/* Region Level */}
                <button
                  onClick={() => toggleRegion(region.id)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left',
                    'hover:bg-muted/50',
                    isRegionExpanded && 'bg-muted/30'
                  )}
                >
                  <ChevronRight className={cn(
                    'h-5 w-5 text-muted-foreground transition-transform',
                    isRegionExpanded && 'rotate-90'
                  )} />
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{region.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {region.areas.length} areas • {region.areas.reduce((sum, a) => sum + a.territories.length, 0)} territories
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">
                      ₹{(regionRevenue / 100000).toFixed(1)}L
                    </p>
                    <p className="text-xs text-muted-foreground">Revenue MTD</p>
                  </div>
                </button>

                {/* Areas */}
                {isRegionExpanded && (
                  <div className="ml-8 mt-1 space-y-1">
                    {region.areas.map(area => {
                      const isAreaExpanded = expandedAreas.includes(area.id);
                      const areaRevenue = mockDSRs
                        .filter(d => area.territories.some(t => t.id === d.territoryId))
                        .reduce((sum, d) => sum + d.revenue, 0);

                      return (
                        <div key={area.id}>
                          <button
                            onClick={() => toggleArea(area.id)}
                            className={cn(
                              'w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left',
                              'hover:bg-muted/50',
                              isAreaExpanded && 'bg-muted/30'
                            )}
                          >
                            <ChevronRight className={cn(
                              'h-4 w-4 text-muted-foreground transition-transform',
                              isAreaExpanded && 'rotate-90'
                            )} />
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                              <Building2 className="h-4 w-4 text-accent" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-foreground">{area.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {area.territories.length} territories
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-foreground">
                                ₹{(areaRevenue / 100000).toFixed(1)}L
                              </p>
                            </div>
                          </button>

                          {/* Territories */}
                          {isAreaExpanded && (
                            <div className="ml-8 mt-1 space-y-1">
                              {area.territories.map(territory => {
                                const dsrs = getDSRsForTerritory(territory.id);
                                const territoryRevenue = dsrs.reduce((sum, d) => sum + d.revenue, 0);

                                return (
                                  <div 
                                    key={territory.id}
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50"
                                  >
                                    <div className="w-4" />
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                                      <Store className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-medium text-foreground">{territory.name}</p>
                                      <div className="flex items-center gap-2 mt-1">
                                        {dsrs.slice(0, 2).map(dsr => (
                                          <Badge key={dsr.id} variant="secondary" className="text-xs">
                                            {dsr.name.split(' ')[0]}
                                          </Badge>
                                        ))}
                                        {dsrs.length > 2 && (
                                          <Badge variant="outline" className="text-xs">
                                            +{dsrs.length - 2} more
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-medium text-foreground">
                                        ₹{(territoryRevenue / 1000).toFixed(0)}K
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {dsrs.length} DSRs
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
