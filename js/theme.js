// ═══════════════════════════════════════════════════════════
// VercelVirgo — Theme Manager
// Handles 8 premium themes with localStorage persistence
// ═══════════════════════════════════════════════════════════

export const THEMES = [
  { id: 'cyber-gold',      name: 'Cyber Gold',    emoji: '⬡', desc: 'Default dark gold' },
  { id: 'neon-purple',     name: 'Neon Purple',   emoji: '💜', desc: 'Vivid purple glow' },
  { id: 'arctic-frost',    name: 'Arctic Frost',  emoji: '❄️', desc: 'Clean light blue' },
  { id: 'crimson-night',   name: 'Crimson',       emoji: '🔴', desc: 'Deep red luxury' },
  { id: 'emerald-matrix',  name: 'Matrix',        emoji: '💚', desc: 'Digital green' },
  { id: 'solar-flare',     name: 'Solar Flare',   emoji: '🔥', desc: 'Orange fire' },
  { id: 'titanium',        name: 'Titanium',      emoji: '⬜', desc: 'Sleek monochrome' },
  { id: 'aurora',          name: 'Aurora',        emoji: '🌌', desc: 'Teal & purple' },
];

const STORAGE_KEY = 'vv-theme';

/** Apply a theme to the document */
export function applyTheme(themeId) {
  const valid = THEMES.find(t => t.id === themeId);
  const id = valid ? themeId : 'cyber-gold';
  document.documentElement.setAttribute('data-theme', id);
  localStorage.setItem(STORAGE_KEY, id);
}

/** Get current theme id */
export function getCurrentTheme() {
  return localStorage.getItem(STORAGE_KEY) || 'cyber-gold';
}

/** Initialize theme on page load */
export function initTheme() {
  const saved = getCurrentTheme();
  applyTheme(saved);
  return saved;
}

/** Build the theme switcher HTML for admin settings */
export function buildThemeSwitcher(currentTheme) {
  const dots = THEMES.map(t => `
    <div class="theme-option ${t.id === currentTheme ? 'active' : ''}"
         onclick="window.VV_setTheme('${t.id}')"
         title="${t.name} — ${t.desc}">
      <div class="theme-dot theme-dot-${t.id}"></div>
      <div class="theme-name">${t.name}</div>
      <div class="theme-check">✓</div>
    </div>
  `).join('');

  return `
    <div class="theme-switcher">
      <div class="theme-switcher-title">🎨 Platform Theme</div>
      <div class="theme-grid" id="theme-grid">${dots}</div>
      <p style="font-size:.78rem;color:var(--text-muted);margin-top:12px">
        Theme applies globally to all users. Saved automatically.
      </p>
    </div>
  `;
}

/** Global function for onclick handlers */
window.VV_setTheme = function(themeId) {
  applyTheme(themeId);
  // Update active state in UI
  document.querySelectorAll('.theme-option').forEach(el => {
    const isActive = el.getAttribute('onclick')?.includes(themeId);
    el.classList.toggle('active', isActive);
  });
  // Show toast if available
  if (window.VV_toast) {
    const t = THEMES.find(x => x.id === themeId);
    window.VV_toast(`Theme changed to ${t?.name || themeId} ${t?.emoji || ''}`, 'success');
  }
};
