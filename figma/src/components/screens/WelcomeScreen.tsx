import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Scan, Zap, Shield } from 'lucide-react';
import { Button } from '../ui/button';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

const slides = [
  {
    icon: Scan,
    title: 'Scan QR at Counter',
    description: 'Simply scan the QR code displayed at your table or counter to start ordering',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
    color: '#8B5CF6',
  },
  {
    icon: Zap,
    title: 'Fast Pickup',
    description: 'Order ahead and skip the queue. Your food will be ready when you arrive',
    gradient: 'linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)',
    color: '#06B6D4',
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    description: 'Pay safely with wallet or card. All transactions are encrypted and protected',
    gradient: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
    color: '#10B981',
  },
];

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onGetStarted();
    }
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="min-h-screen bg-[var(--bg-default)] flex flex-col relative overflow-hidden">
      {/* Animated Background Gradient */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{ background: slide.gradient }}
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Logo/Brand */}
      <motion.div
        className="p-6 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-bold text-2xl bg-gradient-primary bg-clip-text text-transparent">
          eSwift
        </h1>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            {/* Icon with animated gradient background */}
            <motion.div
              className="w-32 h-32 rounded-full flex items-center justify-center mb-8 relative"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            >
              {/* Animated rings */}
              <motion.div
                className="absolute inset-0 rounded-full opacity-30"
                style={{ background: slide.gradient }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              />
              <motion.div
                className="absolute inset-0 rounded-full opacity-20"
                style={{ background: slide.gradient }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.2, 0, 0.2],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeOut',
                  delay: 0.5,
                }}
              />
              
              {/* Main circle */}
              <div
                className="relative w-full h-full rounded-full flex items-center justify-center"
                style={{ background: slide.gradient }}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.4 }}
                >
                  <Icon className="w-16 h-16 text-white" />
                </motion.div>
              </div>
            </motion.div>

            {/* Title & Description */}
            <motion.div
              className="text-center max-w-md mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <h2
                className="font-bold text-2xl mb-3 bg-clip-text text-transparent"
                style={{ background: slide.gradient, WebkitBackgroundClip: 'text' }}
              >
                {slide.title}
              </h2>
              <p className="text-[var(--text-secondary)]">
                {slide.description}
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Dots Indicator */}
        <motion.div
          className="flex gap-2 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {slides.map((s, idx) => (
            <motion.button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-[var(--motion-fast)]`}
              style={{
                width: idx === currentSlide ? '32px' : '8px',
                background: idx === currentSlide ? s.gradient : 'var(--divider)',
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={nextSlide}
              className="w-full h-12 text-white border-0 relative overflow-hidden"
              style={{ background: slide.gradient }}
            >
              <span className="relative z-10">
                {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
              </span>
              <ChevronRight className="w-5 h-5 ml-2 relative z-10" />
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.5 }}
              />
            </Button>
          </motion.div>
        </motion.div>

        {/* Login Link */}
        <motion.button
          onClick={onGetStarted}
          className="mt-4 text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.05 }}
        >
          Already have an account? <span className="font-medium">Log in</span>
        </motion.button>
      </div>
    </div>
  );
}
