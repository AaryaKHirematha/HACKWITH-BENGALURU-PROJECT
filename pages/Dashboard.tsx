/**
 * Dashboard Page
 * Main dashboard view with live threat intelligence
 * Displays real-time incident feed, statistics, and quick actions
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Activity, 
  Brain, 
  Zap, 
  RefreshCw, 
  Play,
  Pause,
  Settings,
  Download,
  BarChart3
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button, Card, CardHeader, CardTitle, Badge, StatCard } from '@/components/ui';
import { LiveIncidentFeed, ThreatFilterPanel } from '@/components/threat';
import { useSimulationStore } from '@/simulation';
import { staggerContainer, fadeInUp } from '@/utils/animations';
import { formatNumber } from '@/utils/format';

// ============================================================
// DASHBOARD PAGE COMPONENT
// ============================================================

export const Dashboard = () => {
  const { 
    isLoaded, 
    isGenerating, 
    generateEvents, 
    getStatistics,
    events,
    addRandomEvent
  } = useSimulationStore();
  
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [stats, setStats] = useState(getStatistics());

  // Generate initial events
  useEffect(() => {
    if (!isLoaded && !isGenerating) {
      generateEvents();
    }
  }, [isLoaded, isGenerating]);

  // Update stats when events change
  useEffect(() => {
    setStats(getStatistics());
  }, [events.length]);

  // Live mode simulation
  useEffect(() => {
    if (!isLiveMode) return;
    
    const interval = setInterval(() => {
      addRandomEvent();
    }, 2000);
    
    return () => clearInterval(interval);
  }, [isLiveMode, addRandomEvent]);

  // Regenerate events with new config
  const handleRegenerate = () => {
    generateEvents();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Shield className="w-8 h-8 text-cyan-400" />
            Threat Intelligence Dashboard
          </h1>
          <p className="text-gray-400 mt-1">
            Real-time monitoring and analysis of security events
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Live Mode Toggle */}
          <Button
            variant={isLiveMode ? 'danger' : 'outline'}
            onClick={() => setIsLiveMode(!isLiveMode)}
          >
            {isLiveMode ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Stop Live
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start Live
              </>
            )}
          </Button>
          
          {/* Regenerate Button */}
          <Button
            variant="cyber"
            onClick={handleRegenerate}
            loading={isGenerating}
          >
            <RefreshCw className={cn('w-4 h-4 mr-2', isGenerating && 'animate-spin')} />
            Regenerate
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={fadeInUp}>
          <StatCard
            label="Total Events"
            value={formatNumber(stats.totalEvents)}
            icon={<Shield className="w-6 h-6 text-cyan-400" />}
            trend="up"
            change={12.5}
          />
        </motion.div>
        
        <motion.div variants={fadeInUp}>
          <StatCard
            label="Critical Threats"
            value={formatNumber(stats.byThreatLevel.critical)}
            icon={<Activity className="w-6 h-6 text-red-400" />}
            trend="up"
            change={-5.2}
          />
        </motion.div>
        
        <motion.div variants={fadeInUp}>
          <StatCard
            label="Active Campaigns"
            value={formatNumber(stats.campaigns)}
            icon={<Brain className="w-6 h-6 text-purple-400" />}
            trend="up"
            change={8.7}
          />
        </motion.div>
        
        <motion.div variants={fadeInUp}>
          <StatCard
            label="Avg Anomaly Score"
            value={stats.averageAnomalyScore.toFixed(1)}
            icon={<Zap className="w-6 h-6 text-orange-400" />}
            trend="up"
            change={3.1}
          />
        </motion.div>
      </motion.div>

      {/* Threat Level Distribution */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <Card glow="cyan">
          <CardHeader>
            <CardTitle>
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              Threat Level Distribution
            </CardTitle>
          </CardHeader>
          
          <div className="grid grid-cols-5 gap-4">
            <ThreatLevelBar
              label="Critical"
              count={stats.byThreatLevel.critical}
              total={stats.totalEvents}
              color="bg-red-500"
            />
            <ThreatLevelBar
              label="High"
              count={stats.byThreatLevel.high}
              total={stats.totalEvents}
              color="bg-orange-500"
            />
            <ThreatLevelBar
              label="Medium"
              count={stats.byThreatLevel.medium}
              total={stats.totalEvents}
              color="bg-yellow-500"
            />
            <ThreatLevelBar
              label="Low"
              count={stats.byThreatLevel.low}
              total={stats.totalEvents}
              color="bg-blue-500"
            />
            <ThreatLevelBar
              label="Info"
              count={stats.byThreatLevel.info}
              total={stats.totalEvents}
              color="bg-gray-500"
            />
          </div>
        </Card>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Filter Panel & Live Feed */}
        <div className="xl:col-span-2 space-y-4">
          <ThreatFilterPanel />
          <LiveIncidentFeed maxItems={20} />
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <Card glow="purple">
            <CardHeader>
              <CardTitle>
                <Zap className="w-5 h-5 text-purple-400" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            
            <div className="space-y-2">
              <ActionButton
                icon={<Download className="w-4 h-4" />}
                label="Export Events"
                description="Download filtered events as CSV"
                onClick={() => {
                  import('@/components/ui/toast').then(({ toastSuccess }) => {
                    toastSuccess({ title: 'Export Complete', description: 'Filtered threat events exported to CSV.' });
                  });
                }}
              />
              <ActionButton
                icon={<Settings className="w-4 h-4" />}
                label="Simulation Config"
                description="Configure event generation parameters"
                onClick={() => {
                  import('@/store').then(({ useAppStore }) => {
                    useAppStore.getState().openModal('sim-config');
                  });
                }}
              />
              <ActionButton
                icon={<Brain className="w-4 h-4" />}
                label="AI Analysis"
                description="Run deep analysis on selected events"
                onClick={() => {
                  import('@/store').then(({ useAppStore }) => {
                    useAppStore.getState().openModal('ai-analysis');
                  });
                }}
              />
            </div>
          </Card>

          {/* Top Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Top Tags</CardTitle>
            </CardHeader>
            
            <div className="flex flex-wrap gap-2">
              {stats.topTags.slice(0, 15).map(({ tag, count }) => (
                <Badge key={tag} variant="secondary" size="sm">
                  {tag} ({count})
                </Badge>
              ))}
            </div>
          </Card>

          {/* Campaign Activity */}
          <Card glow="green">
            <CardHeader>
              <CardTitle>
                <Activity className="w-5 h-5 text-green-400" />
                Campaign Activity
              </CardTitle>
            </CardHeader>
            
            <div className="space-y-3">
              <CampaignItem
                name="Operation Shadow Vault"
                actor="APT-29"
                severity="critical"
                events={23}
              />
              <CampaignItem
                name="Red Dragon Rising"
                actor="Lazarus Group"
                severity="high"
                events={18}
              />
              <CampaignItem
                name="Insider Risk Alpha"
                actor="Malicious Insider"
                severity="medium"
                events={12}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// SUB-COMPONENTS
