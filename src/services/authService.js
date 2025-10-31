import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config.js';
import { getDocument, serverTimestampValue, setDocument } from '../firebase/firestore.js';

export const observeAuthState = (callback) => onAuthStateChanged(auth, callback);

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

export const signOutCurrentUser = () => signOut(auth);

export const syncUserProfile = async (firebaseUser) => {
  if (!firebaseUser) {
    return;
  }

  const { uid, displayName = '', email = '', photoURL = '' } = firebaseUser;
  const profileData = {
    uid,
    displayName,
    email,
    photoURL,
  };

  const snapshot = await getDocument('users', uid);

  if (snapshot.exists()) {
    await setDocument(
      'users',
      uid,
      {
        ...profileData,
        lastLoginAt: serverTimestampValue(),
      },
      { merge: true },
    );
    return;
  }

  await setDocument('users', uid, {
    ...profileData,
    createdAt: serverTimestampValue(),
    lastLoginAt: serverTimestampValue(),
  });
};
