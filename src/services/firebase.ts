/**
 * Firebase service implementation
 * Only loaded when VITE_BACKEND_TYPE=firebase
 */

let firebaseApp: any = null;
let firebaseDb: any = null;
let firebaseAuth: any = null;

async function initFirebase() {
  if (firebaseApp) return { app: firebaseApp, db: firebaseDb, auth: firebaseAuth };

  try {
    // These imports will only be bundled when this file is imported
    const { initializeApp } = await import('firebase/app');
    const { getFirestore } = await import('firebase/firestore');
    const { getAuth } = await import('firebase/auth');

    const config = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };

    firebaseApp = initializeApp(config);
    firebaseDb = getFirestore(firebaseApp);
    firebaseAuth = getAuth(firebaseApp);

    return { app: firebaseApp, db: firebaseDb, auth: firebaseAuth };
  } catch (e) {
    console.warn('[Firebase] Not configured or failed to init:', e);
    return null;
  }
}

export async function createFirebaseWishesService(): Promise<any> {
  const fb = await initFirebase();
  if (!fb) return null;

  const { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, getDocs } = await import('firebase/firestore');
  const wishesRef = collection(fb.db, 'wishes');
  const q = query(wishesRef, orderBy('createdAt', 'desc'));

  let subscribers: Set<(wishes: any[]) => void> = new Set();
  let unsubscribeSnapshot: (() => void) | null = null;

  const setupListener = () => {
    if (unsubscribeSnapshot) return;
    unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
      const wishes = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() ?? doc.data().createdAt,
      }));
      subscribers.forEach((cb) => cb(wishes));
    });
  };

  setupListener();

  return {
    subscribe: (callback: (wishes: any[]) => void) => {
      subscribers.add(callback);
      getDocs(q).then((snapshot) => {
        const wishes = snapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.()?.toISOString() ?? doc.data().createdAt,
        }));
        callback(wishes);
      });
      return () => {
        subscribers.delete(callback);
        if (subscribers.size === 0 && unsubscribeSnapshot) {
          unsubscribeSnapshot();
          unsubscribeSnapshot = null;
        }
      };
    },
    async add({ name, message }: { name: string; message: string }) {
      const docRef = await addDoc(wishesRef, { name, message, createdAt: serverTimestamp() });
      return { id: docRef.id, name, message, createdAt: new Date().toISOString() };
    },
    async getOnce() {
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() ?? doc.data().createdAt,
      }));
    },
  };
}

export async function createFirebaseHeartsService(): Promise<any> {
  const fb = await initFirebase();
  if (!fb) return null;

  const { doc, onSnapshot, getDoc, runTransaction } = await import('firebase/firestore');
  const counterRef = doc(fb.db, 'counters', 'hearts');

  let subscribers: Set<(count: number) => void> = new Set();
  let unsubscribeSnapshot: (() => void) | null = null;

  const setupListener = () => {
    if (unsubscribeSnapshot) return;
    unsubscribeSnapshot = onSnapshot(counterRef, (snapshot) => {
      const count = snapshot.exists() ? snapshot.data().count ?? 0 : 0;
      subscribers.forEach((cb) => cb(count));
    });
  };

  setupListener();

  return {
    subscribe: (callback: (count: number) => void) => {
      subscribers.add(callback);
      getDoc(counterRef).then((snap) => callback(snap.exists() ? snap.data().count ?? 0 : 0));
      return () => {
        subscribers.delete(callback);
        if (subscribers.size === 0 && unsubscribeSnapshot) {
          unsubscribeSnapshot();
          unsubscribeSnapshot = null;
        }
      };
    },
    async increment() {
      const newCount = await runTransaction(fb.db, async (transaction) => {
        const snap = await transaction.get(counterRef);
        const current = snap.exists() ? snap.data().count ?? 0 : 0;
        const next = current + 1;
        transaction.set(counterRef, { count: next }, { merge: true });
        return next;
      });
      return newCount;
    },
    async getOnce() {
      const snap = await getDoc(counterRef);
      return snap.exists() ? snap.data().count ?? 0 : 0;
    },
  };
}

export async function createFirebaseRsvpService(): Promise<any> {
  const fb = await initFirebase();
  if (!fb) return null;

  const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
  const rsvpRef = collection(fb.db, 'rsvps');

  return {
    async submit(payload: any) {
      await addDoc(rsvpRef, { ...payload, createdAt: serverTimestamp() });
      return { success: true, message: 'Cảm ơn bạn đã phản hồi!' };
    },
  };
}