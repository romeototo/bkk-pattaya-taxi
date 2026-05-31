# Design System — BKK Pattaya Private Taxi

## Color System
- **Space**: OKLCH throughout. No hex except for third-party brand colors (#25D366 WhatsApp)
- **Strategy**: Committed (Midnight Blue + Champagne Gold carry 40%+ of the surface)
- **Primary (Sky Blue)**: oklch(0.685 0.169 237.323)
- **Gold Accent**: oklch(0.795 0.135 85)
- **Background (Midnight Blue-Black)**: oklch(0.11 0.01 260)
- **Neutrals**: All tinted toward hue 260° (blue), chroma 0.005–0.015
- **No pure black/white**: Darkest is oklch(0.11 0.01 260), lightest is oklch(0.95 0.005 260)

## Typography
- **Display/Headings**: Playfair Display (serif) — 400/500/600/700
- **Body/UI**: Inter (sans) — 300/400/500/600/700
- **Scale**: Major Third (1.25 ratio)
- **Heading line-height**: ~1.1–1.2
- **Body line-height**: ~1.5–1.6
- **OpenType features**: Enable cv01, cv02 on Inter for improved readability

## Elevation & Surfaces
- **Glass Cards**: `backdrop-filter: blur(20px)`, 65% opacity background, subtle inset shadows
- **Gold Buttons**: Animated gradient (270deg, 3 gold stops, 200% background-size, 4s ease infinite)
- **Decorative Orbs**: Primary/gold colored, blur(100px+), pointer-events-none
- **Shadows**: Use oklch-based shadows tinted to brand colors, not pure black

## Motion System
- **Framework**: Framer Motion
- **Standard entrance**: fadeInUp (y: 30→0, opacity: 0→1)
- **Stagger**: 0.1s between siblings via variants
- **Easing**: Custom cubic-bezier [0.25, 0.1, 0.25, 1] (smooth decelerate)
- **Duration**: 0.5s for entrances, 0.3s for interactions, 4s for background loops
- **Reduced motion**: Respect `prefers-reduced-motion` — disable all animation

## Spacing
- **Base unit**: 4px (0.25rem)
- **Section padding**: py-20 (5rem) desktop, py-28 (7rem) on lg+
- **Container**: max-width 1280px, responsive padding (1rem → 1.5rem → 2rem)
- **Card padding**: p-6 (1.5rem) mobile, p-8 (2rem) desktop

## Component Patterns
- **Buttons**: Primary (solid sky-blue), Gold (animated gradient), Outline (border-primary/30), WhatsApp (green gradient)
- **Cards**: Glass morphism cards with border-primary/20, hover:border transitions
- **Sections**: Each has decorative background gradient + optional orbs
- **Forms**: Glass card container, grouped fields with section headers + icons
- **Trust signals**: Floating badge (Hero), star ratings (Reviews), checkmark lists (WhyUs)

## Responsive Breakpoints
- **sm**: 640px — 2-column grids, increased padding
- **md**: 768px — bento grid layouts
- **lg**: 1024px — full desktop layout, max-width container
- **Mobile-first**: All layouts start single-column
