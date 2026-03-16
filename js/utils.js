// ═══════════════════════════════════════════════════════════════
// VercelVirgo — Utility / Helper Functions
// ═══════════════════════════════════════════════════════════════

// ─── Auto-init theme on every page ──────────────────────────────
(function() {
  const saved = localStorage.getItem('vv-theme') || 'cyber-gold';
  document.documentElement.setAttribute('data-theme', saved);
})();

// ─── Toast Notification System ──────────────────────────────────
let toastContainer = null;

function getToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

export function showToast(message, type = 'info', title = null, duration = 4000) {
  const container = getToastContainer();
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const titles = { success: 'Success', error: 'Error', warning: 'Warning', info: 'Info' };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <div class="toast-body">
      <div class="toast-title">${title || titles[type]}</div>
      <div class="toast-msg">${message}</div>
    </div>
    <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('removing');
    toast.addEventListener('animationend', () => toast.remove());
  }, duration);
}

// Make toast globally accessible for theme.js
window.VV_toast = showToast;

// ─── Spinner ─────────────────────────────────────────────────────
let spinnerEl = null;

export function showSpinner() {
  if (!spinnerEl) {
    spinnerEl = document.createElement('div');
    spinnerEl.className = 'spinner-overlay';
    spinnerEl.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(spinnerEl);
  }
  spinnerEl.style.display = 'flex';
}

export function hideSpinner() {
  if (spinnerEl) spinnerEl.style.display = 'none';
}

// ─── Generate Unique 8-char Referral Code ─────────────────────────
export function generateReferralCode(uid) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  // Use uid characters as seed for consistency
  for (let i = 0; i < 8; i++) {
    const charCode = uid.charCodeAt(i % uid.length) + i;
    code += chars[charCode % chars.length];
  }
  return code;
}

