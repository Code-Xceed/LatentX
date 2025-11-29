# LatentX Design System (Lumina Aesthetic)

Based on the provided "Lumina Botanicals" reference, we will adopt a **Premium, Organic, and Trustworthy** design language. This departs from the typical "Tech/SaaS" dark mode look and embraces a cleaner, lighter, and more sophisticated aesthetic.

## 1. Visual Identity

### Core Philosophy
- **Natural & Premium**: Use of organic colors (Emerald, Stone) mixed with clean white space.
- **Sophisticated Typography**: Serif headings for elegance, Sans-serif body for readability.
- **Glassmorphism & Depth**: Soft shadows, frosted glass effects, and layered elements.
- **Soft Geometry**: Heavy use of rounded corners (`rounded-3xl`, `rounded-full`).

### Color Palette

#### Primary (Emerald)
- **Primary**: `#059669` (Emerald 600) - Main actions, buttons, highlights.
- **Primary Dark**: `#047857` (Emerald 700) - Hover states.
- **Primary Light**: `#d1fae5` (Emerald 100) - Backgrounds, accents.
- **Primary Soft**: `rgba(16, 185, 129, 0.1)` - Subtle tints.

#### Secondary (Stone/Earth)
- **Background**: `#fafaf9` (Stone 50) to `#ffffff` (White) gradients.
- **Surface**: `#ffffff` (White) - Cards, panels.
- **Text Main**: `#111827` (Gray 900) - Headings.
- **Text Muted**: `#4b5563` (Gray 600) - Body text.
- **Border**: `#f3f4f6` (Gray 100) - Subtle dividers.

#### Accents
- **Gold/Amber**: `#d97706` (Amber 600) - Ratings, stars, premium badges.
- **Blue/Indigo**: `#2563eb` (Blue 600) - "Science/Tech" accents (optional, for trust).

### Typography

#### Headings: **Playfair Display**
- Elegant, editorial, trustworthy.
- Use for Page Titles, Section Headers, and Feature Highlights.
- *Example*: `font-serif text-4xl font-medium tracking-tight`

#### Body: **Inter**
- Clean, modern, highly readable.
- Use for UI elements, navigation, paragraphs, and data.
- *Example*: `font-sans text-gray-600 leading-relaxed`

## 2. UI Components

### Buttons
- **Primary**: Emerald gradient or solid Emerald 600. Rounded full (`rounded-full`).
  - *Style*: `bg-emerald-600 text-white px-6 py-3 rounded-full hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-500/30`
- **Secondary**: White/Glass with border.
  - *Style*: `bg-white/50 backdrop-blur border border-emerald-100 text-emerald-700 px-6 py-3 rounded-full hover:bg-white`
- **Ghost**: Text only with hover effect.

### Cards & Surfaces
- **Glass Card**: White with high transparency and blur.
  - *Style*: `bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl rounded-3xl`
- **Content Card**: Solid white with soft shadow.
  - *Style*: `bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow`
- **Gradient Card**: For feature highlights.
  - *Style*: `bg-gradient-to-br from-emerald-800 to-emerald-900 text-white rounded-3xl`

### Navigation
- **Navbar**: Floating glass bar.
  - *Style*: `fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-white/20`
- **Links**: Gray-600 hover to Emerald-600.

### Effects
- **Animations**: Smooth fade-ins and slide-ups.
  - `animate-fade-in`: Opacity 0 -> 1.
  - `animate-slide-up`: TranslateY 20px -> 0.
- **Gradients**: Subtle background gradients.
  - `bg-gradient-to-br from-stone-50 via-white to-emerald-50/30`

## 3. Layout Patterns

### Bento Grid
- Use a grid system for dashboard and landing page sections.
- Mix of large hero cards (2x2) and smaller feature cards (1x1).
- *Example*: `grid grid-cols-1 md:grid-cols-3 gap-6`

### Hero Section
- Large Serif Headline.
- Italicized accent words (e.g., "Radiant Skin *Needs Great Care*").
- Floating elements (badges, reviews) to create depth.

## 4. Implementation Guide (Tailwind)

### Font Setup
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap');
```

### Tailwind Config
```javascript
theme: {
  extend: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      serif: ['Playfair Display', 'serif'],
    },
    colors: {
      primary: colors.emerald,
      secondary: colors.stone,
    }
  }
}
```
