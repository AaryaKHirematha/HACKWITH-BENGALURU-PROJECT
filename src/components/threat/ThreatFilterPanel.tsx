/**
 * Threat Filter Panel Component
 * Advanced filtering UI for threat events
 * Supports multiple filter types and real-time updates
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  X, 
  ChevronDown, 
  Search,
  RotateCcw,
  Check
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button, Badge, Input, Card } from '@/components/ui';
import { useSimulationStore } from '@/simulation';
import type { ThreatLevel, EventType, EventCategory, EventStatus } from '@/simulation/types';

// ============================================================
// FILTER OPTIONS
// ============================================================

const threatLevelOptions: { value: ThreatLevel; label: string; color: string }[] = [
  { value: 'critical', label: 'Critical', color: 'bg-red-500' },
  { value: 'high', label: 'High', color: 'bg-orange-500' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
  { value: 'low', label: 'Low', color: 'bg-blue-500' },
  { value: 'info', label: 'Info', color: 'bg-gray-500' },
];

const eventTypeOptions: { value: EventType; label: string }[] = [
  { value: 'suspicious_vehicle', label: 'Suspicious Vehicle' },
  { value: 'abnormal_badge_access', label: 'Badge Anomaly' },
  { value: 'unauthorized_login', label: 'Unauthorized Login' },
  { value: 'server_room_breach', label: 'Server Room Breach' },
  { value: 'malware_activity', label: 'Malware Activity' },
  { value: 'network_intrusion', label: 'Network Intrusion' },
  { value: 'phishing_attempt', label: 'Phishing Attempt' },
  { value: 'ransomware_indicator', label: 'Ransomware Indicator' },
  { value: 'insider_threat', label: 'Insider Threat' },
  { value: 'data_exfiltration', label: 'Data Exfiltration' },
  { value: 'privilege_escalation', label: 'Privilege Escalation' },
  { value: 'lateral_movement', label: 'Lateral Movement' },
  { value: 'credential_theft', label: 'Credential Theft' },
  { value: 'physical_security', label: 'Physical Security' },
  { value: 'anomalous_behavior', label: 'Anomalous Behavior' },
];

const categoryOptions: { value: EventCategory; label: string }[] = [
  { value: 'cyber', label: 'Cyber' },
  { value: 'physical', label: 'Physical' },
  { value: 'insider', label: 'Insider' },
  { value: 'combined', label: 'Combined' },
];

const statusOptions: { value: EventStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'investigating', label: 'Investigating' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'mitigated', label: 'Mitigated' },
  { value: 'false_positive', label: 'False Positive' },
  { value: 'escalated', label: 'Escalated' },
];

// ============================================================
// THREAT FILTER PANEL COMPONENT
// ============================================================

export const ThreatFilterPanel = () => {
  const { filters, setFilters, resetFilters, totalCount } = useSimulationStore();
  const [isExpanded, setIsExpanded] = useState(false);

  // Count active filters
  const countActiveFilters = () => {
    let count = 0;
    if (filters.threatLevels && filters.threatLevels.length > 0) count++;
    if (filters.eventTypes && filters.eventTypes.length > 0) count++;
    if (filters.categories && filters.categories.length > 0) count++;
    if (filters.statuses && filters.statuses.length > 0) count++;
    if (filters.searchQuery) count++;
    if (filters.minAnomalyScore !== undefined || filters.maxAnomalyScore !== undefined) count++;
    return count;
  };

  const activeFilters = countActiveFilters();

  return (
    <Card className="mb-4" noPadding>
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-cyan-400" />
            <span className="font-medium text-white">Filters</span>
          </div>
          
          {activeFilters > 0 && (
            <Badge variant="primary" size="sm">
              {activeFilters} active
            </Badge>
          )}
          
          <span className="text-sm text-gray-400">
            {totalCount.toLocaleString()} events
          </span>
        </div>

        <div className="flex items-center gap-2">
          {activeFilters > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Clear all
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <ChevronDown className={cn(
              'w-4 h-4 transition-transform',
              isExpanded && 'rotate-180'
            )} />
          </Button>
        </div>
      </div>

      {/* Quick Filters - Always Visible */}
      <div className="px-4 pb-4">
        <div className="flex flex-wrap gap-2">
          {/* Threat Level Quick Filters */}
          {threatLevelOptions.map((option) => (
            <QuickFilterChip
              key={option.value}
              label={option.label}
              isActive={filters.threatLevels?.includes(option.value) || false}
              color={option.color}
              onClick={() => toggleArrayFilter('threatLevels', option.value)}
            />
          ))}
        </div>
      </div>

      {/* Expanded Filters */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 border-t border-slate-700/50 pt-4">
              {/* Search */}
              <Input
                placeholder="Search events..."
                value={filters.searchQuery || ''}
                onChange={(e) => setFilters({ searchQuery: e.target.value })}
                leftIcon={<Search className="w-4 h-4" />}
              />

              {/* Event Type Filter */}
              <FilterSection title="Event Type">
                <div className="flex flex-wrap gap-2">
                  {eventTypeOptions.map((option) => (
                    <QuickFilterChip
                      key={option.value}
                      label={option.label}
                      isActive={filters.eventTypes?.includes(option.value) || false}
                      onClick={() => toggleArrayFilter('eventTypes', option.value)}
                    />
                  ))}
                </div>
              </FilterSection>

              {/* Category Filter */}
              <FilterSection title="Category">
                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map((option) => (
                    <QuickFilterChip
                      key={option.value}
                      label={option.label}
                      isActive={filters.categories?.includes(option.value) || false}
                      onClick={() => toggleArrayFilter('categories', option.value)}
                    />
                  ))}
                </div>
              </FilterSection>

              {/* Status Filter */}
              <FilterSection title="Status">
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((option) => (
                    <QuickFilterChip
                      key={option.value}
                      label={option.label}
                      isActive={filters.statuses?.includes(option.value) || false}
                      onClick={() => toggleArrayFilter('statuses', option.value)}
                    />
                  ))}
                </div>
              </FilterSection>

              {/* Anomaly Score Range */}
              <FilterSection title="Anomaly Score Range">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-gray-400 mb-1 block">Min</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={filters.minAnomalyScore || 0}
                      onChange={(e) => setFilters({ minAnomalyScore: Number(e.target.value) })}
                      className="w-full accent-cyan-500"
                    />
                    <span className="text-xs text-gray-500">{filters.minAnomalyScore || 0}</span>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-400 mb-1 block">Max</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={filters.maxAnomalyScore || 100}
                      onChange={(e) => setFilters({ maxAnomalyScore: Number(e.target.value) })}
                      className="w-full accent-cyan-500"
                    />
                    <span className="text-xs text-gray-500">{filters.maxAnomalyScore || 100}</span>
                  </div>
                </div>
              </FilterSection>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Summary */}
      {activeFilters > 0 && (
        <div className="px-4 pb-4">
          <div className="flex flex-wrap gap-2">
            {filters.threatLevels?.map((level) => (
              <ActiveFilterBadge
                key={`level-${level}`}
                label={level}
                type="threatLevel"
                value={level}
                onRemove={() => toggleArrayFilter('threatLevels', level)}
              />
            ))}
            {filters.eventTypes?.map((type) => (
              <ActiveFilterBadge
                key={`type-${type}`}
                label={eventTypeOptions.find(o => o.value === type)?.label || type}
                type="eventType"
                value={type}
                onRemove={() => toggleArrayFilter('eventTypes', type)}
              />
            ))}
            {filters.categories?.map((cat) => (
              <ActiveFilterBadge
                key={`cat-${cat}`}
                label={cat}
                type="category"
                value={cat}
                onRemove={() => toggleArrayFilter('categories', cat)}
              />
            ))}
            {filters.searchQuery && (
              <ActiveFilterBadge
                label={`Search: "${filters.searchQuery}"`}
                type="search"
                value=""
                onRemove={() => setFilters({ searchQuery: '' })}
              />
            )}
          </div>
        </div>
      )}
    </Card>
  );

  // Helper to toggle array filters
  function toggleArrayFilter(field: 'threatLevels' | 'eventTypes' | 'categories' | 'statuses', value: string) {
    const currentValues = (filters[field] as string[]) || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    setFilters({ [field]: newValues });
  }
};

