import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number;
  trendLabel?: string;
  icon?: React.ReactNode;
  format?: 'currency' | 'percent' | 'number';
  className?: string;
}

export function KPICard({ 
  title, 
  value, 
  subtitle, 
  trend, 
  trendLabel,
  icon,
  format = 'number',
  className 
}: KPICardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          maximumFractionDigits: 0,
        }).format(val);
      case 'percent':
        return `${val}%`;
      default:
        return new Intl.NumberFormat('en-IN').format(val);
    }
  };

  const getTrendIcon = () => {
    if (!trend) return <Minus className="h-3 w-3" />;
    return trend > 0 
      ? <TrendingUp className="h-3 w-3" /> 
      : <TrendingDown className="h-3 w-3" />;
  };

  const getTrendColor = () => {
    if (!trend) return 'text-muted-foreground';
    return trend > 0 ? 'kpi-trend-positive' : 'kpi-trend-negative';
  };

  return (
    <div className={cn('kpi-card animate-fade-in', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="kpi-label">{title}</p>
          <p className="kpi-value">{formatValue(value)}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        )}
      </div>
      
      {trend !== undefined && (
        <div className={cn('mt-3 flex items-center gap-1', getTrendColor())}>
          {getTrendIcon()}
          <span>{trend > 0 ? '+' : ''}{trend}%</span>
          {trendLabel && (
            <span className="text-muted-foreground ml-1">{trendLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
