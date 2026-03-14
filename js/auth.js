// ═══════════════════════════════════════════════════════════
// VercelVirgo — Auth Helpers
// ═══════════════════════════════════════════════════════════
import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

/** Require auth — redirects to login if not logged in */
export function requireAuth(redirectTo = '../login.html') {
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      unsub();
      if (!user) { window.location.href = redirectTo; return; }
      resolve(user);
    });
  });
}

/** Require admin role — redirects if not admin */
export function requireAdmin(redirectTo = '../login.html') {
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      unsub();
      if (!user) { window.location.href = redirectTo; return; }
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (!snap.exists() || snap.data().role !== 'admin') {
          auth.signOut(); window.location.href = redirectTo; return;
        }
        resolve({ user, userData: snap.data() });
      } catch (e) {
        window.location.href = redirectTo;
      }
    });
  });
}

/** Get current user data from Firestore */
export async function getCurrentUserData() {
  const user = auth.currentUser;
  if (!user) return null;
  const snap = await getDoc(doc(db, 'users', user.uid));
  return snap.exists() ? snap.data() : null;
}

/** Sign out and redirect */
export async function logout(redirectTo = '../login.html') {
  await signOut(auth);
  window.location.href = redirectTo;
}
