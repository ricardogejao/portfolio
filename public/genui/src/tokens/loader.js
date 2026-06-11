/**
 * loader.js — CDS Token Loader
 * ====================================================================
 * Manages which CSS token files are active, sets data-brand and
 * data-platform on <html> so all CSS selectors activate, and fires a
 * `cds:tokens-changed` event after every swap.
 *
 * Static files (auto-injected on load):
 *   global.css        — brand- and platform-agnostic primitives
 *   semantic.css      — semantic color tokens
 *   typography.css    — platform-font typography tokens
 *   components.css    — component tokens (global + per-platform)
 *
 * Swappable files (managed by swapTokens):
 *   brand-{name}.css     — brand primitives, theme aliases, brand-font typography
 *   platform-{name}.css  — platform font stack and platform-specific overrides
 *
 * Public API:
 *   window.swapTokens(brand, platform)   — swap brand and platform
 *   window.getActiveTokens()             — { brand, platform }
 *
 * Events:
 *   document.dispatchEvent(new CustomEvent('cds:tokens-changed', {
 *     detail: { brand, platform }
 *   }))
 *
 * Valid values:
 *   brand    — "telus" | "homi"
 *   platform — "ios" | "android" | "web"
 * ====================================================================
 */

(function () {
  const BRANDS    = ['telus', 'homi'];
  const PLATFORMS = ['ios', 'android', 'web'];

  /* ── Resolve base path relative to this script's location ────────── */
  const BASE = (function () {
    const s = document.querySelector('script[src*="tokens/loader"]');
    if (!s) return 'src/tokens/';
    return s.src.replace(/loader\.js.*$/, '');
  })();

  function urlFor(filename) {
    return BASE + filename;
  }

  /* ── Link management ─────────────────────────────────────────────── */
  function ensureLink(id, href) {
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement('link');
      el.rel = 'stylesheet';
      el.id = id;
      el.onerror = function () {
        console.warn('[CDS] Failed to load stylesheet: ' + el.href);
      };
      document.head.appendChild(el);
    }
    if (el.href !== href) el.href = href;
    return el;
  }

  /* ── Static files: always loaded ─────────────────────────────────── */
  // These don't change when brand/platform switches and are activated by
  // the data-brand / data-platform attributes set on <html>.
  ensureLink('cds-token-global',     urlFor('global.css'));
  ensureLink('cds-token-semantic',   urlFor('semantic.css'));
  ensureLink('cds-token-typography', urlFor('typography.css'));
  ensureLink('cds-token-components', urlFor('components.css'));

  /* ── Public API ──────────────────────────────────────────────────── */

  /**
   * Swap brand and platform token stylesheets and activate CSS selectors.
   * @param {string} brand    — "telus" | "homi"
   * @param {string} platform — "ios" | "android" | "web"
   */
  window.swapTokens = function (brand, platform) {
    if (!BRANDS.includes(brand)) {
      console.warn('[CDS] Unknown brand "' + brand + '". Valid: ' + BRANDS.join(', '));
      return;
    }
    if (!PLATFORMS.includes(platform)) {
      console.warn('[CDS] Unknown platform "' + platform + '". Valid: ' + PLATFORMS.join(', '));
      return;
    }

    ensureLink('cds-token-brand',    urlFor('brand-'    + brand    + '.css'));
    ensureLink('cds-token-platform', urlFor('platform-' + platform + '.css'));

    document.documentElement.setAttribute('data-brand',    brand);
    document.documentElement.setAttribute('data-platform', platform);

    document.dispatchEvent(new CustomEvent('cds:tokens-changed', {
      detail: { brand: brand, platform: platform },
    }));
  };

  /**
   * Read the currently active brand and platform.
   * @returns {{brand: string|null, platform: string|null}}
   */
  window.getActiveTokens = function () {
    const root = document.documentElement;
    return {
      brand:    root.getAttribute('data-brand'),
      platform: root.getAttribute('data-platform'),
    };
  };
})();
