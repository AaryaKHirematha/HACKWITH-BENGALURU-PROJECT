/**
 * Event Detail Modal Component
 * Comprehensive view of a single threat event with all metadata
 * Features evidence display, AI analysis, and related events
 */

import { 
  Shield, 
  Clock, 
  MapPin, 
  User, 
  Cpu, 
  AlertTriangle,
  ExternalLink,
  Copy,
  Tag,
  Link2,
  Brain
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button, Badge, Modal, Card, CardHeader, CardTitle } from '@/components/ui';
import { formatDate, timeAgo, formatConfidence } from '@/utils/format';
import type { ThreatEvent, ThreatLevel } from '@/simulation/types';

// ============================================================
// EVENT DETAIL MODAL COMPONENT
// ============================================================

interface EventDetailModalProps {
  event: ThreatEvent | null;
  open: boolean;
  onClose: () => void;
}

export const EventDetailModal = ({ event, open, onClose }: EventDetailModalProps) => {
  if (!event) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Event Details"
      size="xl"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              navigator.clipboard.writeText(event.eventId);
              import('@/components/ui/toast').then(({ toastSuccess }) => {
                toastSuccess({ title: 'ID Copied', description: `${event.eventId} copied to clipboard.` });
              });
            }}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy ID
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onClose();
              import('@/components/ui/toast').then(({ toastSuccess }) => {
                toastSuccess({ title: 'Investigation Initiated', description: `Launched forensic correlation for ${event.eventId}.` });
              });
              window.location.href = '/reports';
            }}
          >
            Investigate
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Event Header */}
        <div className="flex items-start gap-4">
          <div className={cn(
            'p-3 rounded-lg',
            getSeverityBgColor(event.threatLevel)
          )}>
            <Shield className={cn('w-6 h-6', getSeverityTextColor(event.threatLevel))} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Badge variant={getSeverityBadgeVariant(event.threatLevel)} glow={event.threatLevel === 'critical'}>
                {event.threatLevel.toUpperCase()}
              </Badge>
              <Badge variant="secondary">{event.eventType.replace(/_/g, ' ')}</Badge>
              <Badge variant="info">{event.category}</Badge>
            </div>
            <h3 className="text-xl font-semibold text-white mb-1">{event.title}</h3>
            <p className="text-sm font-mono text-gray-400">{event.eventId}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">{event.anomalyScore}</p>
            <p className="text-xs text-gray-400">Anomaly Score</p>
          </div>
        </div>

        {/* Key Information Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <InfoCard
            icon={<Clock className="w-4 h-4" />}
            label="Timestamp"
            value={formatDate(event.timestamp)}
            subValue={timeAgo(event.timestamp)}
          />
          <InfoCard
            icon={<Cpu className="w-4 h-4" />}
            label="Source"
            value={event.sourceType}
            subValue={event.device?.hostname}
          />
          <InfoCard
            icon={<User className="w-4 h-4" />}
            label="User"
            value={event.user?.username || 'Unknown'}
            subValue={event.user?.department}
          />
          <InfoCard
            icon={<MapPin className="w-4 h-4" />}
            label="Location"
            value={event.geolocation?.city || 'Unknown'}
            subValue={event.geolocation?.country}
          />
        </div>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle>
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Description
            </CardTitle>
          </CardHeader>
          <p className="text-gray-300">{event.description}</p>
        </Card>

        {/* AI Analysis */}
        <Card glow="purple">
          <CardHeader>
            <CardTitle>
              <Brain className="w-5 h-5 text-purple-400" />
              AI Analysis
            </CardTitle>
            <Badge variant="success" size="sm">
              {formatConfidence(event.confidenceScore)}
            </Badge>
          </CardHeader>
          <div className="space-y-4">
            <p className="text-gray-300">{event.aiSummary}</p>
            
            {event.aiAnalysis && (
              <div className="space-y-4">
                {/* MITRE Tactics */}
                {event.aiAnalysis.mitreTactics.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">MITRE ATT&CK Tactics</h4>
                    <div className="flex flex-wrap gap-2">
                      {event.aiAnalysis.mitreTactics.map((tactic) => (
                        <Badge key={tactic.tacticId} variant="secondary" size="sm">
                          {tactic.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Recommendations */}
                {event.aiAnalysis.recommendations.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Recommendations</h4>
                    <ul className="space-y-1">
                      {event.aiAnalysis.recommendations.slice(0, 3).map((rec, i) => (
                        <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                          <span className="text-cyan-400 mt-1">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Tag className="w-5 h-5 text-gray-400" />
              Tags & Indicators
            </CardTitle>
          </CardHeader>
          <div className="flex flex-wrap gap-2">
            {event.tags.map((tag) => (
              <Badge key={tag} variant="secondary" size="sm">
                {tag}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Related Events */}
        {event.relatedEvents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>
                <Link2 className="w-5 h-5 text-gray-400" />
                Related Events ({event.relatedEvents.length})
              </CardTitle>
            </CardHeader>
            <div className="space-y-2">
              {event.relatedEvents.slice(0, 3).map((relatedId) => (
                <div
                  key={relatedId}
                  className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg"
                >
                  <span className="text-sm font-mono text-gray-400">{relatedId}</span>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Attack Chain Info */}
        {(event.killChainPhase || event.attackVector) && (
          <Card>
            <CardHeader>
              <CardTitle>Attack Chain</CardTitle>
            </CardHeader>
            <div className="grid grid-cols-2 gap-4">
              {event.killChainPhase && (
                <div>
                  <p className="text-sm text-gray-400 mb-1">Kill Chain Phase</p>
                  <Badge variant="primary">{event.killChainPhase.replace(/_/g, ' ')}</Badge>
                </div>
              )}
              {event.attackVector && (
                <div>
                  <p className="text-sm text-gray-400 mb-1">Attack Vector</p>
                  <Badge variant="secondary">{event.attackVector}</Badge>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </Modal>
  );
};

// ============================================================
// INFO CARD SUB-COMPONENT
// ============================================================

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue?: string;
}

const InfoCard = ({ icon, label, value, subValue }: InfoCardProps) => (
  <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
    <div className="flex items-center gap-2 text-gray-400 mb-1">
      {icon}
      <span className="text-xs">{label}</span>
    </div>
    <p className="text-sm font-medium text-white truncate">{value}</p>
    {subValue && (
      <p className="text-xs text-gray-500 truncate">{subValue}</p>
    )}
  </div>
);

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getSeverityBgColor(level: ThreatLevel): string {
  const colors: Record<ThreatLevel, string> = {
    critical: 'bg-red-500/20',
    high: 'bg-orange-500/20',
    medium: 'bg-yellow-500/20',
    low: 'bg-blue-500/20',
    info: 'bg-gray-500/20',
  };
  return colors[level];
}

function getSeverityTextColor(level: ThreatLevel): string {
  const colors: Record<ThreatLevel, string> = {
    critical: 'text-red-400',
    high: 'text-orange-400',
    medium: 'text-yellow-400',
    low: 'text-blue-400',
    info: 'text-gray-400',
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
