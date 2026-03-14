// ═══════════════════════════════════════════════════════════
// VercelVirgo — Admin Shared Sidebar HTML
// ═══════════════════════════════════════════════════════════

export function getAdminSidebar(activePage = '') {
  return `
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-logo">
      <div class="sidebar-logo-icon" style="background:linear-gradient(135deg,#EF4444,#B91C1C)">A</div>
      <div>
        <div class="sidebar-logo-text">VercelVirgo</div>
        <div class="sidebar-logo-sub" style="color:#EF4444">Admin Panel</div>
      </div>
    </div>
    <nav class="sidebar-nav">
      <div class="nav-section">
        <div class="nav-section-label">Overview</div>
        <a href="dashboard.html" class="nav-link ${activePage==='dashboard'?'active':''}"><span class="nav-icon">📊</span> Dashboard</a>
      </div>
      <div class="nav-section">
        <div class="nav-section-label">Approvals</div>
        <a href="deposits.html" class="nav-link ${activePage==='deposits'?'active':''}">
          <span class="nav-icon">🔼</span> Deposits
          <span class="nav-badge" id="pending-deposits-badge" style="display:none">0</span>
        </a>
        <a href="withdrawals.html" class="nav-link ${activePage==='withdrawals'?'active':''}">
          <span class="nav-icon">💸</span> Withdrawals
          <span class="nav-badge" id="pending-withdrawals-badge" style="display:none">0</span>
        </a>
        <a href="sell-requests.html" class="nav-link ${activePage==='sell'?'active':''}">
          <span class="nav-icon">🔽</span> Sell Requests
          <span class="nav-badge" id="pending-sells-badge" style="display:none">0</span>
        </a>
      </div>
      <div class="nav-section">
        <div class="nav-section-label">Management</div>
        <a href="users.html" class="nav-link ${activePage==='users'?'active':''}"><span class="nav-icon">👥</span> Users</a>
        <a href="settings.html" class="nav-link ${activePage==='settings'?'active':''}"><span class="nav-icon">⚙️</span> Settings</a>
      </div>
      <div class="nav-section">
        <div class="nav-section-label">Platform</div>
        <a href="../index.html" class="nav-link"><span class="nav-icon">🌐</span> View Site</a>
      </div>
    </nav>
    <div class="sidebar-footer">
      <div class="sidebar-user">
        <div class="sidebar-avatar" id="admin-avatar" style="background:linear-gradient(135deg,#EF4444,#B91C1C)">A</div>
        <div>
          <div class="sidebar-user-name" id="admin-name">Admin</div>
          <div class="sidebar-user-email" id="admin-email">—</div>
        </div>
      </div>
      <button class="btn btn-danger btn-sm btn-full" id="admin-logout-btn">🚪 Sign Out</button>
    </div>
  </aside>
  <div class="sidebar-overlay" id="sidebar-overlay"></div>`;
}
