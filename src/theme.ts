// Brand blues — use ONLY for small key UI elements (icons, borders, active states, badges)
export const BLUE_PRIMARY = '#2CC2EE';
export const BLUE_SECONDARY = '#5A76F1';
export const BLUE_GRADIENT = `linear-gradient(135deg, ${BLUE_PRIMARY}, ${BLUE_SECONDARY})`;

// Semantic — ONLY for positive/negative statistical trend indicators
export const TREND_UP = '#4ADE80';
export const TREND_DOWN = '#F87171';

// Neutral surface palette — all cards and containers use these
export const SURFACE_BASE = '#14141A';       // darkest — page bg
export const SURFACE_CARD = '#1C1C24';       // card background (cinza chumbo)
export const SURFACE_RAISED = '#222230';     // elevated inner elements
export const SURFACE_HOVER = '#27272F';      // hover state

// Neutral borders
export const BORDER_SUBTLE = 'rgba(255,255,255,0.06)';
export const BORDER_DEFAULT = 'rgba(255,255,255,0.09)';

// Neutral bar/chart fills — duotone cinza
export const BAR_STRONG = 'rgba(255,255,255,0.22)';   // primary bar
export const BAR_SOFT = 'rgba(255,255,255,0.10)';     // secondary bar

// Legacy aliases kept for compatibility (use SURFACE_* going forward)
export const CARD_BG = SURFACE_CARD;
export const CARD_BORDER = BORDER_DEFAULT;
export const CARD_BG_ACCENT = SURFACE_CARD;
export const CARD_BORDER_ACCENT = BORDER_DEFAULT;
