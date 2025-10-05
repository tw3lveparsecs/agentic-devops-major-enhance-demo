import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from '@phosphor-icons/react';
import { categories, manufacturers } from '../data/vehicles';

interface Filters {
  category: string;
  manufacturer: string;
  priceRange: string;
  search: string;
}

interface VehicleFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  resultsCount: number;
}

const priceRanges = [
  { value: 'all', label: 'All Prices' },
  { value: '0-100000', label: 'Under ⬟100K' },
  { value: '100000-500000', label: '⬟100K - ⬟500K' },
  { value: '500000-5000000', label: '⬟500K - ⬟5M' },
  { value: '5000000-999999999', label: 'Over ⬟5M' }
];

export function VehicleFilters({ filters, onFiltersChange, resultsCount }: VehicleFiltersProps) {
  const updateFilter = (key: keyof Filters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      category: 'all',
      manufacturer: 'All Manufacturers',
      priceRange: 'all',
      search: ''
    });
  };

  const hasActiveFilters = filters.category !== 'all' || 
                          filters.manufacturer !== 'All Manufacturers' || 
                          filters.priceRange !== 'all' || 
                          filters.search !== '';

  return (
    <div className="space-y-4 p-6 border border-border rounded-lg bg-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-lg font-semibold">Filter Vehicles</h3>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {resultsCount} vehicle{resultsCount !== 1 ? 's' : ''}
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-destructive hover:text-destructive"
            >
              <X className="mr-1 h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Search Bar - Full Width */}
      <div>
        <Input
          placeholder="Search vehicles by name or description..."
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="w-full"
        />
      </div>

      {/* Filter Controls - Horizontal Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Category Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Category</label>
          <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name} ({category.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Manufacturer Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Manufacturer</label>
          <Select value={filters.manufacturer} onValueChange={(value) => updateFilter('manufacturer', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {manufacturers.map((manufacturer) => (
                <SelectItem key={manufacturer} value={manufacturer}>
                  {manufacturer}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Price Range</label>
          <Select value={filters.priceRange} onValueChange={(value) => updateFilter('priceRange', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {priceRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: "{filters.search}"
              <button
                onClick={() => updateFilter('search', '')}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {filters.category !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {categories.find(c => c.id === filters.category)?.name}
              <button
                onClick={() => updateFilter('category', 'all')}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {filters.manufacturer !== 'All Manufacturers' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.manufacturer}
              <button
                onClick={() => updateFilter('manufacturer', 'All Manufacturers')}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {filters.priceRange !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {priceRanges.find(r => r.value === filters.priceRange)?.label}
              <button
                onClick={() => updateFilter('priceRange', 'all')}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}