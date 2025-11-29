import { useMemo, useState } from 'react';
import { Package, TrendingUp, Store, Percent, Search } from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';
import { SKUParetoChart } from '@/components/dashboard/SKUParetoChart';
import { GlobalFilters } from '@/components/dashboard/GlobalFilters';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  mockProducts, 
  mockOutlets, 
  generateSKUPareto,
  generatePenetrationHeatmap 
} from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export default function ProductsPage() {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const paretoData = useMemo(() => generateSKUPareto(), []);
  const heatmapData = useMemo(() => generatePenetrationHeatmap(), []);

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return mockProducts;
    const query = searchQuery.toLowerCase();
    return mockProducts.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Calculate penetration stats
  const penetrationStats = useMemo(() => {
    const totalCells = heatmapData.length;
    const filledCells = heatmapData.filter(c => c.hasSKU).length;
    return {
      overall: Math.round((filledCells / totalCells) * 100),
      totalSKUs: mockProducts.length,
      avgPenetration: Math.round((filledCells / mockProducts.length) * 100 / mockOutlets.slice(0, 6).length * 100),
    };
  }, [heatmapData]);

  // Group heatmap by outlet
  const outletNames = [...new Set(heatmapData.map(c => c.outletName))];
  const skuNames = [...new Set(heatmapData.map(c => c.skuName))];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Product Analytics</h1>
        <p className="text-muted-foreground">
          SKU performance, penetration analysis, and product insights
        </p>
      </div>

      {/* Global Filters */}
      <GlobalFilters />

      {/* KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total SKUs"
          value={mockProducts.length}
          format="number"
          icon={<Package className="h-5 w-5" />}
        />
        <KPICard
          title="Avg SKU Penetration"
          value={penetrationStats.avgPenetration}
          format="percent"
          trend={5}
          trendLabel="vs last month"
          icon={<Percent className="h-5 w-5" />}
        />
        <KPICard
          title="Top Performer"
          value={paretoData[0]?.name?.split(' ')[0] || 'N/A'}
          subtitle={`${paretoData[0]?.share || 0}% revenue share`}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <KPICard
          title="Coverage"
          value={penetrationStats.overall}
          format="percent"
          subtitle="Outlet × SKU matrix"
          icon={<Store className="h-5 w-5" />}
        />
      </div>

      {/* Pareto Chart */}
      <SKUParetoChart 
        data={paretoData}
        title="SKU Revenue Pareto Analysis"
      />

      {/* Penetration Heatmap */}
      <div className="bg-card rounded-lg border border-border p-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-foreground">SKU Penetration Heatmap</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Outlet × SKU availability matrix
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-success/80" />
              <span className="text-muted-foreground">Has SKU</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-muted" />
              <span className="text-muted-foreground">Missing</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">
                  Outlet
                </th>
                {skuNames.map((sku, i) => (
                  <th 
                    key={i} 
                    className="px-1 py-2 text-xs font-medium text-muted-foreground text-center"
                    style={{ minWidth: 60 }}
                  >
                    <span className="block truncate max-w-[60px]" title={sku}>
                      {sku.split(' ')[0]}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {outletNames.map((outlet, outletIdx) => (
                <tr key={outletIdx} className="border-t border-border">
                  <td className="px-3 py-2 text-sm font-medium text-foreground whitespace-nowrap">
                    {outlet}
                  </td>
                  {skuNames.map((sku, skuIdx) => {
                    const cell = heatmapData.find(
                      c => c.outletName === outlet && c.skuName === sku
                    );
                    return (
                      <td key={skuIdx} className="px-1 py-2 text-center">
                        <div
                          className={cn(
                            'penetration-cell mx-auto cursor-pointer transition-transform hover:scale-110',
                            cell?.hasSKU 
                              ? 'bg-success/80 text-success-foreground' 
                              : 'bg-muted text-muted-foreground'
                          )}
                          title={`${outlet} - ${sku}: ${cell?.hasSKU ? 'Available' : 'Not Available'}`}
                        >
                          {cell?.hasSKU ? '✓' : '–'}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product List */}
      <div className="bg-card rounded-lg border border-border">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="font-semibold text-foreground">Product Catalog</h3>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-8"
            />
          </div>
        </div>
        
        <div className="divide-y divide-border">
          {filteredProducts.map((product, index) => (
            <div 
              key={product.id}
              className="px-5 py-4 hover:bg-muted/30 transition-colors animate-fade-in cursor-pointer"
              style={{ animationDelay: `${index * 30}ms` }}
              onClick={() => setSelectedProduct(product.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary">{product.id}</Badge>
                  <span className="font-medium text-foreground">
                    ₹{product.price}/{product.unit}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
