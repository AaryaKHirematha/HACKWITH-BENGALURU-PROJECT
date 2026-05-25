/**
 * Sidebar Component
 * Animated cyberpunk sidebar with navigation and system status
 */

import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Shield, 
  Brain,
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  Eye,
  Radio,
  Database,
  FileText,
  Users,
  HelpCircle,
  Cpu,
  Film
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { sidebarAnimation } from '@/utils/animations';
import { useAppStore } from '@/store';
import { Badge } from '@/components/ui/badge';

// ============================================================
// NAVIGATION ITEMS
// ============================================================

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
  section: 'main' | 'intelligence' | 'system';
}

const navigationItems: NavItem[] = [
  // Main Navigation
  { id: 'command', label: 'Command Center', icon: LayoutDashboard, path: '/', section: 'main' },
  { id: 'demo', label: 'Demo Mode', icon: Film, path: '/demo', section: 'main' },
  { id: 'threats', label: 'Threat Intel', icon: Shield, path: '/threats', badge: 12, section: 'main' },
  { id: 'agents', label: 'AI Agents', icon: Brain, path: '/agents', section: 'main' },
  { id: 'cascade', label: 'CascadeFlow', icon: Zap, path: '/cascade', section: 'main' },
  
  // Intelligence
  { id: 'hunt', label: 'Threat Hunt', icon: Eye, path: '/hunt', section: 'intelligence' },
  { id: 'feeds', label: 'Intel Feeds', icon: Radio, path: '/feeds', section: 'intelligence' },
  { id: 'ioc', label: 'IoC Database', icon: Database, path: '/ioc', section: 'intelligence' },
  { id: 'reports', label: 'Reports', icon: FileText, path: '/reports', section: 'intelligence' },
  
  // System
  { id: 'team', label: 'Team', icon: Users, path: '/team', section: 'system' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings', section: 'system' },
  { id: 'help', label: 'Help & Docs', icon: HelpCircle, path: '/help', section: 'system' },
];

// ============================================================
// SIDEBAR COMPONENT
// ============================================================

export const Sidebar = () => {
  const { sidebarExpanded, toggleSidebar } = useAppStore();
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Group items by section
  const mainItems = navigationItems.filter((item) => item.section === 'main');
  const intelItems = navigationItems.filter((item) => item.section === 'intelligence');
  const systemItems = navigationItems.filter((item) => item.section === 'system');

  return (
    <motion.aside
      initial={false}
      animate={sidebarExpanded ? 'open' : 'closed'}
      variants={sidebarAnimation}
      className={cn(
        'fixed left-0 top-0 bottom-0 z-40',
        'bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-800/90',
        'border-r border-slate-700/50',
        'flex flex-col',
        'overflow-hidden'
      )}
    >
      {/* Header / Logo */}
      <div className={cn(
        'flex items-center gap-3 p-4 border-b border-slate-700/50',
        !sidebarExpanded && 'justify-center px-2'
      )}>
        {/* Logo Icon */}
        <div className="relative flex-shrink-0">
          <div className={cn(
            'w-10 h-10 rounded-lg',
            'bg-gradient-to-br from-cyan-500 to-cyan-600',
            'flex items-center justify-center',
            'shadow-lg shadow-cyan-500/30'
          )}>
            <Shield className="w-6 h-6 text-white" />
          </div>
          {/* Pulse indicator */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900">
            <div className="w-full h-full bg-green-400 rounded-full animate-ping" />
          </div>
        </div>
        
        {/* Logo Text */}
        <AnimatePresence>
          {sidebarExpanded && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">
                AEGIS
              </h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                Threat Intelligence
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        {/* Main Section */}
        <NavSection
          title="Main"
          items={mainItems}
          expanded={sidebarExpanded}
          hoveredItem={hoveredItem}
          onHover={setHoveredItem}
          currentPath={location.pathname}
        />

        {/* Intelligence Section */}
        <NavSection
          title="Intelligence"
          items={intelItems}
          expanded={sidebarExpanded}
          hoveredItem={hoveredItem}
          onHover={setHoveredItem}
          currentPath={location.pathname}
        />

        {/* System Section */}
        <NavSection
          title="System"
          items={systemItems}
          expanded={sidebarExpanded}
          hoveredItem={hoveredItem}
          onHover={setHoveredItem}
          currentPath={location.pathname}
        />
      </nav>

      {/* System Status */}
      <div className={cn(
        'border-t border-slate-700/50 p-4',
        !sidebarExpanded && 'px-2'
      )}>
        <SystemStatus expanded={sidebarExpanded} />
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={cn(
          'absolute top-20 -right-3',
          'w-6 h-6 rounded-full',
          'bg-slate-800 border border-slate-600/50',
          'flex items-center justify-center',
          'text-gray-400 hover:text-white',
          'hover:bg-slate-700 transition-colors',
          'z-50'
        )}
      >
        {sidebarExpanded ? (
          <ChevronLeft className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>
    </motion.aside>
  );
};

// ============================================================
// NAVIGATION SECTION
// ============================================================

interface NavSectionProps {
  title: string;
  items: NavItem[];
  expanded: boolean;
  hoveredItem: string | null;
  onHover: (id: string | null) => void;
  currentPath: string;
}

const NavSection = ({ title, items, expanded, hoveredItem, onHover, currentPath }: NavSectionProps) => {
  return (
    <div>
      <AnimatePresence>
        {expanded && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-[10px] uppercase tracking-wider text-gray-500 px-3 mb-2 font-semibold"
          >
            {title}
          </motion.p>
        )}
      </AnimatePresence>
      
      <div className="space-y-1">
        {items.map((item) => (
          <NavItemComponent
            key={item.id}
            item={item}
            expanded={expanded}
            isActive={currentPath === item.path}
            isHovered={hoveredItem === item.id}
            onHover={() => onHover(item.id)}
            onLeave={() => onHover(null)}
          />
        ))}
      </div>
    </div>
  );
};

// ============================================================
// NAV ITEM
// ============================================================

interface NavItemComponentProps {
  item: NavItem;
  expanded: boolean;
  isActive: boolean;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}

const NavItemComponent = ({ 
  item, 
  expanded, 
  isActive, 
  isHovered, 
  onHover, 
  onLeave 
}: NavItemComponentProps) => {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={cn(
        'relative flex items-center gap-3 rounded-lg',
        'transition-all duration-200',
        expanded ? 'px-3 py-2.5' : 'px-0 py-2.5 justify-center',
        isActive 
          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' 
          : 'text-gray-400 hover:text-white hover:bg-white/5',
      )}
    >
      {/* Active indicator */}
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-500 rounded-r-full"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}

      <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-cyan-400')} />
      
      <AnimatePresence>
        {expanded && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            className="flex-1 text-sm font-medium whitespace-nowrap overflow-hidden"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Badge */}
      {item.badge && (
        <AnimatePresence>
          {expanded ? (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Badge variant="danger" size="sm">
                {item.badge}
              </Badge>
            </motion.span>
          ) : (
            isHovered && (
              <motion.div
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute left-full ml-2 px-2 py-1 bg-slate-800 rounded-md border border-slate-600 text-xs text-white whitespace-nowrap z-50"
              >
                {item.label}
                <Badge variant="danger" size="sm" className="ml-2">
                  {item.badge}
                </Badge>
              </motion.div>
            )
          )}
        </AnimatePresence>
      )}

      {/* Tooltip for collapsed state */}
      {!expanded && isHovered && !item.badge && (
        <motion.div
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute left-full ml-2 px-2 py-1 bg-slate-800 rounded-md border border-slate-600 text-xs text-white whitespace-nowrap z-50"
        >
          {item.label}
        </motion.div>
      )}
    </NavLink>
  );
};

// ============================================================
// SYSTEM STATUS
// ============================================================

interface SystemStatusProps {
  expanded: boolean;
}

const SystemStatus = ({ expanded }: SystemStatusProps) => {
  return (
    <div className={cn(
      'rounded-lg bg-slate-800/50 border border-slate-700/30',
      expanded ? 'p-3' : 'p-2'
    )}>
      {expanded ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>System Status</span>
          </div>
          
          <div className="space-y-2">
            <StatusRow label="Agents" value="5/5" status="online" />
            <StatusRow label="CPU" value="34%" status="normal" />
            <StatusRow label="Memory" value="67%" status="normal" />
          </div>

          <div className="pt-2 border-t border-slate-700/30">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500">Uptime: 99.97%</span>
              <span className="text-[10px] text-green-400">● Operational</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <Activity className="w-5 h-5 text-green-400" />
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </div>
      )}
    </div>
  );
};

const StatusRow = ({ label, value, status }: { label: string; value: string; status: string }) => (
  <div className="flex items-center justify-between text-xs">
    <span className="text-gray-500">{label}</span>
    <div className="flex items-center gap-1.5">
      <span className="text-gray-300">{value}</span>
      <div className={cn(
        'w-1.5 h-1.5 rounded-full',
        status === 'online' || status === 'normal' ? 'bg-green-500' : 'bg-orange-500'
      )} />
    </div>
  </div>
);
