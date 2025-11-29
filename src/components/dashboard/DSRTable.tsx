import { useState } from 'react';
import { ChevronUp, ChevronDown, Eye, Phone, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DSR } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

interface DSRTableProps {
  data: DSR[];
  className?: string;
  title?: string;
  onDSRClick?: (dsr: DSR) => void;
}

type SortField = 'name' | 'revenue' | 'outlets' | 'target';
type SortOrder = 'asc' | 'desc';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

export function DSRTable({ data, className, title = 'DSR Performance', onDSRClick }: DSRTableProps) {
  const [sortField, setSortField] = useState<SortField>('revenue');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedDSR, setSelectedDSR] = useState<DSR | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortOrder === 'asc' 
        ? aVal.localeCompare(bVal) 
        : bVal.localeCompare(aVal);
    }
    
    return sortOrder === 'asc' 
      ? (aVal as number) - (bVal as number) 
      : (bVal as number) - (aVal as number);
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' 
      ? <ChevronUp className="h-4 w-4" /> 
      : <ChevronDown className="h-4 w-4" />;
  };

  const handleRowClick = (dsr: DSR) => {
    setSelectedDSR(dsr);
    onDSRClick?.(dsr);
  };

  return (
    <>
      <div className={cn('bg-card rounded-lg border border-border', className)}>
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <span className="text-xs text-muted-foreground">{data.length} DSRs</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th 
                  className="px-5 py-3 text-left cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1 data-table-header">
                    DSR Name <SortIcon field="name" />
                  </div>
                </th>
                <th 
                  className="px-5 py-3 text-right cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => handleSort('outlets')}
                >
                  <div className="flex items-center justify-end gap-1 data-table-header">
                    Outlets <SortIcon field="outlets" />
                  </div>
                </th>
                <th 
                  className="px-5 py-3 text-right cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => handleSort('revenue')}
                >
                  <div className="flex items-center justify-end gap-1 data-table-header">
                    Revenue MTD <SortIcon field="revenue" />
                  </div>
                </th>
                <th 
                  className="px-5 py-3 text-right cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => handleSort('target')}
                >
                  <div className="flex items-center justify-end gap-1 data-table-header">
                    Target <SortIcon field="target" />
                  </div>
                </th>
                <th className="px-5 py-3 text-center">
                  <span className="data-table-header">Achievement</span>
                </th>
                <th className="px-5 py-3 text-center">
                  <span className="data-table-header">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">
                    No DSRs found
                  </td>
                </tr>
              ) : (
                sortedData.map((dsr, index) => {
                  const achievement = Math.round((dsr.revenue / dsr.target) * 100);
                  const isOverTarget = achievement >= 100;
                  
                  return (
                    <tr 
                      key={dsr.id}
                      className="border-b border-border hover:bg-muted/30 transition-colors cursor-pointer animate-fade-in"
                      style={{ animationDelay: `${index * 30}ms` }}
                      onClick={() => handleRowClick(dsr)}
                    >
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-medium text-foreground">{dsr.name}</p>
                          <p className="text-xs text-muted-foreground">{dsr.phone}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right text-foreground">
                        {dsr.outlets}
                      </td>
                      <td className="px-5 py-4 text-right font-medium text-foreground">
                        {formatCurrency(dsr.revenue)}
                      </td>
                      <td className="px-5 py-4 text-right text-muted-foreground">
                        {formatCurrency(dsr.target)}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <Badge 
                          variant={isOverTarget ? 'default' : 'secondary'}
                          className={cn(
                            isOverTarget 
                              ? 'bg-success/10 text-success border-success/20 hover:bg-success/20' 
                              : achievement >= 80 
                                ? 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20'
                                : 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20'
                          )}
                        >
                          {achievement}%
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(dsr);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DSR Detail Sheet */}
      <Sheet open={!!selectedDSR} onOpenChange={(open) => !open && setSelectedDSR(null)}>
        <SheetContent className="sm:max-w-lg">
          {selectedDSR && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedDSR.name}</SheetTitle>
                <SheetDescription>DSR Performance Details</SheetDescription>
              </SheetHeader>
              
              <div className="mt-6 space-y-6">
                {/* Contact Info */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-foreground">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      {selectedDSR.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      Territory: {selectedDSR.territoryId}
                    </div>
                  </div>
                </div>

                {/* Performance Summary */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-foreground">Performance Summary</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-muted p-3">
                      <p className="text-xs text-muted-foreground">Revenue MTD</p>
                      <p className="text-lg font-semibold text-foreground">
                        {formatCurrency(selectedDSR.revenue)}
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted p-3">
                      <p className="text-xs text-muted-foreground">Target</p>
                      <p className="text-lg font-semibold text-foreground">
                        {formatCurrency(selectedDSR.target)}
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted p-3">
                      <p className="text-xs text-muted-foreground">Outlets</p>
                      <p className="text-lg font-semibold text-foreground">
                        {selectedDSR.outlets}
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted p-3">
                      <p className="text-xs text-muted-foreground">Achievement</p>
                      <p className="text-lg font-semibold text-foreground">
                        {Math.round((selectedDSR.revenue / selectedDSR.target) * 100)}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Last Active */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-foreground">Activity</h4>
                  <p className="text-sm text-muted-foreground">
                    Last active: {new Date(selectedDSR.lastActive).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button className="flex-1">View Full Profile</Button>
                  <Button variant="outline" className="flex-1">View Outlets</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
