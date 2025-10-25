import { motion } from 'motion/react';

interface AnimatedLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const sizeMap = {
  sm: 24,
  md: 48,
  lg: 72,
};

export function AnimatedLoader({ size = 'md', text }: AnimatedLoaderProps) {
  const loaderSize = sizeMap[size];

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Gradient Spinner */}
      <div className="relative" style={{ width: loaderSize, height: loaderSize }}>
        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'var(--gradient-primary)',
            opacity: 0.2,
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Middle ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-transparent"
          style={{
            borderTopColor: 'var(--primary)',
            borderRightColor: 'var(--secondary)',
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Inner ring */}
        <motion.div
          className="absolute inset-2 rounded-full border-4 border-transparent"
          style={{
            borderTopColor: 'var(--accent)',
            borderLeftColor: 'var(--secondary)',
          }}
          animate={{ rotate: -360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Center dot */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div
            className="rounded-full"
            style={{
              width: loaderSize / 4,
              height: loaderSize / 4,
              background: 'var(--gradient-accent)',
            }}
          />
        </motion.div>
      </div>

      {/* Loading Text */}
      {text && (
        <motion.p
          className="text-sm text-[var(--text-secondary)]"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

// Alternative: Dots Loader
export function DotsLoader() {
  return (
    <div className="flex gap-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-3 h-3 rounded-full"
          style={{ background: 'var(--gradient-primary)' }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// Alternative: Pulse Loader
export function PulseLoader() {
  return (
    <div className="relative w-16 h-16">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full"
          style={{ background: 'var(--gradient-accent)' }}
          animate={{
            scale: [0, 2],
            opacity: [0.8, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.6,
            ease: 'easeOut',
          }}
        />
      ))}
      <div
        className="absolute inset-4 rounded-full"
        style={{ background: 'var(--gradient-primary)' }}
      />
    </div>
  );
}

// Full Page Loader
export function FullPageLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[var(--bg-default)]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatedLoader size="lg" text={text} />
      </motion.div>
    </div>
  );
}