// ============================================================
// FILTER SECTION
// ============================================================

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
}

const FilterSection = ({ title, children }: FilterSectionProps) => (
  <div>
    <h4 className="text-sm font-medium text-gray-300 mb-2">{title}</h4>
    {children}
  </div>
);

// ============================================================
// QUICK FILTER CHIP
// ============================================================

interface QuickFilterChipProps {
  label: string;
  isActive: boolean;
  color?: string;
  onClick: () => void;
}

const QuickFilterChip = ({ label, isActive, color, onClick }: QuickFilterChipProps) => (
  <button
    onClick={onClick}
    className={cn(
      'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all',
      'border',
      isActive
        ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
        : 'bg-slate-800/50 border-slate-700/50 text-gray-400 hover:border-slate-600/50 hover:text-gray-300'
    )}
  >
    {color && (
      <div className={cn('w-2 h-2 rounded-full', color)} />
    )}
    <span>{label}</span>
    {isActive && <Check className="w-3 h-3" />}
  </button>
);

// ============================================================
// ACTIVE FILTER BADGE
// ============================================================

interface ActiveFilterBadgeProps {
  label: string;
  type: string;
  value: string;
  onRemove: () => void;
}

const ActiveFilterBadge = ({ label, onRemove }: ActiveFilterBadgeProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
  >
    <Badge variant="primary" size="sm" className="pr-1">
      {label}
      <button
        onClick={onRemove}
        className="ml-1 p-0.5 rounded-full hover:bg-cyan-500/30 transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </Badge>
  </motion.div>
);
