# Handdrawn Assets Guide

This guide tells you exactly what handdrawn elements to create and how to save them for the ear training app.

## General Guidelines

- **Format**: PNG with transparency
- **Resolution**: Create at 2x size (for retina displays), will be scaled down
- **Colors**: Use the oatmeal color scheme:
  - Text/Lines: `#5A5651` (Soft Charcoal)
  - Accent: `#E6D9F6` (Gentle Lavender)
  - Secondary: `#D4E4D9` (Gray-Green)
  - Highlight: `#FADCD3` (Peachy)
  - Background (if needed): `#FAF7F2` (Soft Oatmeal)

## Button Elements

### 1. Play Button (`play-button.png`)
- **Size**: 200px × 100px (will scale to 100px × 50px)
- **Content**: Hand-drawn rounded rectangle with "Play" text or ▶ symbol
- **Style**: Gentle, wobbly lines (not perfect)
- **Color**: Use gray-green (#D4E4D9) fill with charcoal (#5A5651) outline
- **Details**: Draw it like a hand-sketched button - slightly imperfect edges

### 2. Pause Button (`pause-button.png`)
- **Size**: 200px × 100px (will scale to 100px × 50px)
- **Content**: Hand-drawn rounded rectangle with "Pause" or ‖ symbol
- **Style**: Matching the play button style
- **Color**: Use peachy (#FADCD3) fill with charcoal outline

### 3. Restart Button (`restart-button.png`)
- **Size**: 200px × 100px (will scale to 100px × 50px)
- **Content**: Hand-drawn rounded rectangle with "Restart" or ↻ symbol
- **Style**: Matching other buttons
- **Color**: Use lavender (#E6D9F6) fill with charcoal outline

### 4. Generic Button Border (`button-border.png`)
- **Size**: 240px × 120px (will scale to 120px × 60px)
- **Content**: Just the outline - hand-drawn rounded rectangle
- **Style**: Wobbly, organic edges (3-4px thick line)
- **Color**: Charcoal (#5A5651)
- **Transparency**: Everything except the border line should be transparent
- **Usage**: This will be used for all other buttons (Generate, Use Pattern, etc.)

## Note Circle Elements

### 5. Note Circle - Inactive (`note-circle-inactive.png`)
- **Size**: 120px × 120px (will scale to 60px × 60px)
- **Content**: Hand-drawn circle (wobbly, not perfect)
- **Style**: Outline only, about 3px thick
- **Color**: Soft border color (#EDE7E0)
- **Transparency**: Center should be transparent

### 6. Note Circle - In Pattern (`note-circle-pattern.png`)
- **Size**: 120px × 120px (will scale to 60px × 60px)
- **Content**: Hand-drawn circle with subtle fill
- **Style**: Slightly thicker outline (4px)
- **Color**: Lavender (#E6D9F6) fill with charcoal (#5A5651) outline

### 7. Note Circle - Active/Playing (`note-circle-active.png`)
- **Size**: 120px × 120px (will scale to 60px × 60px)
- **Content**: Hand-drawn circle with prominent fill
- **Style**: Thick outline (5px), slightly larger
- **Color**: Peachy (#FADCD3) fill with charcoal outline
- **Details**: Make it look excited/emphasized

## Input/Display Elements

### 8. Pattern Input Box (`pattern-box.png`)
- **Size**: 100px × 120px (will scale to 50px × 60px)
- **Content**: Hand-drawn rectangle for single digit
- **Style**: Slightly taller than wide, wobbly edges
- **Color**: Charcoal outline on transparent background
- **Usage**: For custom pattern number entry

### 9. Notebook Paper Background (`notebook-paper.png`)
- **Size**: 800px × 200px (repeatable pattern)
- **Content**: Horizontal lines like notebook paper
- **Style**: Hand-drawn lines, slightly wavy (not ruler-straight)
- **Color**: Very light lines (#EDE7E0)
- **Spacing**: Lines about 40px apart
- **Usage**: Background for pattern display area

## Decorative Elements

### 10. Corner Doodle - Top Left (`doodle-corner-tl.png`)
- **Size**: 200px × 200px (will scale to 100px × 100px)
- **Content**: Musical notes, squiggles, stars - cute corner decoration
- **Style**: Light, playful, sketchy
- **Color**: Very light lavender (#E6D9F6) so it doesn't overpower
- **Placement**: Will appear in top-left corner of main container

### 11. Corner Doodle - Top Right (`doodle-corner-tr.png`)
- **Size**: 200px × 200px (matching corner-tl)
- **Content**: Different but complementary doodles
- **Style**: Mirror the energy of top-left
- **Color**: Light peachy (#FADCD3)

### 12. Corner Doodle - Bottom Left (`doodle-corner-bl.png`)
- **Size**: 200px × 200px
- **Content**: More subtle than top corners
- **Color**: Light gray-green (#D4E4D9)

### 13. Corner Doodle - Bottom Right (`doodle-corner-br.png`)
- **Size**: 200px × 200px
- **Content**: Balances bottom-left
- **Color**: Light lavender (#E6D9F6)

### 14. Section Divider (`section-divider.png`)
- **Size**: 800px × 40px (repeatable horizontally)
- **Content**: Hand-drawn wavy line with small doodles (dots, stars, notes)
- **Style**: Playful but not distracting
- **Color**: Soft charcoal (#5A5651) at 50% opacity
- **Usage**: Between major sections (Pattern Generation, Display, Playback)

## Optional Advanced Elements

### 15. Handwritten Digits 0-9 (optional)
If you want to replace the Patrick Hand font with actual handwritten digits:
- **Files**: `digit-0.png` through `digit-9.png`
- **Size**: 80px × 100px each (will scale to 40px × 50px)
- **Content**: Hand-written number
- **Style**: Casual, readable handwriting
- **Color**: Charcoal (#5A5651)
- **Usage**: For pattern display numbers

## How to Add Your Assets

1. Create your PNG files with the exact names listed above
2. Save them in this `/assets` folder
3. The CSS is already set up to use them automatically
4. Refresh the page to see your handdrawn elements!

## Testing Your Assets

To see how your assets look:
1. Create one element at a time (start with something simple like `button-border.png`)
2. Drop it in this folder
3. Open the app and check if it appears
4. Adjust size/style if needed
5. Move on to the next element

## Tips for Creating Handdrawn Elements

- **Use a tablet/iPad**: Apple Pencil, Wacom, or similar works great
- **Apps**: Procreate, Adobe Fresco, or even simple sketching apps
- **Export**: Make sure to export with transparency (PNG)
- **Style consistency**: Keep the wobbliness and line weight consistent across all elements
- **Don't overthink it**: The charm is in the imperfection!

## Current Status

All CSS classes are set up with placeholder styles (dashed borders). As you add PNG files, they will automatically replace the placeholders.

**Placeholders active for:**
- ✓ All buttons (showing colored backgrounds with dashed borders)
- ✓ Note circles (showing CSS circles)
- ✓ Input boxes (showing standard inputs)
- ✓ Corner doodles (hidden until you add them)
- ✓ Section dividers (simple border for now)

Once you add the PNG files, the handdrawn aesthetic will come to life!
