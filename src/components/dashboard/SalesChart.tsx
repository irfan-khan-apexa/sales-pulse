import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { SalesData } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

interface SalesChartProps {
  data: SalesData[];
  className?: string;
  title?: string;
  showForecast?: boolean;
}

const formatCurrency = (value: number) => {
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }
  if (value >= 1000) {
    return `₹${(value / 1000).toFixed(1)}K`;
  }
  return `₹${value}`;
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

export function SalesChart({ data, className, title = 'Sales Trend', showForecast = true }: SalesChartProps) {
  const [activeMetric, setActiveMetric] = useState<'revenue' | 'quantity'>('revenue');

  return (
    <div className={cn('bg-card rounded-lg border border-border p-5', className)}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          <button
            onClick={() => setActiveMetric('revenue')}
            className={cn(
              'px-3 py-1.5 text-sm rounded-md transition-colors',
              activeMetric === 'revenue' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Revenue
          </button>
          <button
            onClick={() => setActiveMetric('quantity')}
            className={cn(
              'px-3 py-1.5 text-sm rounded-md transition-colors',
              activeMetric === 'quantity' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Quantity
          </button>
        </div>
      </div>

      <div className="h-[300px]">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))" 
                vertical={false}
              />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickMargin={8}
              />
              <YAxis 
                tickFormatter={activeMetric === 'revenue' ? formatCurrency : undefined}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickMargin={8}
                width={60}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                labelFormatter={(label) => formatDate(label)}
                formatter={(value: number, name: string) => [
                  activeMetric === 'revenue' ? formatCurrency(value) : value.toLocaleString(),
                  name === 'revenue' ? 'Revenue' : name === 'forecast' ? 'Forecast' : 'Quantity'
                ]}
              />
              <Area
                type="monotone"
                dataKey={activeMetric}
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#colorRevenue)"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2 }}
              />
              {showForecast && activeMetric === 'revenue' && (
                <Area
                  type="monotone"
                  dataKey="forecast"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fill="url(#colorForecast)"
                  dot={false}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
