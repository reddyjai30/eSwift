import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import QRCode from 'qrcode';

interface QRCardProps {
  orderId: string;
  expiresInSeconds: number;
  onExpire?: () => void;
}

export function QRCard({ orderId, expiresInSeconds, onExpire }: QRCardProps) {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [timeLeft, setTimeLeft] = useState(expiresInSeconds);

  useEffect(() => {
    QRCode.toDataURL(orderId, {
      width: 200,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    }).then(setQrDataUrl);
  }, [orderId]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onExpire]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = (timeLeft / expiresInSeconds) * 100;
  const isExpiring = timeLeft < 60;

  return (
    <motion.div
      className="bg-[var(--bg-paper)] rounded-[var(--r-16)] p-6 shadow-e-2"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <div className="text-center space-y-4">
        <motion.h3
          className="font-bold text-[var(--text-primary)]"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Show at Counter
        </motion.h3>
        
        {/* QR Code with circular progress ring */}
        <motion.div
          className="relative inline-block"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        >
          {/* Progress ring */}
          <svg className="w-56 h-56 -rotate-90" viewBox="0 0 224 224">
            {/* Background circle */}
            <circle
              cx="112"
              cy="112"
              r="108"
              fill="none"
              stroke="var(--divider)"
              strokeWidth="4"
            />
            {/* Progress circle */}
            <motion.circle
              cx="112"
              cy="112"
              r="108"
              fill="none"
              stroke={timeLeft === 0 ? 'var(--divider)' : isExpiring ? 'var(--error)' : 'var(--primary)'}
              strokeWidth="4"
              strokeDasharray={`${2 * Math.PI * 108}`}
              strokeDashoffset={`${2 * Math.PI * 108 * (1 - progress / 100)}`}
              strokeLinecap="round"
              animate={{
                strokeDashoffset: `${2 * Math.PI * 108 * (1 - progress / 100)}`,
              }}
              transition={{ duration: 1, ease: 'linear' }}
            />
          </svg>

          {/* QR Code */}
          <div className="absolute inset-0 flex items-center justify-center p-7">
            <motion.div
              className="bg-white rounded-[var(--r-12)] p-3 shadow-lg"
              initial={{ opacity: 0, rotate: -180 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
              whileHover={{ scale: 1.05 }}
            >
              {qrDataUrl && (
                <img src={qrDataUrl} alt="Order QR Code" className="w-full h-full" />
              )}
            </motion.div>
          </div>

          {/* Pulsing ring for expiring state */}
          {isExpiring && timeLeft > 0 && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                border: '4px solid var(--error)',
                opacity: 0.3,
              }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0, 0.3],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
          )}
        </motion.div>

        {/* Countdown */}
        <motion.div
          className="space-y-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={`${minutes}:${seconds}`}
              className={`text-2xl font-bold tabular-nums ${
                timeLeft === 0 ? 'text-[var(--text-secondary)]' : isExpiring ? 'text-[var(--error)]' : 'text-[var(--text-primary)]'
              }`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </motion.p>
          </AnimatePresence>
          <p className="text-sm text-[var(--text-secondary)]">
            {timeLeft === 0 ? 'QR Code Expired' : 'Time Remaining'}
          </p>
        </motion.div>

        <AnimatePresence>
          {timeLeft === 0 && (
            <motion.div
              className="bg-[var(--error)]/10 border border-[var(--error)]/20 rounded-lg p-3"
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <p className="text-sm text-[var(--error)]">
                This QR code has expired. You can request a refund below.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
