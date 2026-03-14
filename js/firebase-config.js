// ═══════════════════════════════════════════════════════════════
// VercelVirgo — Firebase Configuration
// ═══════════════════════════════════════════════════════════════

import { initializeApp }  from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore }   from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getAuth }        from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

const firebaseConfig = {
  apiKey:            "AIzaSyDsZ08E1LjY3__snLPKdzSxY_GrE1v1RvA",
  authDomain:        "sameru-coin.firebaseapp.com",
  projectId:         "sameru-coin",
  storageBucket:     "sameru-coin.firebasestorage.app",
  messagingSenderId: "627408594875",
  appId:             "1:627408594875:web:f683d04b08c8f0751a469e"
};

const app  = initializeApp(firebaseConfig);
const db   = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
