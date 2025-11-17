# Pastel Header Color Options

## Option 1: Lavender/Purple Theme (Currently Applied)

### Light Mode
- Header Background: `#f3e8ff` (soft lavender)
- Header Border: `#e9d5ff` (light purple)
- Main Background: `#ffffff` (white)

### Dark Mode
- Header Background: `#2d1b4e` (deep muted purple)
- Header Border: `#4c3575` (medium purple)
- Main Background: `#0f172a` (dark slate)

---

## Option 2: Mint/Teal Theme

### Light Mode
- Header Background: `#d1fae5` (soft mint green)
- Header Border: `#a7f3d0` (light emerald)
- Main Background: `#ffffff` (white)

### Dark Mode
- Header Background: `#134e4a` (deep teal)
- Header Border: `#0f766e` (medium teal)
- Main Background: `#0f172a` (dark slate)

---

## How to Switch

To use Option 2, update these values in `src/css/variables.css`:

**Light mode** (3 places: `:root`, `[data-theme="light"]`):
```css
--color-header-bg: #d1fae5;
--color-header-border: #a7f3d0;
```

**Dark mode** (2 places: `@media (prefers-color-scheme: dark)`, `[data-theme="dark"]`):
```css
--color-header-bg: #134e4a;
--color-header-border: #0f766e;
```
