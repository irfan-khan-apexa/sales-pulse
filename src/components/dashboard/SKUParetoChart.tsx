import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { SKUPareto } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

interface SKUParetoChartProps {
  data: SKUPareto[];
  className?: string;
  title?: string;
}

const formatCurrency = (value: number) => {
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }
  if (value >= 1000) {
    return `₹${(value / 1000).toFixed(0)}K`;
  }
  return `₹${value}`;
};

export function SKUParetoChart({ data, className, title = 'SKU Revenue Share' }: SKUParetoChartProps) {
  return (
    <div className={cn('bg-card rounded-lg border border-border p-5', className)}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-primary" />
            <span className="text-muted-foreground">Revenue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-accent" />
            <span className="text-muted-foreground">Cumulative %</span>
          </div>
        </div>
      </div>

      <div className="h-[300px]">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))" 
                vertical={false}
              />
              <XAxis 
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                tickMargin={8}
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis 
                yAxisId="left"
                tickFormatter={formatCurrency}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickMargin={8}
                width={60}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                tickFormatter={(v) => `${v}%`}
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickMargin={8}
                width={50}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(value: number, name: string) => {
                  if (name === 'revenue') return [formatCurrency(value), 'Revenue'];
                  if (name === 'cumulativeShare') return [`${value}%`, 'Cumulative'];
                  return [value, name];
                }}
              />
              <Bar 
                yAxisId="left"
                dataKey="revenue" 
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="cumulativeShare" 
                stroke="hsl(var(--accent))"
                strokeWidth={2}
                dot={{ r: 3, fill: 'hsl(var(--accent))' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
