/**
 * Live Incident Feed Component
 * Real-time display of incoming threat events
 * Features animated cards, severity indicators, and auto-scroll
 */

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  Shield, 
  Radio, 
  Clock, 
  ChevronDown,
  ChevronUp,
  ExternalLink,
  MapPin,
  User,
  Cpu,
  Zap
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Badge, Button, Card } from '@/components/ui';
import { useSimulationStore } from '@/simulation';
import { timeAgo, formatNumber } from '@/utils/format';
import { staggerContainer, fadeInUp } from '@/utils/animations';
import type { ThreatEvent, ThreatLevel } from '@/simulation/types';

// ============================================================
// LIVE INCIDENT FEED COMPONENT
// ============================================================

interface LiveIncidentFeedProps {
  maxItems?: number;
  autoScroll?: boolean;
  showFilters?: boolean;
}

export const LiveIncidentFeed = ({ 
  maxItems = 50, 
  autoScroll = true,
  showFilters: _showFilters = true 
}: LiveIncidentFeedProps) => {
  const { filteredEvents, selectEvent, selectedEvent } = useSimulationStore();
  const [isAutoScrolling, setIsAutoScrolling] = useState(autoScroll);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const [highlightedEvents, setHighlightedEvents] = useState<Set<string>>(new Set());

  // Get latest events
  const displayEvents = filteredEvents.slice(0, maxItems);

  // Auto-scroll to top when new events arrive
  useEffect(() => {
    if (isAutoScrolling && feedRef.current) {
      feedRef.current.scrollTop = 0;
    }
  }, [displayEvents.length, isAutoScrolling]);

  // Highlight new events temporarily
  useEffect(() => {
    if (displayEvents.length > 0) {
      const newEventId = displayEvents[0].id;
      setHighlightedEvents(new Set([newEventId]));
      
      const timeout = setTimeout(() => {
        setHighlightedEvents(new Set());
      }, 2000);
      
      return () => clearTimeout(timeout);
    }
  }, [displayEvents[0]?.id]);

  return (
    <Card className="h-full flex flex-col" noPadding>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Radio className="w-5 h-5 text-red-400" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Live Incident Feed</h3>
            <p className="text-xs text-gray-400">
              {formatNumber(filteredEvents.length)} events detected
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={isAutoScrolling ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setIsAutoScrolling(!isAutoScrolling)}
          >
            <Zap className="w-4 h-4 mr-1" />
            Auto-scroll
          </Button>
        </div>
      </div>

      {/* Feed Content */}
      <div 
        ref={feedRef}
        className="flex-1 overflow-y-auto p-4 space-y-3"
        style={{ maxHeight: '600px' }}
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          <AnimatePresence mode="popLayout">
            {displayEvents.map((event) => (
              <motion.div
                key={event.id}
                layout
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <IncidentCard
                  event={event}
                  isExpanded={expandedEvent === event.id}
                  isSelected={selectedEvent?.id === event.id}
                  isHighlighted={highlightedEvents.has(event.id)}
                  onToggleExpand={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                  onSelect={() => selectEvent(event)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {displayEvents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Shield className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-lg font-medium">No events detected</p>
            <p className="text-sm">Adjust filters or generate new events</p>
          </div>
        )}
      </div>
    </Card>
  );
};

// ============================================================
// INCIDENT CARD COMPONENT
// ============================================================

interface IncidentCardProps {
  event: ThreatEvent;
  isExpanded: boolean;
  isSelected: boolean;
  isHighlighted: boolean;
  onToggleExpand: () => void;
  onSelect: () => void;
}

const IncidentCard = ({
  event,
  isExpanded,
  isSelected,
  isHighlighted,
  onToggleExpand,
  onSelect,
}: IncidentCardProps) => {

  return (
    <motion.div
      layout
      className={cn(
        'relative rounded-lg border transition-all duration-200',
        'bg-slate-800/50 backdrop-blur-sm',
        isSelected
          ? 'border-cyan-500/50 ring-1 ring-cyan-500/30'
          : 'border-slate-700/50 hover:border-slate-600/50',
        isHighlighted && 'ring-2 ring-cyan-400/50 animate-pulse',
      )}
    >
      {/* Severity Indicator */}
      <div className={cn(
        'absolute left-0 top-0 bottom-0 w-1 rounded-l-lg',
        getSeverityColor(event.threatLevel)
      )} />

      {/* Main Content */}
      <div className="pl-4 pr-3 py-3">
        <div className="flex items-start justify-between gap-3">
          {/* Left Section */}
          <div className="flex-1 min-w-0">
            {/* Header Row */}
            <div className="flex items-center gap-2 mb-1">
              <Badge 
                variant={getSeverityBadgeVariant(event.threatLevel)} 
                size="sm"
                glow={event.threatLevel === 'critical'}
              >
                {event.threatLevel.toUpperCase()}
              </Badge>
              <span className="text-xs font-mono text-gray-500">{event.eventId}</span>
            </div>

            {/* Title */}
            <h4 className="text-sm font-medium text-white truncate mb-1">
              {event.title}
            </h4>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {timeAgo(event.timestamp)}
              </span>
              <span className="flex items-center gap-1">
                <Cpu className="w-3 h-3" />
                {event.sourceType}
              </span>
              {event.user && (
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {event.user.username}
                </span>
              )}
              {event.geolocation && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {event.geolocation.city}, {event.geolocation.countryCode}
                </span>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Anomaly Score */}
            <div className={cn(
              'px-2 py-1 rounded text-xs font-medium',
              getAnomalyScoreStyle(event.anomalyScore)
            )}>
              {event.anomalyScore}
            </div>

            {/* Actions */}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand();
              }}
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-2">
          {event.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-slate-700/50 rounded text-[10px] text-gray-400"
            >
              {tag}
            </span>
          ))}
          {event.tags.length > 3 && (
            <span className="px-2 py-0.5 bg-slate-700/50 rounded text-[10px] text-gray-400">
              +{event.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 border-t border-slate-700/50">
              {/* Description */}
              <p className="text-sm text-gray-300 mb-3">{event.description}</p>
              
              {/* AI Summary */}
              <div className="bg-slate-900/50 rounded-lg p-3 mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-medium text-amber-400">AI Analysis</span>
                </div>
                <p className="text-xs text-gray-400">{event.aiSummary}</p>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={onSelect}>
                  <ExternalLink className="w-4 h-4 mr-1" />
                  View Details
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    import('@/components/ui/toast').then(({ toastSuccess }) => {
                      toastSuccess({ title: 'Investigation Initiated', description: `Launched forensic correlation for ${event.eventId}.` });
                    });
                    window.location.href = '/reports';
                  }}
                >
                  Investigate
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    import('@/store').then(({ useAppStore }) => {
                      useAppStore.getState().openModal('assign-threat');
                    });
                  }}
                >
                  Assign
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getSeverityColor(level: ThreatLevel): string {
  const colors: Record<ThreatLevel, string> = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-yellow-500',
    low: 'bg-blue-500',
    info: 'bg-gray-500',
  };
  return colors[level];
}

function getSeverityBadgeVariant(level: ThreatLevel): 'critical' | 'high' | 'medium' | 'low' | 'info_level' {
  const variants: Record<ThreatLevel, 'critical' | 'high' | 'medium' | 'low' | 'info_level'> = {
    critical: 'critical',
    high: 'high',
    medium: 'medium',
    low: 'low',
    info: 'info_level',
  };
  return variants[level];
}

function getAnomalyScoreStyle(score: number): string {
  if (score >= 80) return 'bg-red-500/20 text-red-400';
  if (score >= 60) return 'bg-orange-500/20 text-orange-400';
  if (score >= 40) return 'bg-yellow-500/20 text-yellow-400';
  return 'bg-green-500/20 text-green-400';
}
