/**
 * Toast Notifications
 * Enterprise-grade toast notification system using Sonner
 */

import { Toaster as SonnerToaster, toast as sonnerToast } from 'sonner';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  type LucideIcon 
} from 'lucide-react';
import { cn } from '@/utils/cn';

// ============================================================
// TOAST TYPES
// ============================================================

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// ============================================================
// TOAST ICONS
// ============================================================

const toastIcons: Record<ToastType, LucideIcon> = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const toastColors: Record<ToastType, string> = {
  success: 'text-green-400',
  error: 'text-red-400',
  warning: 'text-orange-400',
  info: 'text-cyan-400',
};

// ============================================================
// TOAST TOASTWR
// ============================================================

export const ToastProvider = () => {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        classNames: {
          toast: [
            'bg-slate-900/95 backdrop-blur-xl',
            'border border-slate-700/50',
            'text-white',
            'shadow-xl shadow-black/30',
            'rounded-xl',
          ].join(' '),
          title: 'font-semibold',
          description: 'text-gray-400',
          actionButton: 'bg-cyan-500 hover:bg-cyan-400 text-white',
          cancelButton: 'bg-slate-700 hover:bg-slate-600 text-gray-300',
        },
      }}
    />
  );
};

// ============================================================
// TOAST FUNCTIONS
// ============================================================

/**
 * Show a success toast
 */
export const toastSuccess = (options: ToastOptions) => {
  const Icon = toastIcons.success;
  return sonnerToast.custom(
    (id) => (
      <div className="flex items-start gap-3 p-4">
        <Icon className={cn('h-5 w-5 mt-0.5', toastColors.success)} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white">{options.title}</p>
          {options.description && (
            <p className="text-sm text-gray-400 mt-1">{options.description}</p>
          )}
        </div>
        {options.action && (
          <button
            onClick={() => {
              options.action?.onClick();
              sonnerToast.dismiss(id);
            }}
            className="text-sm font-medium text-cyan-400 hover:text-cyan-300"
          >
            {options.action.label}
          </button>
        )}
      </div>
    ),
    { duration: options.duration || 5000 }
  );
};

/**
 * Show an error toast
 */
export const toastError = (options: ToastOptions) => {
  const Icon = toastIcons.error;
  return sonnerToast.custom(
    (id) => (
      <div className="flex items-start gap-3 p-4">
        <Icon className={cn('h-5 w-5 mt-0.5', toastColors.error)} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white">{options.title}</p>
          {options.description && (
            <p className="text-sm text-gray-400 mt-1">{options.description}</p>
          )}
        </div>
        {options.action && (
          <button
            onClick={() => {
              options.action?.onClick();
              sonnerToast.dismiss(id);
            }}
            className="text-sm font-medium text-cyan-400 hover:text-cyan-300"
          >
            {options.action.label}
          </button>
        )}
      </div>
    ),
    { duration: options.duration || 7000 }
  );
};

/**
 * Show a warning toast
 */
export const toastWarning = (options: ToastOptions) => {
  const Icon = toastIcons.warning;
  return sonnerToast.custom(
    (id) => (
      <div className="flex items-start gap-3 p-4">
        <Icon className={cn('h-5 w-5 mt-0.5', toastColors.warning)} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white">{options.title}</p>
          {options.description && (
            <p className="text-sm text-gray-400 mt-1">{options.description}</p>
          )}
        </div>
        {options.action && (
          <button
            onClick={() => {
              options.action?.onClick();
              sonnerToast.dismiss(id);
            }}
            className="text-sm font-medium text-cyan-400 hover:text-cyan-300"
          >
            {options.action.label}
          </button>
        )}
      </div>
    ),
    { duration: options.duration || 5000 }
  );
};

/**
 * Show an info toast
 */
export const toastInfo = (options: ToastOptions) => {
  const Icon = toastIcons.info;
  return sonnerToast.custom(
    (id) => (
      <div className="flex items-start gap-3 p-4">
        <Icon className={cn('h-5 w-5 mt-0.5', toastColors.info)} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white">{options.title}</p>
          {options.description && (
            <p className="text-sm text-gray-400 mt-1">{options.description}</p>
          )}
        </div>
        {options.action && (
          <button
            onClick={() => {
              options.action?.onClick();
              sonnerToast.dismiss(id);
            }}
            className="text-sm font-medium text-cyan-400 hover:text-cyan-300"
          >
            {options.action.label}
          </button>
        )}
      </div>
    ),
    { duration: options.duration || 5000 }
  );
};

/**
 * Show a loading toast
 */
export const toastLoading = (message: string) => {
  return sonnerToast.loading(message);
};

/**
 * Dismiss all toasts
 */
export const toastDismissAll = () => {
  sonnerToast.dismiss();
};
