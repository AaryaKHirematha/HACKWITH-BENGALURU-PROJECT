/**
 * Modal Component
 * Enterprise-grade modal with animations and accessibility
 */

import { useEffect, useCallback, forwardRef, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { scaleIn } from '@/utils/animations';
import { Button } from './button';

// ============================================================
// MODAL TYPES
// ============================================================

export interface ModalProps {
  /** Whether modal is open */
  open: boolean;
  /** Close handler */
  onClose: () => void;
  /** Modal title */
  title?: string;
  /** Modal description */
  description?: string;
  /** Modal content */
  children: ReactNode;
  /** Modal size */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Show close button */
  showClose?: boolean;
  /** Close on backdrop click */
  closeOnBackdrop?: boolean;
  /** Close on escape key */
  closeOnEscape?: boolean;
  /** Custom footer */
  footer?: ReactNode;
  /** Additional class names */
  className?: string;
}

// ============================================================
// MODAL SIZES
// ============================================================

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-6xl',
};

// ============================================================
// MODAL COMPONENT
// ============================================================

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      open,
      onClose,
      title,
      description,
      children,
      size = 'md',
      showClose = true,
      closeOnBackdrop = true,
      closeOnEscape = true,
      footer,
      className,
    },
    ref
  ) => {
    // Handle escape key
    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === 'Escape' && closeOnEscape) {
          onClose();
        }
      },
      [closeOnEscape, onClose]
    );

    useEffect(() => {
      if (open) {
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
      }

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    }, [open, handleKeyDown]);

    return (
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'absolute inset-0 bg-black/70 backdrop-blur-sm',
                closeOnBackdrop && 'cursor-pointer'
              )}
              onClick={closeOnBackdrop ? onClose : undefined}
            />

            {/* Modal */}
            <motion.div
              ref={ref}
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={cn(
                'relative w-full mx-4',
                'bg-gradient-to-br from-slate-900 to-slate-800',
                'rounded-xl shadow-2xl',
                'border border-slate-700/50',
                'overflow-hidden',
                sizeClasses[size],
                className
              )}
            >
              {/* Header gradient accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500" />

              {/* Header */}
              {(title || showClose) && (
                <div className="flex items-start justify-between p-6 pb-0">
                  <div className="space-y-1">
                    {title && (
                      <h2 className="text-xl font-semibold text-white">
                        {title}
                      </h2>
                    )}
                    {description && (
                      <p className="text-sm text-gray-400">
                        {description}
                      </p>
                    )}
                  </div>
                  {showClose && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={onClose}
                      className="text-gray-400 hover:text-white -mt-1 -mr-1"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div className="flex items-center justify-end gap-3 p-6 pt-0 border-t border-slate-700/50 mt-4">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  }
);

Modal.displayName = 'Modal';

// ============================================================
// CONFIRM DIALOG VARIANT
// ============================================================

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

export const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}: ConfirmDialogProps) => {
  const buttonVariant = {
    danger: 'danger',
    warning: 'warning',
    info: 'primary',
  } as const;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={buttonVariant[variant]}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <p className="text-gray-300">{message}</p>
    </Modal>
  );
};
