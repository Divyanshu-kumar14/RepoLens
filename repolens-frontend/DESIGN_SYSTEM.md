# RepoLens Material 3D Design System

## Overview

This document outlines the comprehensive Material Design 3 system implemented for RepoLens, featuring 3D depth, elevation, and modern UI/UX principles.

## Color Palette

### Light Mode

- **Primary**: `#1976d2` (Blue 700)
- **Primary Dark**: `#1565c0` (Blue 800)
- **Primary Light**: `#42a5f5` (Blue 400)
- **Secondary**: `#7c4dff` (Deep Purple A200)
- **Secondary Dark**: `#651fff` (Deep Purple A400)
- **Secondary Light**: `#b388ff` (Deep Purple A100)
- **Tertiary**: `#00bfa5` (Teal A700)
- **Tertiary Dark**: `#00897b` (Teal 600)
- **Tertiary Light**: `#64ffda` (Teal A200)

### Dark Mode

- **Primary**: `#90caf9` (Blue 200)
- **Secondary**: `#b388ff` (Deep Purple A100)
- **Tertiary**: `#64ffda` (Teal A200)

### Surface Colors

- **Light Surface**: `#ffffff`
- **Light Surface Variant**: `#f5f5f5`
- **Dark Surface**: `#121212`
- **Dark Surface Variant**: `#1e1e1e`

## Typography

### Font Families

- **Display/Headings**: Roboto (700, 900)
- **Body**: Roboto (300, 400, 500)
- **Monospace**: Roboto Mono (400, 500, 700)

### Type Scale

- **H1**: 3.5rem (56px) - Display Large
- **H2**: 2.5rem (40px) - Display Medium
- **H3**: 2rem (32px) - Display Small
- **H4**: 1.5rem (24px) - Headline Large
- **H5**: 1.25rem (20px) - Headline Medium
- **H6**: 1rem (16px) - Headline Small
- **Body**: 1rem (16px)
- **Caption**: 0.875rem (14px)
- **Small**: 0.75rem (12px)

## Elevation System

Material Design 3 elevation levels with realistic shadows:

- **Level 0**: No shadow (flat)
- **Level 1**: `0 1px 2px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1)`
- **Level 2**: `0 2px 4px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.12)`
- **Level 3**: `0 4px 8px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.14)`
- **Level 4**: `0 6px 12px rgba(0,0,0,0.1), 0 6px 16px rgba(0,0,0,0.16)`
- **Level 5**: `0 8px 16px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.18)`
- **Level 6**: `0 12px 24px rgba(0,0,0,0.14), 0 12px 28px rgba(0,0,0,0.2)`

## Spacing System

8px base unit system:

- **XS**: 4px (0.25rem)
- **SM**: 8px (0.5rem)
- **MD**: 16px (1rem)
- **LG**: 24px (1.5rem)
- **XL**: 32px (2rem)
- **2XL**: 48px (3rem)
- **3XL**: 64px (4rem)

## Border Radius

- **SM**: 4px
- **MD**: 8px
- **LG**: 12px
- **XL**: 16px
- **2XL**: 24px
- **Full**: 9999px (pill shape)

## Components

### Card3D

Material 3D card with elevation and hover effects.

**Props:**

- `elevation`: 1-6 (default: 2)
- `variant`: 'default' | 'glass' | 'neumorphic'
- `hoverable`: boolean (default: true)

**Usage:**

```tsx
<Card3D elevation={3} variant="glass">
  <h3>Card Title</h3>
  <p>Card content</p>
</Card3D>
```

### Button3D

Material button with ripple effects and 3D transforms.

**Props:**

- `variant`: 'primary' | 'secondary' | 'outlined' | 'text'
- `size`: 'sm' | 'md' | 'lg'
- `loading`: boolean
- `icon`: ReactNode
- `iconPosition`: 'left' | 'right'

**Usage:**

```tsx
<Button3D variant="primary" size="lg" icon={<SendIcon />}>
  Submit
</Button3D>
```

### Input3D

Material input with floating labels and 3D effects.

**Props:**

- `label`: string
- `error`: string
- `helperText`: string
- `icon`: ReactNode
- `fullWidth`: boolean

**Usage:**

```tsx
<Input3D label="Email" icon={<EmailIcon />} error={errors.email} fullWidth />
```

### Navigation3D

Floating navigation bar with glassmorphism and scroll effects.

**Props:**

