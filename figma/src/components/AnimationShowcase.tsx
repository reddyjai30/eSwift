import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Zap, Heart, Star, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { AnimatedDialog } from './AnimatedDialog';
import { AnimatedToast, useToast } from './AnimatedToast';

export function AnimationShowcase() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  return (
    <div className="min-h-screen bg-[var(--bg-default)] p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          className="text-center space-y-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-bold text-4xl bg-gradient-primary bg-clip-text text-transparent">
            eSwift Animations
          </h1>
          <p className="text-[var(--text-secondary)]">
            Modern, trendy animations and color palette showcase
          </p>
        </motion.div>

        {/* Color Palette */}
        <motion.div
          className="bg-[var(--bg-paper)] rounded-2xl p-6 shadow-e-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="font-bold text-xl text-[var(--text-primary)] mb-4">Color Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <motion.div
              className="space-y-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="h-24 rounded-xl bg-gradient-primary shadow-lg" />
              <p className="text-sm font-medium text-[var(--text-primary)]">Primary Gradient</p>
              <p className="text-xs text-[var(--text-secondary)]">#8B5CF6 → #EC4899</p>
            </motion.div>
            <motion.div
              className="space-y-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="h-24 rounded-xl bg-gradient-accent shadow-lg" />
              <p className="text-sm font-medium text-[var(--text-primary)]">Accent Gradient</p>
              <p className="text-xs text-[var(--text-secondary)]">#06B6D4 → #8B5CF6</p>
            </motion.div>
            <motion.div
              className="space-y-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="h-24 rounded-xl bg-gradient-success shadow-lg" />
              <p className="text-sm font-medium text-[var(--text-primary)]">Success Gradient</p>
              <p className="text-xs text-[var(--text-secondary)]">#10B981 → #06B6D4</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Interactive Elements */}
        <motion.div
          className="bg-[var(--bg-paper)] rounded-2xl p-6 shadow-e-2 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-bold text-xl text-[var(--text-primary)] mb-4">Interactive Components</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Gradient Buttons */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                className="w-full h-12 bg-gradient-primary text-white border-0"
                onClick={() => showToast('success', 'Success!', 'Action completed successfully')}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Show Success Toast
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                className="w-full h-12 bg-gradient-accent text-white border-0"
                onClick={() => showToast('info', 'Information', 'Here is some useful information')}
              >
                <Zap className="w-5 h-5 mr-2" />
                Show Info Toast
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                className="w-full h-12 bg-gradient-success text-white border-0"
                onClick={() => setDialogOpen(true)}
              >
                <Star className="w-5 h-5 mr-2" />
                Open Dialog
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                className="w-full h-12"
                onClick={() => showToast('warning', 'Warning', 'Please be careful with this action')}
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                Show Warning
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Floating Icons */}
        <motion.div
          className="bg-[var(--bg-paper)] rounded-2xl p-6 shadow-e-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-bold text-xl text-[var(--text-primary)] mb-4">Floating Animations</h2>
          <div className="flex justify-around items-center h-32">
            {[Sparkles, Zap, Heart, Star, TrendingUp].map((Icon, idx) => (
              <motion.div
                key={idx}
                className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center"
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: idx * 0.2,
                  ease: 'easeInOut',
                }}
              >
                <Icon className="w-6 h-6 text-white" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Micro-interactions */}
        <motion.div
          className="bg-[var(--bg-paper)] rounded-2xl p-6 shadow-e-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="font-bold text-xl text-[var(--text-primary)] mb-4">Hover Effects</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <motion.div
                key={item}
                className="h-24 rounded-xl bg-gradient-accent flex items-center justify-center cursor-pointer"
                whileHover={{
                  scale: 1.1,
                  rotate: 5,
                  boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3)',
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-2xl font-bold text-white">#{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Animated Dialog */}
      <AnimatedDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Beautiful Dialog"
        description="This is an animated dialog with smooth transitions"
      >
        <div className="space-y-4">
          <p className="text-[var(--text-secondary)]">
            This dialog features smooth entrance and exit animations, with spring physics for a natural feel.
          </p>
          <div className="flex gap-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
              <Button
                className="w-full bg-gradient-primary text-white border-0"
                onClick={() => {
                  setDialogOpen(false);
                  showToast('success', 'Confirmed!', 'Your action was successful');
                }}
              >
                Confirm
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
              <Button variant="outline" className="w-full" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
            </motion.div>
          </div>
        </div>
      </AnimatedDialog>

      {/* Animated Toast */}
      <AnimatedToast toast={toast} onClose={hideToast} />
    </div>
  );
}
