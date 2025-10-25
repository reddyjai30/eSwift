import { motion } from 'motion/react';
import { Badge } from './ui/badge';
import { Clock } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface OrderCardProps {
  id: string;
  status: 'paid' | 'delivered' | 'refunded' | 'expired';
  total: number;
  timestamp: string;
  items: { name: string; image?: string }[];
  onClick?: () => void;
}

const statusConfig = {
  paid: { label: 'Paid', color: 'bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/20' },
  delivered: { label: 'Delivered', color: 'bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20' },
  refunded: { label: 'Refunded', color: 'bg-[var(--error)]/10 text-[var(--error)] border-[var(--error)]/20' },
  expired: { label: 'Expired', color: 'bg-[var(--text-secondary)]/10 text-[var(--text-secondary)] border-[var(--text-secondary)]/20' },
};

export function OrderCard({ status, total, timestamp, items, onClick }: OrderCardProps) {
  const config = statusConfig[status];
  const displayItems = items.slice(0, 3);
  const remainingCount = items.length - displayItems.length;

  return (
    <motion.button
      onClick={onClick}
      className="w-full text-left bg-[var(--bg-paper)] rounded-[var(--r-12)] p-4 shadow-e-1 hover:shadow-e-3 transition-all duration-[var(--motion-fast)]"
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left: Status & Info */}
        <div className="flex-1 space-y-2">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <motion.div
              className={`w-2 h-2 rounded-full`}
              style={{
                backgroundColor:
                  status === 'paid'
                    ? 'var(--warning)'
                    : status === 'delivered'
                    ? 'var(--success)'
                    : status === 'refunded'
                    ? 'var(--error)'
                    : 'var(--text-secondary)',
              }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <Badge variant="outline" className={`${config.color} text-xs`}>
              {config.label}
            </Badge>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="font-bold text-[var(--text-primary)] tabular-nums">₹{total.toFixed(2)}</p>
            <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)] mt-1">
              <Clock className="w-3 h-3" />
              <span>{timestamp}</span>
            </div>
          </motion.div>
        </div>

        {/* Right: Item Thumbnails */}
        <div className="flex items-center gap-1">
          {displayItems.map((item, idx) => (
            <motion.div
              key={idx}
              className="w-10 h-10 rounded-lg overflow-hidden bg-[var(--surface)] flex-shrink-0"
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.1 + idx * 0.05, type: 'spring', stiffness: 200 }}
              whileHover={{ scale: 1.1, zIndex: 10 }}
            >
              {item.image ? (
                <ImageWithFallback
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-[var(--text-secondary)]">
                  {item.name.charAt(0)}
                </div>
              )}
            </motion.div>
          ))}
          {remainingCount > 0 && (
            <motion.div
              className="w-10 h-10 rounded-lg bg-[var(--surface)] flex items-center justify-center text-xs font-medium text-[var(--text-secondary)]"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              whileHover={{ scale: 1.1 }}
            >
              +{remainingCount}
            </motion.div>
          )}
        </div>
      </div>
    </motion.button>
  );
}
