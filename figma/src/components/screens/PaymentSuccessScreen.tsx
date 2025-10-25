import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Check, Home, Receipt, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';

interface PaymentSuccessScreenProps {
  orderId: string;
  amount: number;
  paymentMethod: string;
  onViewOrder: () => void;
  onGoHome: () => void;
}

interface ConfettiPiece {
  id: number;
  left: string;
  delay: number;
  duration: number;
  color: string;
}

const CONFETTI_COLORS = [
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#10B981', // green
  '#F59E0B', // yellow
];

export function PaymentSuccessScreen({
  orderId,
  amount,
  paymentMethod,
  onViewOrder,
  onGoHome,
}: PaymentSuccessScreenProps) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Generate confetti
    const pieces: ConfettiPiece[] = [];
    for (let i = 0; i < 50; i++) {
      pieces.push({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      });
    }
    setConfetti(pieces);

    // Show content after animation starts
    setTimeout(() => setShowContent(true), 300);

    // Auto-hide confetti after animation
    setTimeout(() => setConfetti([]), 4000);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-default)] flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'var(--gradient-success)' }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          initial={{ top: '20%', left: '50%', transform: 'translateX(-50%)' }}
        />
      </div>

      {/* Confetti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-50">
        {confetti.map((piece) => (
          <motion.div
            key={piece.id}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: piece.left,
              backgroundColor: piece.color,
              top: '-10px',
            }}
            initial={{ y: 0, opacity: 1, rotate: 0 }}
            animate={{
              y: '110vh',
              opacity: 0,
              rotate: 720,
            }}
            transition={{
              duration: piece.duration,
              delay: piece.delay,
              ease: 'easeIn',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        {showContent && (
          <motion.div
            className="max-w-md w-full space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Success Icon */}
            <motion.div
              className="flex justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            >
              <div className="relative">
                {/* Pulsing rings */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ background: 'var(--gradient-success)' }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ background: 'var(--gradient-success)' }}
                  animate={{
                    scale: [1, 1.8, 1],
                    opacity: [0.3, 0, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeOut',
                    delay: 0.5,
                  }}
                />
                
                {/* Main circle */}
                <div className="relative w-32 h-32 rounded-full bg-gradient-success flex items-center justify-center shadow-2xl">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                  >
                    <Check className="w-16 h-16 text-white" strokeWidth={3} />
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Success Message */}
            <motion.div
              className="text-center space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="flex items-center justify-center gap-2">
                <h2 className="font-bold text-3xl bg-gradient-success bg-clip-text text-transparent">
                  Payment Successful!
                </h2>
                <motion.div
                  animate={{
                    rotate: [0, 15, -15, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Sparkles className="w-7 h-7 text-[var(--success)]" />
                </motion.div>
              </div>
              <p className="text-[var(--text-secondary)]">
                Your order has been confirmed
              </p>
            </motion.div>

            {/* Order Details Card */}
            <motion.div
              className="bg-[var(--bg-paper)] rounded-2xl p-6 shadow-e-2 space-y-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <div className="flex items-center justify-between pb-4 border-b border-[var(--divider)]">
                <span className="text-[var(--text-secondary)]">Order ID</span>
                <span className="font-bold text-[var(--text-primary)] tabular-nums">
                  #{orderId}
                </span>
              </div>
              
              <motion.div
                className="flex items-center justify-between"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.4 }}
              >
                <span className="text-[var(--text-secondary)]">Amount Paid</span>
                <span className="font-bold text-2xl text-[var(--text-primary)] tabular-nums">
                  ₹{amount.toFixed(2)}
                </span>
              </motion.div>
              
              <motion.div
                className="flex items-center justify-between"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1, duration: 0.4 }}
              >
                <span className="text-[var(--text-secondary)]">Payment Method</span>
                <span className="font-medium text-[var(--text-primary)]">
                  {paymentMethod}
                </span>
              </motion.div>

              <motion.div
                className="pt-4 border-t border-[var(--divider)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.4 }}
              >
                <div className="flex items-center gap-2 text-[var(--success)]">
                  <div className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
                  <span className="text-sm">Your order is being prepared</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.5 }}
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={onViewOrder}
                  className="w-full h-12 bg-gradient-primary text-white border-0"
                >
                  <Receipt className="w-5 h-5 mr-2" />
                  View Order Details
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={onGoHome}
                  variant="outline"
                  className="w-full h-12"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Back to Home
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
