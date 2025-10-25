import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { ReactNode } from 'react';

interface AnimatedDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  showCloseButton?: boolean;
}

export function AnimatedDialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  showCloseButton = true,
}: AnimatedDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              className="bg-[var(--bg-paper)] rounded-2xl shadow-e-3 max-w-md w-full max-h-[90vh] overflow-hidden pointer-events-auto"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="relative px-6 pt-6 pb-4 border-b border-[var(--divider)]">
                  {title && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <h3 className="font-bold text-xl text-[var(--text-primary)]">{title}</h3>
                      {description && (
                        <p className="text-sm text-[var(--text-secondary)] mt-1">{description}</p>
                      )}
                    </motion.div>
                  )}

                  {showCloseButton && (
                    <motion.button
                      onClick={onClose}
                      className="absolute top-6 right-6 w-8 h-8 rounded-lg bg-[var(--surface)] hover:bg-[var(--divider)] transition-colors flex items-center justify-center"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <X className="w-4 h-4 text-[var(--text-secondary)]" />
                    </motion.button>
                  )}
                </div>
              )}

              {/* Content */}
              <motion.div
                className="p-6 overflow-y-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                {children}
              </motion.div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// Hook for using dialog
export function useDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);
  const toggleDialog = () => setIsOpen((prev) => !prev);

  return {
    isOpen,
    openDialog,
    closeDialog,
    toggleDialog,
  };
}

// Required import
import { useState } from 'react';
