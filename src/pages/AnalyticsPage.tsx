import { useMemo } from 'react';
import { TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';
import { SalesChart } from '@/components/dashboard/SalesChart';
import { SKUParetoChart } from '@/components/dashboard/SKUParetoChart';
import { GlobalFilters } from '@/components/dashboard/GlobalFilters';
import { generateSalesTimeSeries, generateSKUPareto, generateKPIData, mockRegions } from '@/lib/mock-data';
import { useAuth } from '@/contexts/AuthContext';
import { API_CONFIG } from '@/config/api';

export default function AnalyticsPage() {
  const { user } = useAuth();
  
  const salesData = useMemo(() => generateSalesTimeSeries(60), []);
  const paretoData = useMemo(() => generateSKUPareto(), []);
  const kpiData = useMemo(() => generateKPIData(user?.role || 'RSM'), [user?.role]);

  // Calculate some analytics metrics
  const totalRevenue = salesData.reduce((sum, d) => sum + d.revenue, 0);
  const avgDailyRevenue = Math.round(totalRevenue / salesData.length);
  const maxRevenue = Math.max(...salesData.map(d => d.revenue));
  const minRevenue = Math.min(...salesData.map(d => d.revenue));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">
          Deep dive into sales trends, regional performance, and forecasting
        </p>
      </div>

      {/* Global Filters */}
      <GlobalFilters />

      {/* Metabase Embed Placeholder */}
      {API_CONFIG.USE_METABASE_EMBED && API_CONFIG.METABASE_EMBED_URL && (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Embedded Analytics Dashboard</h3>
            <p className="text-sm text-muted-foreground">Powered by Metabase</p>
          </div>
          <div className="aspect-video">
            <iframe
              src={API_CONFIG.METABASE_EMBED_URL}
              className="w-full h-full"
              frameBorder="0"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Analytics KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Revenue (60d)"
          value={totalRevenue}
          format="currency"
          trend={15}
          trendLabel="vs previous period"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <KPICard
          title="Avg Daily Revenue"
          value={avgDailyRevenue}
          format="currency"
          icon={<BarChart3 className="h-5 w-5" />}
        />
        <KPICard
          title="Peak Day Revenue"
          value={maxRevenue}
          format="currency"
          subtitle="Best performing day"
          icon={<Activity className="h-5 w-5" />}
        />
        <KPICard
          title="Revenue Variance"
          value={`${Math.round(((maxRevenue - minRevenue) / avgDailyRevenue) * 100)}%`}
          subtitle="Max vs Min spread"
          icon={<PieChart className="h-5 w-5" />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6">
        <SalesChart 
          data={salesData}
          title="Sales Trend Analysis (60 Days)"
          showForecast
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SKUParetoChart 
          data={paretoData}
          title="SKU Revenue Distribution"
        />

        {/* Regional Performance */}
        <div className="bg-card rounded-lg border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4">Regional Performance</h3>
          <div className="space-y-4">
            {mockRegions.map((region, index) => {
              const performance = 75 + Math.random() * 25;
              const revenue = 500000 + Math.random() * 2000000;
              
              return (
                <div key={region.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{region.name}</span>
                    <span className="text-sm text-muted-foreground">
                      ₹{(revenue / 100000).toFixed(1)}L
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ 
                        width: `${performance}%`,
                        animationDelay: `${index * 100}ms`
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {Math.round(performance)}% of target • {region.areas.length} areas
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="bg-card rounded-lg border border-border p-5">
        <h3 className="font-semibold text-foreground mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'Weekend Dip Pattern',
              description: 'Sales consistently drop 30% on weekends. Consider promotions to boost weekend performance.',
              type: 'pattern'
            },
            {
              title: 'Top SKU Concentration',
              description: `Top 3 SKUs contribute ${paretoData.slice(0, 3).reduce((sum, s) => sum + s.share, 0).toFixed(0)}% of total revenue. High dependency risk.`,
              type: 'risk'
            },
            {
              title: 'Growth Opportunity',
              description: 'North Region shows 18% higher growth rate. Replicate successful strategies to other regions.',
              type: 'opportunity'
            },
          ].map((insight, i) => (
            <div key={i} className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <div className={`h-2 w-2 rounded-full ${
                  insight.type === 'pattern' ? 'bg-primary' :
                  insight.type === 'risk' ? 'bg-warning' : 'bg-success'
                }`} />
                <h4 className="font-medium text-foreground text-sm">{insight.title}</h4>
              </div>
              <p className="text-sm text-muted-foreground">{insight.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