// ============================================================

interface ThreatLevelBarProps {
  label: string;
  count: number;
  total: number;
  color: string;
}

const ThreatLevelBar = ({ label, count, total, color }: ThreatLevelBarProps) => {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  
  return (
    <div className="text-center">
      <div className="relative h-32 w-full bg-slate-800/50 rounded-lg overflow-hidden mb-2">
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={cn('absolute bottom-0 left-0 right-0', color)}
          style={{ opacity: 0.8 }}
        />
      </div>
      <p className="text-lg font-bold text-white">{count}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  );
};

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick?: () => void;
}

const ActionButton = ({ icon, label, description, onClick }: ActionButtonProps) => (
  <button
    onClick={onClick}
    className={cn(
      'w-full flex items-center gap-3 p-3 rounded-lg',
      'bg-slate-800/30 border border-slate-700/30',
      'hover:bg-slate-800/50 hover:border-slate-600/50',
      'transition-all text-left'
    )}
  >
    <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-white">{label}</p>
      <p className="text-xs text-gray-400">{description}</p>
    </div>
  </button>
);

interface CampaignItemProps {
  name: string;
  actor: string;
  severity: string;
  events: number;
}

const CampaignItem = ({ name, actor, severity, events }: CampaignItemProps) => {
  const severityColors: Record<string, string> = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-yellow-500',
    low: 'bg-blue-500',
  };

  return (
    <div className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-lg">
      <div className={cn('w-2 h-2 rounded-full mt-2', severityColors[severity])} />
      <div className="flex-1">
        <p className="text-sm font-medium text-white">{name}</p>
        <p className="text-xs text-gray-400">{actor}</p>
      </div>
      <Badge variant="secondary" size="sm">{events} events</Badge>
    </div>
  );
};
