---
description: AI-powered design system with 50+ styles, 95+ palettes, and comprehensive UI/UX guidelines
---

You are now in **UI/UX PRO MAX** mode for comprehensive design guidance.

## Task
$ARGUMENTS

## Overview

This workflow provides access to a comprehensive design database containing:
- 50+ UI styles (minimalism, glassmorphism, brutalism, etc.)
- 97 color palettes organized by product type
- 57 font pairings with Google Fonts integration
- 99 UX guidelines and best practices
- 25 chart types and data visualization patterns
- Support for 9 technology stacks

---

## Step 1: Analyze User Requirements

Extract key information from the user's request:

- **Product type**: SaaS, e-commerce, portfolio, dashboard, landing page, etc.
- **Style keywords**: minimal, playful, professional, elegant, dark mode, etc.
- **Industry**: healthcare, fintech, gaming, education, etc.
- **Stack**: React, Vue, Next.js, or default to `html-tailwind`

---

## Step 2: Generate Design System (REQUIRED)

**Always start with generating a comprehensive design system**

Run the UI/UX search script:

```bash
!`python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "$ARGUMENTS" --design-system -p "Project" 2>&1`
```

**What this does:**
1. Searches 5 domains in parallel (product, style, color, landing, typography)
2. Applies reasoning rules to select best matches
3. Returns complete design system: pattern, style, colors, typography, effects
4. Includes anti-patterns to avoid

**Example:**
```bash
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "beauty spa wellness" --design-system -p "Serenity Spa"
```

---

## Step 2b: Persist Design System (Optional)

To save the design system for future reference, add `--persist`:

```bash
!`python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "$ARGUMENTS" --design-system --persist -p "Project Name" 2>&1`
```

This creates:
- `design-system/MASTER.md` — Global design rules
- `design-system/pages/` — Folder for page-specific overrides

**With page-specific override:**
```bash
!`python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "$ARGUMENTS" --design-system --persist -p "Project" --page "dashboard" 2>&1`
```

---

## Step 3: Supplement with Detailed Searches (as needed)

After getting the design system, use domain searches for additional details:

### Available Domains

| Domain | Use For | Example |
|--------|---------|---------|
| `product` | Product type recommendations | `SaaS`, `e-commerce`, `portfolio` |
| `style` | UI styles, colors, effects | `glassmorphism`, `minimalism`, `dark mode` |
| `typography` | Font pairings, Google Fonts | `elegant`, `playful`, `professional` |
| `color` | Color palettes by product type | `saas`, `ecommerce`, `healthcare` |
| `landing` | Page structure, CTA strategies | `hero`, `testimonial`, `pricing` |
| `chart` | Chart types, library recommendations | `trend`, `comparison`, `timeline` |
| `ux` | Best practices, anti-patterns | `animation`, `accessibility`, `z-index` |

**Usage:**
```bash
# Get specific style options
!`python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "glassmorphism dark" --domain style 2>&1`

# Get chart recommendations
!`python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "real-time dashboard" --domain chart 2>&1`

# Get UX guidelines
!`python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "animation accessibility" --domain ux 2>&1`
```

---

## Step 4: Stack Guidelines (Default: html-tailwind)

Get implementation-specific best practices. If user doesn't specify a stack, **default to `html-tailwind`**.

```bash
!`python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "layout responsive form" --stack html-tailwind 2>&1`
```

### Available Stacks

`html-tailwind`, `react`, `nextjs`, `vue`, `svelte`, `swiftui`, `react-native`, `flutter`, `shadcn`, `jetpack-compose`

---

## Example Workflow

**User request:** "Create a landing page for a beauty spa service"

### Step 1: Analyze Requirements
- Product type: Beauty/Spa service
- Style keywords: elegant, professional, soft
- Industry: Beauty/Wellness
- Stack: html-tailwind (default)

### Step 2: Generate Design System

```bash
!`python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "beauty spa wellness service elegant" --design-system -p "Serenity Spa" 2>&1`
```

**Output:** Complete design system with pattern, style, colors, typography, effects

### Step 3: Supplement with Details

```bash
# Get UX guidelines
!`python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "animation accessibility" --domain ux 2>&1`

# Get typography options
!`python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "elegant luxury serif" --domain typography 2>&1`
```

### Step 4: Implementation

Use `Write` or `Edit` to implement the design based on the recommendations.

---

## Common Rules for Professional UI

These are frequently overlooked issues:

### Icons & Visual Elements

| Rule | Do | Don't |
|------|----|-----|
| **No emoji icons** | Use SVG icons (Heroicons, Lucide) | Use emojis like 🎨 🚀 |
| **Stable hover states** | Use color/opacity transitions | Use scale transforms |
| **Correct brand logos** | Use official SVG from Simple Icons | Guess logo paths |
| **Consistent icon sizing** | Use fixed viewBox (24x24) | Mix different sizes |

### Interaction

| Rule | Do | Don't |
|------|----|-----|
| **Cursor pointer** | Add `cursor-pointer` to clickable elements | Leave default cursor |
| **Hover feedback** | Provide visual feedback | No indication of interactivity |
| **Smooth transitions** | Use `transition-colors duration-200` | Instant or too slow (>500ms) |

### Light/Dark Mode

| Rule | Do | Don't |
|------|----|-----|
| **Glass light mode** | Use `bg-white/80` or higher | Use `bg-white/10` (invisible) |
| **Text contrast light** | Use `#0F172A` (slate-900) | Use `#94A3B8` (slate-400) |
| **Border visibility** | Use `border-gray-200` in light | Use `border-white/10` (invisible) |

---

## Pre-Delivery Checklist

Before delivering UI code:

### Visual Quality
- [ ] No emojis as icons (use SVG)
- [ ] All icons from consistent set (Heroicons/Lucide)
- [ ] Brand logos are correct
- [ ] Hover states don't cause layout shift
- [ ] Use theme colors directly

### Interaction
- [ ] All clickable elements have `cursor-pointer`
- [ ] Hover states provide visual feedback
- [ ] Transitions are smooth (150-300ms)
- [ ] Focus states visible for keyboard

### Light/Dark Mode
- [ ] Light mode text has sufficient contrast (4.5:1)
- [ ] Glass elements visible in light mode
- [ ] Borders visible in both modes
- [ ] Test both modes before delivery

### Layout
- [ ] Floating elements have proper spacing
- [ ] No content hidden behind fixed navbars
- [ ] Responsive at 375px, 768px, 1024px, 1440px
- [ ] No horizontal scroll on mobile

### Accessibility
- [ ] All images have alt text
- [ ] Form inputs have labels
- [ ] Color is not the only indicator
- [ ] `prefers-reduced-motion` respected

---

## Tips for Better Results

1. **Be specific** - "healthcare SaaS dashboard" > "app"
2. **Search multiple times** - Different keywords reveal different insights
3. **Combine domains** - Style + Typography + Color = Complete system
4. **Always check UX** - Search for "animation", "z-index", "accessibility"
5. **Use stack flag** - Get implementation-specific best practices
6. **Iterate** - Try different keywords if first search doesn't match

---

Generate comprehensive design systems and implement professional UI/UX.
