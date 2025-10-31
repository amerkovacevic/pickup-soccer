import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase/config.js';

const AuthContext = createContext({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOutUser: async () => {},
  error: null,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const snapshot = await getDoc(userRef);

          if (snapshot.exists()) {
            await setDoc(
              userRef,
              {
                displayName: firebaseUser.displayName ?? '',
                email: firebaseUser.email ?? '',
                photoURL: firebaseUser.photoURL ?? '',
                lastLoginAt: serverTimestamp(),
              },
              { merge: true },
            );
          } else {
            await setDoc(userRef, {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName ?? '',
              email: firebaseUser.email ?? '',
              photoURL: firebaseUser.photoURL ?? '',
              createdAt: serverTimestamp(),
              lastLoginAt: serverTimestamp(),
            });
          }
        } catch (err) {
          console.error('Failed to sync user profile', err);
        }
      }

      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Google sign-in failed', err);
      setError(err.message);
    }
  };

  const signOutUser = async () => {
    setError(null);
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Sign out failed', err);
      setError(err.message);
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      signInWithGoogle,
      signOutUser,
    }),
    [user, loading, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
