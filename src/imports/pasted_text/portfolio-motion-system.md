Add a complete, subtle motion system to this portfolio site. The goal is fluidity and polish — not spectacle. Every animation should feel inevitable, not decorative. Nothing should call attention to itself.

─────────────────────────────────────────
1. SCROLL-TRIGGERED REVEALS (all pages)
─────────────────────────────────────────
Apply to every section on every page as content enters the viewport:
- Elements fade in + slide up 16px → 0px, 500ms, ease-out
- Stagger children by 80ms: headline first → subtitle → body → CTA
- Trigger when element is 10% into the viewport
- Never animate elements already visible on page load

─────────────────────────────────────────
2. NAVIGATION
─────────────────────────────────────────
- Page load: nav fades in from top, 300ms, ease-out
- Nav links hover: thin underline slides in left → right, 200ms ease-out. Active page link always has underline visible.
- On scroll past hero: nav background crossfades from transparent → #111111, 200ms
- Mobile: hamburger menu slides in from right, 300ms ease-out

─────────────────────────────────────────
3. PAGE TRANSITIONS
─────────────────────────────────────────
- On link click: current page fades out (opacity 1 → 0), 200ms
- New page fades in (opacity 0 → 1), 300ms
- Total feels under 500ms

─────────────────────────────────────────
4. BUTTONS
─────────────────────────────────────────
- Hover: background fill slides in from left, 150ms ease-out
- Click: scale down to 0.97, 100ms, returns to 1.0
- Outline buttons: border brightens on hover, 150ms

─────────────────────────────────────────
5. HOMEPAGE HERO ENTRANCE (plays once on load)
─────────────────────────────────────────
Sequence — elements overlap so total feels like 800ms:
1. Eyebrow text: fade in, 400ms, ease-out — starts immediately
2. Main headline: fade in + slide up 24px → 0, 600ms, ease-out — starts 100ms after eyebrow
3. Subheadline: fade in, 400ms, ease-out — starts 200ms after headline
4. CTA buttons: fade in together, 300ms, ease-out — starts 150ms after subheadline
5. Background grid pattern: scale 1.05 → 1.0, 1200ms, ease-out — starts on load, runs behind everything

─────────────────────────────────────────
6. STATS COUNTER ANIMATION (homepage numbers section)
─────────────────────────────────────────
Triggered when stats section scrolls into view:
- "15+" counts from 0 → 15, then "+" appears. Duration 1200ms, ease-out.
- "8" counts from 0 → 8. Starts 150ms after 15+.
- "6" counts from 0 → 6. Starts 150ms after 8.
- Company names below (TELUS · INTUIT · SAMSUNG · IPSY · INTEL · CI&T) fade in after all counters finish, 400ms ease-out
Should feel like a dashboard loading real data — satisfying, not a trick.

─────────────────────────────────────────
7. PROJECT CARD HOVER STATES (homepage)
─────────────────────────────────────────
TELUS SmartHome+ card (large featured card):
- Card lifts: box-shadow increases subtly, 200ms ease-out
- "Read Case Study →" arrow translates 4px right, 150ms ease-out
- Phone mockup scales 1.0 → 1.02, 300ms ease-out
- Tag pills border brightens slightly

Coming Soon cards (IPSY, Intuit):
- Same card lift on hover
- "Coming Soon" badge does not change
- Cursor is default (not pointer) — these are not clickable

─────────────────────────────────────────
8. CASE STUDY — READING PROGRESS BAR
─────────────────────────────────────────
On the TELUS SmartHome+ case study page only:
- 2px horizontal line fixed at top of viewport, below nav
- Fills left → right as user scrolls, proportional to reading progress
- White at 60% opacity (adapts to dark sections), dark at 40% opacity (adapts to light sections)
- No percentage number. No animation delay. Follows scroll in real time.

─────────────────────────────────────────
9. CASE STUDY — SECTION REVEALS
─────────────────────────────────────────
More editorial pacing than the homepage — this is long-form reading:
- Section labels (e.g. "01 · THE PRODUCT"): fade in, 300ms
- Section headlines: fade in + slide up 12px → 0, 400ms, ease-out — 80ms after label
- Body paragraphs: fade in only, 400ms, ease-out — 120ms after headline
- Cards in a grid: fade in + slide up 20px → 0, 500ms, stagger 100ms each

Before/After comparison blocks (SDUI and Jarvis):
- Left "Before" panel: slides in from left (−16px → 0) + fades in, 500ms ease-out
- Right "After" panel: slides in from right (+16px → 0) + fades in, 500ms ease-out, starts 100ms after left
- Creates an "opening" effect that reinforces the contrast

Key Learnings section:
- For each block entering the viewport: large number fades in (400ms) → title (200ms later) → description (100ms later)
- Alternating dark/light backgrounds do NOT animate — only the content inside each block does

Closing statement "This work was never about designing screens.":
- Fade in + scale 0.98 → 1.0, 800ms ease-out — slow and deliberate, like an exhale

─────────────────────────────────────────
DO NOT ADD:
─────────────────────────────────────────
- No parallax scrolling on backgrounds (causes mobile jank)
- No auto-playing looping animations
- No bounce or elastic easing
- No animated gradients or color-shifting backgrounds
- No scroll-jacking
- No hover effects that shift text position or cause layout reflow