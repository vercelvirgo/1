// ═══════════════════════════════════════════════════════════
// VercelVirgo — Coins Buy/Sell Logic
// ═══════════════════════════════════════════════════════════
import { db } from './firebase-config.js';
import {
  doc, getDoc, updateDoc, addDoc, collection,
  serverTimestamp, increment
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getLevelRate } from './utils.js';

/**
 * Distribute MLM commissions after a buy deposit is approved.
 * Called by admin when approving a deposit.
 * @param {string} buyerUid  - uid of the buyer
 * @param {number} coinsBought - number of coins purchased
 * @param {object} settings  - platform settings (commission rates)
 * @param {string} txId      - transaction document id
 */
export async function distributeCommissions(buyerUid, coinsBought, settings, txId) {
  // Get buyer's referralChain
  const buyerSnap = await getDoc(doc(db, 'users', buyerUid));
  if (!buyerSnap.exists()) return;
  const buyerData   = buyerSnap.data();
  const chain       = buyerData.referralChain || [];
  if (chain.length === 0) return; // no upline

  const commissionPromises = chain.map(async (uplineUid, idx) => {
    try {
      // Check upline is active
      const uplineSnap = await getDoc(doc(db, 'users', uplineUid));
      if (!uplineSnap.exists()) return;
      const uplineData = uplineSnap.data();
      if (uplineData.status === 'suspended') return;

      const rate         = getLevelRate(idx, settings) / 100;
      const commCoins    = Math.floor(coinsBought * rate);
      if (commCoins <= 0) return;

      const level        = idx + 1;
      const coinPrice    = settings.coinPrice || 0.10;
      const usdValue     = commCoins * coinPrice;

      // Add coins to upline user
      await updateDoc(doc(db, 'users', uplineUid), {
        coinBalance:  increment(commCoins),
        totalEarned:  increment(commCoins)
      });

      // Log commission
      await addDoc(collection(db, 'commission_logs'), {
        fromUserId:   buyerUid,
        fromUserName: buyerData.fullName || '',
        toUserId:     uplineUid,
        toUserName:   uplineData.fullName || '',
        level:        level,
        coins:        commCoins,
        usdValue:     usdValue,
        rate:         rate * 100,
        relatedTxId:  txId,
        createdAt:    serverTimestamp()
      });

      // Create a commission transaction record for upline
      await addDoc(collection(db, 'coins_transactions'), {
        userId:    uplineUid,
        userName:  uplineData.fullName || '',
        userEmail: uplineData.email || '',
        type:      'commission',
        coins:     commCoins,
        usdAmount: usdValue,
        status:    'approved',
        notes:     `Level ${level} commission from ${buyerData.fullName || 'a referral'}`,
        createdAt: serverTimestamp(),
        approvedAt: serverTimestamp()
      });
    } catch (err) {
      console.error(`Commission error for level ${idx+1} (${uplineUid}):`, err);
      // Continue to next level even if one fails
    }
  });

  await Promise.allSettled(commissionPromises);
}

/**
 * Approve a buy-coins transaction.
 * Adds coins to user wallet and distributes commissions.
 */
export async function approveBuyTransaction(txId, settings) {
  const txRef  = doc(db, 'coins_transactions', txId);
  const txSnap = await getDoc(txRef);
  if (!txSnap.exists()) throw new Error('Transaction not found');
  const tx = txSnap.data();
  if (tx.status !== 'pending') throw new Error('Transaction already processed');

  // Add coins to buyer
  await updateDoc(doc(db, 'users', tx.userId), {
    coinBalance: increment(tx.coins)
  });

  // Update transaction status
  await updateDoc(txRef, {
    status:     'approved',
    approvedAt: serverTimestamp()
  });

  // Distribute commissions
  await distributeCommissions(tx.userId, tx.coins, settings, txId);
}

/**
 * Reject a transaction.
 */
export async function rejectTransaction(txId, reason = '') {
  await updateDoc(doc(db, 'coins_transactions', txId), {
    status:  'rejected',
    notes:   reason,
    approvedAt: serverTimestamp()
  });
}

/**
 * Approve withdrawal — deduct coins from user.
 */
export async function approveWithdrawal(txId) {
  const txSnap = await getDoc(doc(db, 'coins_transactions', txId));
  if (!txSnap.exists()) throw new Error('Transaction not found');
  const tx = txSnap.data();
  if (tx.status !== 'pending') throw new Error('Already processed');

  await updateDoc(doc(db, 'users', tx.userId), {
    coinBalance:    increment(-tx.coins),
    totalWithdrawn: increment(tx.coins)
  });
  await updateDoc(doc(db, 'coins_transactions', txId), {
    status: 'paid', approvedAt: serverTimestamp()
  });
}

/**
 * Reject withdrawal — no coin deduction needed.
 */
export async function rejectWithdrawal(txId, reason = '') {
  await updateDoc(doc(db, 'coins_transactions', txId), {
    status: 'rejected', notes: reason, approvedAt: serverTimestamp()
  });
}

/**
 * Approve sell-back request — deduct coins.
 */
export async function approveSellBack(txId) {
  const txSnap = await getDoc(doc(db, 'coins_transactions', txId));
  if (!txSnap.exists()) throw new Error('Transaction not found');
  const tx = txSnap.data();
  if (tx.status !== 'pending') throw new Error('Already processed');

  await updateDoc(doc(db, 'users', tx.userId), {
    coinBalance: increment(-tx.coins)
  });
  await updateDoc(doc(db, 'coins_transactions', txId), {
    status: 'completed', approvedAt: serverTimestamp()
  });
}
