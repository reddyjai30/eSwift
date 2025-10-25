# eSwift Animations & Design System

## 🎨 New Color Palette

### Modern Gradient-Based Colors

**Primary Colors:**
- Primary Purple: `#8B5CF6`
- Secondary Pink: `#EC4899`
- Accent Cyan: `#06B6D4`
- Success Green: `#10B981`

**Gradients:**
- `--gradient-primary`: Linear gradient from purple (#8B5CF6) to pink (#EC4899)
- `--gradient-accent`: Linear gradient from cyan (#06B6D4) to purple (#8B5CF6)
- `--gradient-success`: Linear gradient from green (#10B981) to cyan (#06B6D4)

### Usage

```tsx
// In CSS classes
className="bg-gradient-primary"

// In inline styles
style={{ background: 'var(--gradient-primary)' }}
```

## ✨ Animations

### Custom Keyframe Animations

All animations are defined in `globals.css`:

1. **float** - Gentle up and down movement
2. **blob** - Organic blob movement
3. **slideInUp** - Slide from bottom with fade
4. **slideInRight** - Slide from right with fade
5. **scaleIn** - Scale from 0 to 1 with fade
6. **confetti** - Falling confetti animation
7. **checkmark** - SVG stroke animation
8. **ripple** - Expanding ripple effect

### Utility Classes

```css
.animate-float
.animate-blob
.animate-slide-in-up
.animate-slide-in-right
.animate-scale-in
```

## 🎭 Enhanced Components

### 1. LoginScreen
**Features:**
- Animated background blobs (3 gradients)
- Smooth form element transitions
- Input focus animations with scale effect
- Gradient buttons with shimmer hover effect
- OTP slots with staggered entrance

**Animations:**
- Background blobs: Continuous floating motion
- Form elements: Slide-in with delays
- Inputs: Scale on focus with ring effect
- Buttons: Shimmer effect on hover

### 2. PaymentSuccessScreen
**Features:**
- 50 confetti pieces with random colors
- Animated success checkmark
- Pulsing rings effect
- Staggered content reveal
- Gradient backgrounds

**Animations:**
- Confetti: Fall from top with rotation
- Checkmark: Spring animation with scale
- Pulsing rings: Continuous scale and fade
- Content: Sequential slide-in animations

### 3. AnimatedToast
**Features:**
- Custom toast notifications
- Success, error, warning, info types
- Auto-dismiss with progress bar
- Smooth entrance/exit

**Animations:**
- Entrance: Slide from top with spring physics
- Exit: Fade out with scale
- Icon: Rotate on enter
- Progress bar: Linear countdown

### 4. AnimatedDialog
**Features:**
- Modal overlay with backdrop blur
- Spring animation entrance
- Rotating close button
- Smooth content reveal

**Animations:**
- Backdrop: Fade in
- Dialog: Scale and slide up with spring
- Close button: Rotate on hover
- Content: Staggered fade-in

### 5. RestaurantCard
**Features:**
- Image zoom on hover
- Card lift effect
- Badge animations
- Rating badge entrance

**Animations:**
- Card: Lift and scale on hover
- Image: Zoom effect
- Rating badge: Spin entrance
- Cuisine badges: Staggered scale-in

### 6. OrderCard
**Features:**
- Pulsing status indicator
- Image thumbnails with spin entrance
- Card hover effect

**Animations:**
- Status dot: Continuous pulse
- Thumbnails: Rotate entrance with delay
- Card: Slide and lift on hover

### 7. QRCard
**Features:**
- Animated progress ring
- Countdown animation
- Pulsing warning state
- QR code entrance

**Animations:**
- Progress ring: Linear countdown
- QR code: Rotate entrance with spring
- Warning ring: Pulse when expiring
- Countdown: Flip animation on change

### 8. WelcomeScreen
**Features:**
- Rotating background gradient
- Icon with pulsing rings
- Slide carousel with dots
- Gradient buttons

**Animations:**
- Background: Rotate and scale
- Icon: Pulsing rings continuous
- Icon entrance: Spring with rotation
- Slide transition: Slide left/right

## 🎯 Micro-Interactions

### Button Interactions
```tsx
<motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
  <Button>Click me</Button>
</motion.div>
```

### Shimmer Effect
```tsx
<motion.div
  className="absolute inset-0 bg-white/20"
  initial={{ x: '-100%' }}
  whileHover={{ x: '100%' }}
  transition={{ duration: 0.5 }}
/>
```

### Pulsing Element
```tsx
<motion.div
  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
  transition={{ duration: 2, repeat: Infinity }}
/>
```

## 🚀 Motion Presets

### Spring Animation
```tsx
transition={{ type: 'spring', stiffness: 200, damping: 15 }}
```

### Smooth Fade
```tsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5 }}
```

### Staggered Children
```tsx
{items.map((item, idx) => (
  <motion.div
    key={idx}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: idx * 0.1 }}
  >
    {item}
  </motion.div>
))}
```

## 🎨 Design Tokens

### Timing Functions
- `--motion-fast`: 150ms
- `--motion-medium`: 220ms
- `--motion-slow`: 300ms
- `--ease-standard`: cubic-bezier(0.4, 0, 0.2, 1)
- `--ease-decelerate`: cubic-bezier(0, 0, 0.2, 1)
- `--ease-accelerate`: cubic-bezier(0.4, 0, 1, 1)

### Shadows
- `--e-1`: Subtle shadow
- `--e-2`: Medium shadow
- `--e-3`: Strong shadow

### Border Radius
- `--r-8`: 8px
- `--r-12`: 12px (default)
- `--r-16`: 16px

## 📦 Animation Components

### AnimationShowcase
A demo component showcasing all animations and the new color palette. Located at `/components/AnimationShowcase.tsx`.

To view: Import and render the `AnimationShowcase` component.

## 🎓 Best Practices

1. **Use Motion for Complex Animations**: Use `motion/react` for complex animations with physics
2. **CSS for Simple Transitions**: Use CSS transitions for simple hover effects
3. **Stagger Delays**: Add small delays (0.05-0.1s) for sequential animations
4. **Spring Physics**: Use spring animations for natural feeling interactions
5. **Respect User Preferences**: Consider `prefers-reduced-motion` for accessibility
6. **Performance**: Animate transform and opacity properties for best performance

## 🔧 Dependencies

- `motion/react` (formerly Framer Motion): Main animation library
- Motion is already configured and ready to use

## 📱 Responsive Animations

Animations work seamlessly across mobile and tablet devices. The app is optimized for:
- Mobile (320px - 767px)
- Tablet (768px - 1023px)
- Desktop (1024px+)

## 🎉 What's New

1. ✨ Modern gradient-based color palette
2. 🎨 Animated login screen with floating blobs
3. 🎊 Payment success screen with confetti
4. 💬 Custom animated toast notifications
5. 🎭 Interactive animated dialogs
6. 🎪 Enhanced cards with hover effects
7. ⏱️ Animated QR countdown with progress ring
8. 🌊 Smooth page transitions
9. 🎯 Micro-interactions everywhere
10. 📚 Animation showcase component

---

Made with ❤️ for eSwift
