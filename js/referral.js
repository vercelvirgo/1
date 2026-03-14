// ═══════════════════════════════════════════════════════════
// VercelVirgo — Referral / MLM Tree Logic
// ═══════════════════════════════════════════════════════════
import { db } from './firebase-config.js';
import {
  collection, query, where, getDocs, getCountFromServer
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

/**
 * Get all downline members grouped by level for a given user.
 * Level 1 = direct referrals, Level 2 = their referrals, etc.
 * @param {string} uid - the user's uid
 * @returns {object} { levels: { 1: [...], 2: [...] }, total: number }
 */
export async function getDownlineByLevel(uid) {
  const q = query(
    collection(db, 'users'),
    where('referralChain', 'array-contains', uid)
  );
  const snap = await getDocs(q);
  const levels = {};
  let total = 0;

  snap.docs.forEach(d => {
    const member = d.data();
    const chain  = member.referralChain || [];
    const idx    = chain.indexOf(uid);
    if (idx === -1) return; // safety check
    const level  = idx + 1;
    if (!levels[level]) levels[level] = [];
    levels[level].push(member);
    total++;
  });

  return { levels, total };
}

/**
 * Get commission logs for a user grouped by level.
 */
export async function getCommissionByLevel(uid) {
  const q = query(collection(db, 'commission_logs'), where('toUserId', '==', uid));
  const snap = await getDocs(q);
  const byLevel = {};
  let totalCoins = 0;

  snap.docs.forEach(d => {
    const c = d.data();
    const lv = c.level || 1;
    if (!byLevel[lv]) byLevel[lv] = 0;
    byLevel[lv] += c.coins || 0;
    totalCoins  += c.coins || 0;
  });

  return { byLevel, totalCoins };
}

/**
 * Count direct referrals (level 1 only).
 */
export async function countDirectReferrals(uid) {
  const q = query(collection(db, 'users'), where('referredBy', '==', uid));
  const snap = await getCountFromServer(q);
  return snap.data().count;
}

/**
 * Count total team size (all levels).
 */
export async function countTotalTeam(uid) {
  const q = query(collection(db, 'users'), where('referralChain', 'array-contains', uid));
  const snap = await getCountFromServer(q);
  return snap.data().count;
}
