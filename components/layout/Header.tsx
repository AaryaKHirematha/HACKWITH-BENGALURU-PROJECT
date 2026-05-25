/**
 * Header Component
 * Top navigation bar with search, notifications, user profile, and logout.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Bell, 
  User,
  ChevronDown,
  Command,
  Settings,
  LogOut,
  Zap,
  Activity
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAppStore, useWebSocketStore, useAuthStore } from '@/store';
import { Badge, Button } from '@/components/ui';
import { toastSuccess } from '@/components/ui/toast';

export const Header = () => {
  const { 
    toggleNotificationsPanel,
    toggleSettingsPanel 
  } = useAppStore();
  const { connected } = useWebSocketStore();
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className={cn(
      'h-16 border-b border-slate-700/50',
      'bg-slate-900/50 backdrop-blur-xl',
      'flex items-center justify-between px-6',
      'sticky top-0 z-30'
    )}>
      {/* Left Section - Search */}
      <div className="flex items-center gap-4 flex-1">
        <div className={cn(
          'relative flex items-center',
          'transition-all duration-300',
          searchFocused ? 'w-96' : 'w-64'
        )}>
          <Search className="absolute left-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search threats, agents, reports..."
            className={cn(
              'w-full pl-10 pr-4 py-2 rounded-lg',
              'bg-slate-800/50 border border-slate-700/50',
              'text-white text-sm placeholder-gray-500',
              'focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50',
              'transition-all duration-200'
            )}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <div className="absolute right-3 flex items-center gap-1 text-xs text-gray-500">
            <kbd className="px-1.5 py-0.5 bg-slate-700/50 rounded text-[10px]">
              <Command className="w-3 h-3 inline" />
            </kbd>
            <kbd className="px-1.5 py-0.5 bg-slate-700/50 rounded text-[10px]">K</kbd>
          </div>
        </div>
      </div>

      {/* Center Section - System Status */}
      <div className="hidden lg:flex items-center gap-6">
        <SystemStatusPill icon={<Zap className="w-3 h-3" />} label="CascadeFlow" status="active" />
        <SystemStatusPill icon={<Activity className="w-3 h-3" />} label="5 Agents" status="active" />
        <SystemStatusPill icon={<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />} label="WebSocket" status={connected ? 'active' : 'offline'} />
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleNotificationsPanel} className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center">3</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={toggleSettingsPanel}>
          <Settings className="w-5 h-5" />
        </Button>
        <div className="w-px h-8 bg-slate-700/50 mx-2" />
        <UserProfileDropdown />
      </div>
    </header>
  );
};

// ── SYSTEM STATUS PILL ──

interface SystemStatusPillProps {
  icon: React.ReactNode;
  label: string;
  status: 'active' | 'warning' | 'error' | 'offline';
}

const SystemStatusPill = ({ icon, label, status }: SystemStatusPillProps) => {
  const statusColors = {
    active: 'bg-green-500/10 text-green-400 border-green-500/30',
    warning: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    error: 'bg-red-500/10 text-red-400 border-red-500/30',
    offline: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
  };
  return (
    <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-full', 'text-xs font-medium border', statusColors[status])}>
      {icon}
      <span>{label}</span>
    </div>
  );
};

// ── USER PROFILE DROPDOWN ──

const UserProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();

  const displayName = user?.username ?? 'Guest';
  const displayEmail = user?.email ?? '';
  const initials = user?.avatarInitials ?? '??';
  const role = user?.role ?? 'Unauthenticated';
  const department = user?.department ?? '';

  const handleNavigate = (path: string) => {
    setIsOpen(false);
    // Small delay to let the dropdown close animation start before navigation
    setTimeout(() => navigate(path), 60);
  };

  const handleSignOut = () => {
    setIsOpen(false);
    toastSuccess({ title: 'Signed Out', description: 'Your enterprise session has been terminated. Returning to login screen.' });
    setTimeout(() => signOut(), 100);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'flex items-center gap-3 px-3 py-2 rounded-lg select-none',
          'hover:bg-white/5 transition-colors',
          isOpen && 'bg-white/5'
        )}
      >
        <div className={cn(
          'w-8 h-8 rounded-lg',
          'bg-gradient-to-br from-cyan-500 to-purple-500',
          'flex items-center justify-center',
          'text-white text-sm font-semibold flex-shrink-0'
        )}>
          {initials}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-white">{displayName}</p>
          <p className="text-xs text-gray-400">{role}{department ? ` • ${department}` : ''}</p>
        </div>
        <ChevronDown className={cn('w-4 h-4 text-gray-400 transition-transform flex-shrink-0', isOpen && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="dropdown-panel"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute right-0 top-full mt-2 w-56',
              'bg-slate-800 border border-slate-700/50',
              'rounded-xl shadow-xl shadow-black/30',
              'overflow-hidden z-50'
            )}
          >
            <div className="p-4 border-b border-slate-700/50">
              <p className="text-sm font-medium text-white">{displayName}</p>
              <p className="text-xs text-gray-400">{displayEmail || '🔒 Secure Session'}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="primary" size="sm">{role}</Badge>
                <Badge variant="success" size="sm">Active</Badge>
              </div>
            </div>

            <div className="p-2">
              <button
                onClick={() => handleNavigate('/team')}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors text-left"
              >
                <User className="w-4 h-4" />
                Profile
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  toggleSettingsPanel();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors text-left"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <div className="my-1 border-t border-slate-700/50" />
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invisible backdrop to close on outside click */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

// Ensure toggleSettingsPanel is accessible from the button scope
function toggleSettingsPanel() {
  useAppStore.getState().toggleSettingsPanel();
}
