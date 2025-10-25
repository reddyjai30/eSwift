import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface AnimatedToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

const TOAST_ICONS = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const TOAST_COLORS = {
  success: {
    bg: 'bg-[var(--success)]/10',
    border: 'border-[var(--success)]/30',
    text: 'text-[var(--success)]',
    icon: 'text-[var(--success)]',
  },
  error: {
    bg: 'bg-[var(--error)]/10',
    border: 'border-[var(--error)]/30',
    text: 'text-[var(--error)]',
    icon: 'text-[var(--error)]',
  },
  warning: {
    bg: 'bg-[var(--warning)]/10',
    border: 'border-[var(--warning)]/30',
    text: 'text-[var(--warning)]',
    icon: 'text-[var(--warning)]',
  },
  info: {
    bg: 'bg-[var(--info)]/10',
    border: 'border-[var(--info)]/30',
    text: 'text-[var(--info)]',
    icon: 'text-[var(--info)]',
  },
};

export function AnimatedToast({ toast, onClose }: AnimatedToastProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!toast) return;

    const duration = toast.duration || 3000;
    const interval = 50;
    const decrement = (interval / duration) * 100;

    setProgress(100);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev - decrement;
        if (next <= 0) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const Icon = TOAST_ICONS[toast.type];
  const colors = TOAST_COLORS[toast.type];

  return (
    <div className="fixed top-4 left-4 right-4 z-[100] flex justify-center pointer-events-none">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="pointer-events-auto max-w-md w-full"
          >
            <div
              className={`relative bg-[var(--bg-paper)] border ${colors.border} rounded-xl shadow-e-3 overflow-hidden`}
            >
              {/* Progress bar */}
              <motion.div
                className={`absolute bottom-0 left-0 h-1 ${colors.bg}`}
                initial={{ width: '100%' }}
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.05, ease: 'linear' }}
              />

              <div className="p-4 flex items-start gap-3">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                >
                  <div className={`${colors.bg} rounded-lg p-2`}>
                    <Icon className={`w-5 h-5 ${colors.icon}`} />
                  </div>
                </motion.div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <motion.h4
                    className="font-medium text-[var(--text-primary)] mb-1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {toast.title}
                  </motion.h4>
                  {toast.description && (
                    <motion.p
                      className="text-sm text-[var(--text-secondary)]"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {toast.description}
                    </motion.p>
                  )}
                </div>

                {/* Close button */}
                <motion.button
                  onClick={onClose}
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Hook for using toast
export function useToast() {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (
    type: ToastType,
    title: string,
    description?: string,
    duration?: number
  ) => {
    setToast({
      id: Date.now().toString(),
      type,
      title,
      description,
      duration,
    });
  };

  const hideToast = () => {
    setToast(null);
  };

  return {
    toast,
    showToast,
    hideToast,
  };
}