// ─── Generate Random Code (fallback) ─────────────────────────────
export function generateRandomCode(length = 8) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// ─── Format Numbers ───────────────────────────────────────────────
export function formatCoins(num) {
  if (num === null || num === undefined) return '0';
  return Number(num).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

export function formatUSD(num) {
  if (num === null || num === undefined) return '$0.00';
  return '$' + Number(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function coinsToUSD(coins, coinPrice) {
  return (Number(coins) * Number(coinPrice)).toFixed(2);
}

export function usdToCoins(usd, coinPrice) {
  if (!coinPrice || coinPrice <= 0) return 0;
  return Math.floor(Number(usd) / Number(coinPrice));
}

// ─── Format Date ─────────────────────────────────────────────────
export function formatDate(timestamp) {
  if (!timestamp) return '—';
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatDateTime(timestamp) {
  if (!timestamp) return '—';
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

export function timeAgo(timestamp) {
  if (!timestamp) return '—';
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  const secs = Math.floor((Date.now() - date.getTime()) / 1000);
  if (secs < 60)   return 'just now';
  if (secs < 3600) return `${Math.floor(secs/60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs/3600)}h ago`;
  return `${Math.floor(secs/86400)}d ago`;
}

// ─── Validation ───────────────────────────────────────────────────
export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(pass) {
  if (pass.length < 8) return 'Password must be at least 8 characters';
  if (!/[a-zA-Z]/.test(pass)) return 'Password must contain letters';
  if (!/[0-9]/.test(pass)) return 'Password must contain numbers';
  return null;
}

export function validateUSDTAddress(addr) {
  return addr && addr.trim().length >= 25;
}

export function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  field.style.borderColor = 'var(--error)';
  const existing = field.parentElement.querySelector('.form-error');
  if (existing) existing.remove();
  const err = document.createElement('span');
  err.className = 'form-error';
  err.textContent = message;
  field.parentElement.appendChild(err);
}

export function clearFieldError(fieldId) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  field.style.borderColor = '';
  const existing = field.parentElement.querySelector('.form-error');
  if (existing) existing.remove();
}

export function clearAllErrors(formEl) {
  formEl.querySelectorAll('.form-error').forEach(e => e.remove());
  formEl.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(f => {
    f.style.borderColor = '';
  });
}

// ─── Copy to Clipboard ───────────────────────────────────────────
export function copyToClipboard(text, btn = null) {
  navigator.clipboard.writeText(text).then(() => {
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = '✓ Copied!';
      btn.classList.add('copied');
      setTimeout(() => { btn.textContent = orig; btn.classList.remove('copied'); }, 2000);
    }
    showToast('Copied to clipboard!', 'success');
  }).catch(() => {
    // fallback
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    if (btn) { const orig = btn.textContent; btn.textContent = '✓ Copied!'; btn.classList.add('copied'); setTimeout(() => { btn.textContent = orig; btn.classList.remove('copied'); }, 2000); }
    showToast('Copied!', 'success');
  });
}

// ─── Referral Link Builder ────────────────────────────────────────
export function buildReferralLink(referralCode) {
  // Fixed for GitHub Pages — always points to correct base
  const origin = window.location.origin;
  const path = window.location.pathname;
  // Extract base path e.g. /vercelvirgo/ from any page
  const parts = path.split('/');
  const vvIndex = parts.findIndex(p => p.toLowerCase() === 'vercelvirgo');
  let base;
  if (vvIndex !== -1) {
    base = origin + parts.slice(0, vvIndex + 1).join('/') + '/';
  } else {
    base = origin + '/';
  }
  return base + 'register.html?ref=' + referralCode;
}register.html?ref=${referralCode}`;
}
  const base = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/');
  return `${base}register.html?ref=${referralCode}`;
}

// ─── Image to Base64 ─────────────────────────────────────────────
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    if (file.size > 2 * 1024 * 1024) {
      reject(new Error('Image must be under 2MB'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

// ─── Status Badge HTML ───────────────────────────────────────────
export function statusBadge(status) {
  const map = {
    pending:  ['⏳', 'badge-warning'],
    approved: ['✅', 'badge-success'],
    rejected: ['❌', 'badge-error'],
    active:   ['🟢', 'badge-success'],
    suspended:['🔴', 'badge-error'],
    paid:     ['💰', 'badge-success'],
    completed:['✅', 'badge-success'],
  };
  const [icon, cls] = map[status] || ['❓', 'badge-blue'];
  return `<span class="badge ${cls}">${icon} ${status}</span>`;
}

// ─── Transaction Type Badge ──────────────────────────────────────
export function typeBadge(type) {
  const map = {
    buy:        ['🔼', 'badge-success', 'Buy Coins'],
    sell:       ['🔽', 'badge-error',   'Sell Coins'],
    commission: ['💎', 'badge-gold',    'Commission'],
    withdrawal: ['💸', 'badge-blue',    'Withdrawal'],
  };
  const [icon, cls, label] = map[type] || ['❓', 'badge-blue', type];
  return `<span class="badge ${cls}">${icon} ${label}</span>`;
}

// ─── Truncate Address ─────────────────────────────────────────────
export function truncateAddress(addr, start = 6, end = 4) {
  if (!addr || addr.length <= start + end + 3) return addr || '—';
  return `${addr.slice(0, start)}...${addr.slice(-end)}`;
}

// ─── Confirm Dialog ───────────────────────────────────────────────
export function showConfirm(message, onConfirm, onCancel = null) {
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.innerHTML = `
    <div class="modal" style="max-width:400px">
      <div style="text-align:center;padding:10px 0">
        <div style="font-size:3rem;margin-bottom:16px">⚠️</div>
        <h3 style="margin-bottom:12px;font-family:var(--font-display)">Confirm Action</h3>
        <p style="color:var(--text-secondary);margin-bottom:24px">${message}</p>
        <div style="display:flex;gap:12px;justify-content:center">
          <button id="confirm-cancel" class="btn btn-secondary">Cancel</button>
          <button id="confirm-ok" class="btn btn-danger">Confirm</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(backdrop);
  backdrop.querySelector('#confirm-ok').onclick = () => { backdrop.remove(); onConfirm(); };
  backdrop.querySelector('#confirm-cancel').onclick = () => { backdrop.remove(); if (onCancel) onCancel(); };
  backdrop.onclick = (e) => { if (e.target === backdrop) { backdrop.remove(); if (onCancel) onCancel(); } };
}

// ─── Setup Sidebar Toggle (mobile) ───────────────────────────────
export function initSidebar() {
  const hamburger = document.getElementById('hamburger');
  const sidebar   = document.getElementById('sidebar');
  const overlay   = document.getElementById('sidebar-overlay');
  if (!hamburger || !sidebar) return;

  function toggleSidebar() {
    const isOpen = sidebar.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    if (overlay) overlay.classList.toggle('visible', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  hamburger.addEventListener('click', toggleSidebar);
  if (overlay) overlay.addEventListener('click', toggleSidebar);

  // Mark active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPage || href.endsWith('/' + currentPage))) {
      link.classList.add('active');
    }
  });
}

// ─── Auth guard (redirect if not logged in) ───────────────────────
export function requireAuth(auth, redirectTo = '../login.html') {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      if (!user) {
        window.location.href = redirectTo;
      } else {
        resolve(user);
      }
    });
  });
}

// ─── Get URL Param ────────────────────────────────────────────────
export function getUrlParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

// ─── Debounce ─────────────────────────────────────────────────────
export function debounce(fn, delay = 300) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}

// ─── Level commission rate ────────────────────────────────────────
export function getLevelRate(levelIndex, settings) {
  if (levelIndex === 0) return settings.commissionLevel1 || 10;
  if (levelIndex === 1) return settings.commissionLevel2 || 5;
  return settings.commissionLevelRest || 2;
}
