// ═══════════════════════════════════════════════════════════
// VercelVirgo — Admin Logic Helpers
// ═══════════════════════════════════════════════════════════
import { db, auth } from './firebase-config.js';
import { signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import {
  doc, getDoc, collection, query, where,
  getDocs, getCountFromServer, orderBy, limit
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

/**
 * Verify current user is admin. Returns userData or redirects.
 */
export async function verifyAdmin(redirectTo = '../login.html') {
  const user = auth.currentUser;
  if (!user) { window.location.href = redirectTo; return null; }
  const snap = await getDoc(doc(db, 'users', user.uid));
  if (!snap.exists() || snap.data().role !== 'admin') {
    await signOut(auth);
    window.location.href = redirectTo;
    return null;
  }
  return snap.data();
}

/**
 * Get pending transaction counts for all types.
 */
export async function getPendingCounts() {
  const [depSnap, withSnap, sellSnap] = await Promise.all([
    getCountFromServer(query(collection(db,'coins_transactions'), where('type','==','buy'),        where('status','==','pending'))),
    getCountFromServer(query(collection(db,'coins_transactions'), where('type','==','withdrawal'), where('status','==','pending'))),
    getCountFromServer(query(collection(db,'coins_transactions'), where('type','==','sell'),       where('status','==','pending')))
  ]);
  return {
    deposits:    depSnap.data().count,
    withdrawals: withSnap.data().count,
    sells:       sellSnap.data().count,
    total:       depSnap.data().count + withSnap.data().count + sellSnap.data().count
  };
}

/**
 * Load admin dashboard stats.
 */
export async function getAdminStats() {
  const [usersSnap, approvedSnap, pendingCounts] = await Promise.all([
    getCountFromServer(collection(db, 'users')),
    getDocs(query(collection(db,'coins_transactions'), where('type','==','buy'), where('status','==','approved'))),
    getPendingCounts()
  ]);

  let totalCoins = 0, totalRevenue = 0;
  approvedSnap.docs.forEach(d => {
    totalCoins   += d.data().coins || 0;
    totalRevenue += d.data().usdAmount || 0;
  });

  return {
    totalUsers:    usersSnap.data().count,
    totalCoins,
    totalRevenue,
    pendingCounts
  };
}

/**
 * Get recent activity feed — last N transactions.
 */
export async function getRecentActivity(n = 20) {
  const q = query(
    collection(db, 'coins_transactions'),
    orderBy('createdAt', 'desc'),
    limit(n)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Update pending badges in sidebar (if elements exist).
 */
export async function updateSidebarBadges() {
  try {
    const counts = await getPendingCounts();
    const depBadge  = document.getElementById('pending-deposits-badge');
    const withBadge = document.getElementById('pending-withdrawals-badge');
    const sellBadge = document.getElementById('pending-sells-badge');
    if (depBadge)  { depBadge.textContent  = counts.deposits;    depBadge.style.display  = counts.deposits    > 0 ? '' : 'none'; }
    if (withBadge) { withBadge.textContent = counts.withdrawals; withBadge.style.display = counts.withdrawals > 0 ? '' : 'none'; }
    if (sellBadge) { sellBadge.textContent = counts.sells;       sellBadge.style.display = counts.sells       > 0 ? '' : 'none'; }
  } catch (e) { /* non-critical */ }
}
