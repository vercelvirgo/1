// ═══════════════════════════════════════════════════════════
// VercelVirgo — Dashboard Data Helpers
// ═══════════════════════════════════════════════════════════
import { db } from './firebase-config.js';
import {
  doc, getDoc, collection, query, where,
  orderBy, limit, getDocs, getCountFromServer
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

/** Load platform settings from Firestore */
export async function loadSettings() {
  const snap = await getDoc(doc(db, 'settings', 'platform'));
  if (snap.exists()) return snap.data();
  // Return defaults if settings not yet created
  return {
    coinPrice:           0.10,
    commissionLevel1:    10,
    commissionLevel2:    5,
    commissionLevelRest: 2,
    usdtWalletAddress:   '',
    minWithdrawal:       10,
    minSellCoins:        100
  };
}

/** Load user dashboard stats */
export async function loadUserStats(uid) {
  const [userSnap, directRefSnap, teamSnap] = await Promise.all([
    getDoc(doc(db, 'users', uid)),
    getCountFromServer(query(collection(db, 'users'), where('referredBy', '==', uid))),
    getCountFromServer(query(collection(db, 'users'), where('referralChain', 'array-contains', uid)))
  ]);
  return {
    userData:      userSnap.exists() ? userSnap.data() : null,
    directRefs:    directRefSnap.data().count,
    totalTeam:     teamSnap.data().count
  };
}

/** Load recent transactions for a user */
export async function loadRecentTransactions(uid, maxItems = 10) {
  const q = query(
    collection(db, 'coins_transactions'),
    where('userId', '==', uid),
    orderBy('createdAt', 'desc'),
    limit(maxItems)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/** Load all transactions for a user */
export async function loadAllTransactions(uid) {
  const q = query(
    collection(db, 'coins_transactions'),
    where('userId', '==', uid),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
