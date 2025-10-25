import { motion } from 'motion/react';
import { Home, ShoppingBag, Wallet, User } from 'lucide-react';
import { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
  title?: string;
  actions?: ReactNode;
  activeTab?: 'restaurants' | 'orders' | 'wallet' | 'profile';
  onTabChange?: (tab: 'restaurants' | 'orders' | 'wallet' | 'profile') => void;
  hideBottomNav?: boolean;
}

export function AppShell({ 
  children, 
  title, 
  actions, 
  activeTab = 'restaurants',
  onTabChange,
  hideBottomNav = false
}: AppShellProps) {
  const tabs = [
    { id: 'restaurants' as const, label: 'Restaurants', icon: Home },
    { id: 'orders' as const, label: 'Orders', icon: ShoppingBag },
    { id: 'wallet' as const, label: 'Wallet', icon: Wallet },
    { id: 'profile' as const, label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-default)] flex flex-col">
      {/* Top App Bar */}
      {title && (
        <motion.header
          className="sticky top-0 z-40 bg-[var(--bg-paper)] border-b border-[var(--divider)] shadow-e-1"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="flex items-center justify-between h-14 px-4 max-w-screen-lg mx-auto">
            <h1 className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">{title}</h1>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        </motion.header>
      )}

      {/* Main Content */}
      <main className="flex-1 pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      {!hideBottomNav && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-paper)] border-t border-[var(--divider)] shadow-e-2">
          <div className="flex items-center justify-around h-16 max-w-screen-lg mx-auto px-2">
            {tabs.map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id;
              return (
                <motion.button
                  key={id}
                  onClick={() => onTabChange?.(id)}
                  className={`flex flex-col items-center justify-center gap-1 px-4 py-2 min-w-[60px] rounded-lg transition-colors ${
                    isActive 
                      ? 'text-[var(--primary)]' 
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                  whileTap={{ scale: 0.9 }}
                  animate={{
                    scale: isActive ? 1.05 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <motion.div
                    animate={{
                      y: isActive ? -2 : 0,
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                  </motion.div>
                  <span className="text-xs font-medium">{label}</span>
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-1/2 w-1 h-1 rounded-full"
                      style={{ background: 'var(--gradient-primary)' }}
                      layoutId="activeTab"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
