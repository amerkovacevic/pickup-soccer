import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getAdditionalUserInfo, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config.js';
import { upsertPlayerProfile } from '../firebase/players.js';

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
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    setError(null);
    try {
      const credential = await signInWithPopup(auth, googleProvider);

      const additionalInfo = getAdditionalUserInfo(credential);
      
      try {
        await upsertPlayerProfile(credential.user, additionalInfo?.isNewUser);
      } catch (profileError) {
        console.error('Failed to save the player profile', profileError);
        setError('We signed you in, but we could not save your player profile. Some features may not work.');
      }
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