- `onThemeToggle`: () => void
- `isDarkMode`: boolean

### LoadingSpinner

Animated loading states.

**Props:**

- `size`: 'sm' | 'md' | 'lg'
- `variant`: 'spinner' | 'dots' | 'pulse'
- `text`: string

### Toast

Material snackbar notifications.

**Props:**

- `message`: string
- `type`: 'success' | 'error' | 'info' | 'warning'
- `duration`: number (ms)

## Effects

### Glassmorphism

```css
background: rgba(255, 255, 255, 0.7);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.18);
```

### Neumorphism

```css
box-shadow:
  8px 8px 16px rgba(0, 0, 0, 0.1),
  -8px -8px 16px rgba(255, 255, 255, 0.7);
```

### 3D Transform

```css
transform-style: preserve-3d;
perspective: 1000px;
transform: translateY(-8px) rotateX(2deg);
```

## Animations

### Transitions

- **Fast**: 150ms cubic-bezier(0.4, 0, 0.2, 1)
- **Base**: 250ms cubic-bezier(0.4, 0, 0.2, 1)
- **Slow**: 350ms cubic-bezier(0.4, 0, 0.2, 1)

### Keyframe Animations

- `fadeIn`: Fade in with upward motion
- `slideInRight`: Slide from right
- `slideInLeft`: Slide from left
- `scaleIn`: Scale up with fade
- `float`: Continuous floating motion
- `pulse`: Opacity pulsing
- `shimmer`: Loading shimmer effect
- `spin`: Rotation for spinners

## Accessibility

### ARIA Labels

All interactive elements include proper ARIA labels:

```tsx
<button aria-label="Toggle theme">
  <DarkModeIcon />
</button>
```

### Keyboard Navigation

- Tab navigation supported
- Focus visible states
- Escape key closes modals

### Screen Reader Support

- Semantic HTML
- `sr-only` class for screen reader only content
- Proper heading hierarchy

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Responsive Breakpoints

- **Mobile**: < 480px
- **Tablet**: 480px - 768px
- **Desktop**: 768px - 1200px
- **Large Desktop**: > 1200px

### Mobile Adjustments

- Font size: 13-14px base
- Reduced elevation on hover
- Simplified animations
- Touch-optimized tap targets (min 44px)

## Dark Mode

Automatic theme detection with manual toggle:

- System preference detection
- localStorage persistence
- Smooth transitions between themes
- Optimized color contrast ratios

## Performance Optimizations

- Lazy loading for images
- Code splitting for routes
- CSS containment for animations
- GPU-accelerated transforms
- Debounced scroll handlers
- Intersection observers for scroll animations

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 14+, Chrome Android 90+

## Usage Examples

### Complete Page Layout

```tsx
import Navigation3D from "@/components/ui/Navigation3D";
import Hero3D from "@/components/Hero3D";
import Card3D from "@/components/ui/Card3D";
import { useTheme } from "@/hooks/useTheme";

export default function Page() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <main>
      <Navigation3D onThemeToggle={toggleTheme} isDarkMode={isDarkMode} />
      <Hero3D />
      <section className="container mx-auto px-4 py-16">
        <Card3D elevation={3}>
          <h2>Content</h2>
        </Card3D>
      </section>
    </main>
  );
}
```

### Toast Notifications

```tsx
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/ui/Toast";

function Component() {
  const toast = useToast();

  const handleAction = () => {
    toast.success("Action completed!");
  };

  return (
    <>
      <button onClick={handleAction}>Do Something</button>
      <ToastContainer toasts={toast.toasts} />
    </>
  );
}
```

## File Structure

```
repolens-frontend/
├── app/
│   ├── globals.css          # Design system CSS
│   ├── layout.tsx           # Root layout with fonts
│   └── page.tsx             # Main page
├── components/
│   ├── ui/                  # Reusable UI components
│   │   ├── Card3D.tsx
│   │   ├── Button3D.tsx
│   │   ├── Input3D.tsx
│   │   ├── Navigation3D.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── Toast.tsx
│   ├── Hero3D.tsx           # Hero section
│   └── ChatInterface3D.tsx  # Chat UI
└── hooks/
    ├── useTheme.ts          # Theme management
    └── useToast.ts          # Toast notifications
```

## Credits

Design system based on Material Design 3 (Material You) principles by Google, adapted for RepoLens with enhanced 3D effects and modern web technologies.
