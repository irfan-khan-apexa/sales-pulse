import { Calendar, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { useFilters } from '@/contexts/FiltersContext';
import { mockRegions, mockProducts } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export function GlobalFilters() {
  const { filters, setFilter, setFilters, resetFilters, getDateRange } = useFilters();
  
  const dateRangeOptions = [
    { value: 'last7', label: 'Last 7 days' },
    { value: 'last30', label: 'Last 30 days' },
    { value: 'last90', label: 'Last 90 days' },
    { value: 'custom', label: 'Custom range' },
  ] as const;

  const channels = ['GT', 'MT', 'Horeca'] as const;
  
  const activeFiltersCount = [
    filters.regionId,
    filters.areaId,
    filters.territoryId,
    filters.dsrId,
    filters.channel,
    filters.skuIds?.length,
  ].filter(Boolean).length;

  const dateRange = getDateRange();

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-card rounded-lg border border-border mb-6">
      {/* Date Range */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 h-9">
            <Calendar className="h-4 w-4" />
            {dateRangeOptions.find(o => o.value === filters.dateRange)?.label || 'Date Range'}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {dateRangeOptions.map(option => (
            <DropdownMenuItem 
              key={option.value}
              onClick={() => setFilter('dateRange', option.value)}
              className={cn(filters.dateRange === option.value && 'bg-accent')}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Custom Date Range Picker */}
      {filters.dateRange === 'custom' && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2 h-9">
              {filters.startDate && filters.endDate 
                ? `${format(new Date(filters.startDate), 'MMM d')} - ${format(new Date(filters.endDate), 'MMM d')}`
                : 'Select dates'
              }
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="range"
              selected={{
                from: filters.startDate ? new Date(filters.startDate) : undefined,
                to: filters.endDate ? new Date(filters.endDate) : undefined,
              }}
              onSelect={(range) => {
                setFilters({
                  startDate: range?.from?.toISOString().split('T')[0],
                  endDate: range?.to?.toISOString().split('T')[0],
                });
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      )}

      {/* Region Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant={filters.regionId ? 'secondary' : 'outline'} 
            className="gap-2 h-9"
          >
            {filters.regionId 
              ? mockRegions.find(r => r.id === filters.regionId)?.name || 'Region'
              : 'All Regions'
            }
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => setFilter('regionId', undefined)}>
            All Regions
          </DropdownMenuItem>
          {mockRegions.map(region => (
            <DropdownMenuItem 
              key={region.id}
              onClick={() => setFilters({ 
                regionId: region.id, 
                areaId: undefined, 
                territoryId: undefined 
              })}
              className={cn(filters.regionId === region.id && 'bg-accent')}
            >
              {region.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Area Filter */}
      {filters.regionId && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant={filters.areaId ? 'secondary' : 'outline'} 
              className="gap-2 h-9"
            >
              {filters.areaId 
                ? mockRegions
                    .find(r => r.id === filters.regionId)
                    ?.areas.find(a => a.id === filters.areaId)?.name || 'Area'
                : 'All Areas'
              }
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => setFilters({ areaId: undefined, territoryId: undefined })}>
              All Areas
            </DropdownMenuItem>
            {mockRegions
              .find(r => r.id === filters.regionId)
              ?.areas.map(area => (
                <DropdownMenuItem 
                  key={area.id}
                  onClick={() => setFilters({ areaId: area.id, territoryId: undefined })}
                  className={cn(filters.areaId === area.id && 'bg-accent')}
                >
                  {area.name}
                </DropdownMenuItem>
              ))
            }
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Channel Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant={filters.channel ? 'secondary' : 'outline'} 
            className="gap-2 h-9"
          >
            {filters.channel || 'All Channels'}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => setFilter('channel', undefined)}>
            All Channels
          </DropdownMenuItem>
          {channels.map(channel => (
            <DropdownMenuItem 
              key={channel}
              onClick={() => setFilter('channel', channel)}
              className={cn(filters.channel === channel && 'bg-accent')}
            >
              {channel}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Reset Filters */}
      {activeFiltersCount > 0 && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={resetFilters}
          className="gap-1 text-muted-foreground hover:text-foreground"
        >
          <X className="h-3 w-3" />
          Clear ({activeFiltersCount})
        </Button>
      )}

      {/* Date Range Display */}
      <div className="ml-auto text-xs text-muted-foreground">
        {format(new Date(dateRange.start), 'MMM d, yyyy')} - {format(new Date(dateRange.end), 'MMM d, yyyy')}
      </div>
    </div>
  );
}
