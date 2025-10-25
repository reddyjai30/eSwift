# 🚀 eSwift Quick Start Guide

## 🎨 Using the New Color Palette

### Gradient Backgrounds

```tsx
// Primary gradient (Purple to Pink)
<div className="bg-gradient-primary">Content</div>

// Accent gradient (Cyan to Purple)
<div className="bg-gradient-accent">Content</div>

// Success gradient (Green to Cyan)
<div className="bg-gradient-success">Content</div>
```

### Gradient Text

```tsx
<h1 className="bg-gradient-primary bg-clip-text text-transparent">
  Gradient Text
</h1>
```

### Gradient Buttons

```tsx
import { motion } from 'motion/react';
import { Button } from './components/ui/button';

<motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
  <Button className="bg-gradient-primary text-white border-0">
    Click Me
  </Button>
</motion.div>
```

## ✨ Using Animations

### Basic Motion Component

```tsx
import { motion } from 'motion/react';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

### Hover Effects

```tsx
<motion.div
  whileHover={{ scale: 1.05, y: -4 }}
  whileTap={{ scale: 0.95 }}
>
  Hover me!
</motion.div>
```

### Staggered Animations

```tsx
{items.map((item, idx) => (
  <motion.div
    key={idx}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: idx * 0.1, duration: 0.3 }}
  >
    {item}
  </motion.div>
))}
```

## 🍞 Toast Notifications

```tsx
import { useToast } from './components/AnimatedToast';

function MyComponent() {
  const { toast, showToast, hideToast } = useToast();
  
  const handleClick = () => {
    showToast('success', 'Success!', 'Your action was completed');
  };
  
  return (
    <>
      <button onClick={handleClick}>Show Toast</button>
      <AnimatedToast toast={toast} onClose={hideToast} />
    </>
  );
}
```

### Toast Types

- `success` - Green checkmark
- `error` - Red X
- `warning` - Yellow alert
- `info` - Blue info icon

## 🎭 Dialogs

```tsx
import { AnimatedDialog, useDialog } from './components/AnimatedDialog';

function MyComponent() {
  const { isOpen, openDialog, closeDialog } = useDialog();
  
  return (
    <>
      <button onClick={openDialog}>Open Dialog</button>
      
      <AnimatedDialog
        isOpen={isOpen}
        onClose={closeDialog}
        title="Dialog Title"
        description="Dialog description"
      >
        <p>Dialog content here</p>
      </AnimatedDialog>
    </>
  );
}
```

## ⏳ Loading Indicators

```tsx
import { AnimatedLoader, DotsLoader, PulseLoader, FullPageLoader } from './components/AnimatedLoader';

// Spinner with text
<AnimatedLoader size="md" text="Loading..." />

// Dots animation
<DotsLoader />

// Pulse animation
<PulseLoader />

// Full page overlay
<FullPageLoader text="Please wait..." />
```

## 🎯 Common Patterns

### Card Hover Effect

```tsx
<motion.div
  className="bg-[var(--bg-paper)] rounded-xl p-4 shadow-e-1"
  whileHover={{ scale: 1.02, y: -4, boxShadow: 'var(--e-3)' }}
  whileTap={{ scale: 0.98 }}
>
  Card content
</motion.div>
```

### Button with Shimmer

```tsx
<motion.button className="relative overflow-hidden bg-gradient-primary">
  <span className="relative z-10">Button Text</span>
  <motion.div
    className="absolute inset-0 bg-white/20"
    initial={{ x: '-100%' }}
    whileHover={{ x: '100%' }}
    transition={{ duration: 0.5 }}
  />
</motion.button>
```

### Pulsing Element

```tsx
<motion.div
  animate={{
    scale: [1, 1.2, 1],
    opacity: [1, 0.5, 1],
  }}
  transition={{
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut',
  }}
>
  Pulsing content
</motion.div>
```

### Floating Animation

```tsx
<motion.div
  animate={{
    y: [0, -20, 0],
  }}
  transition={{
    duration: 3,
    repeat: Infinity,
    ease: 'easeInOut',
  }}
>
  Floating content
</motion.div>
```

## 🎨 Design System Quick Reference

### Colors
- Primary: `#8B5CF6` (Purple)
- Secondary: `#EC4899` (Pink)
- Accent: `#06B6D4` (Cyan)
- Success: `#10B981` (Green)

### Spacing (8pt grid)
- `--s-8`: 8px
- `--s-16`: 16px
- `--s-24`: 24px
- `--s-32`: 32px

### Border Radius
- `--r-8`: 8px
- `--r-12`: 12px (default)
- `--r-16`: 16px

### Shadows
- `shadow-e-1`: Subtle
- `shadow-e-2`: Medium
- `shadow-e-3`: Strong

## 📱 Responsive Considerations

All animations work across:
- Mobile (320px+)
- Tablet (768px+)
- Desktop (1024px+)

## ⚡ Performance Tips

1. Animate `transform` and `opacity` for best performance
2. Use `will-change` sparingly
3. Avoid animating `width`, `height`, or `left/right/top/bottom`
4. Use `layoutId` for shared element transitions
5. Consider `prefers-reduced-motion` for accessibility

## 🎓 Advanced Patterns

### Exit Animations with AnimatePresence

```tsx
import { AnimatePresence } from 'motion/react';

<AnimatePresence>
  {show && (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      Content
    </motion.div>
  )}
</AnimatePresence>
```

### Layout Animations

```tsx
<motion.div layout>
  Content that animates when layout changes
</motion.div>
```

### Gesture Animations

```tsx
<motion.div
  drag
  dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
  whileDrag={{ scale: 1.1 }}
>
  Draggable content
</motion.div>
```

## 🔗 Resources

- [Motion Documentation](https://motion.dev/)
- [eSwift Animations Guide](/ANIMATIONS.md)
- [Component Showcase](/components/AnimationShowcase.tsx)

---

Happy coding! 🎉
