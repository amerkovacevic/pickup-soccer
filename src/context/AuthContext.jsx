import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  observeAuthState,
  signInWithGoogle as signInWithGoogleService,
  signOutCurrentUser,
  syncUserProfile,
} from '../services/authService.js';

const AuthContext = createContext({
  user: null,
  loading: true,
  error: null,
  signInWithGoogle: async () => {},
  signOutUser: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = observeAuthState(async (firebaseUser) => {
      setLoading(true);
      setError(null);

      if (firebaseUser) {
        try {
          await syncUserProfile(firebaseUser);
        } catch (syncError) {
          console.error('Failed to sync user profile with Firestore', syncError);
          setError('Unable to update your profile information.');
        }
      }

      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleSignInWithGoogle = async () => {
    setError(null);

    try {
      await signInWithGoogleService();
    } catch (signInError) {
      console.error('Google sign-in failed', signInError);
      setError('Sign in was unsuccessful. Please try again.');
    }
  };

  const handleSignOutUser = async () => {
    setError(null);

    try {
      await signOutCurrentUser();
    } catch (signOutError) {
      console.error('Sign out failed', signOutError);
      setError('Sign out was unsuccessful. Please try again.');
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      signInWithGoogle: handleSignInWithGoogle,
      signOutUser: handleSignOutUser,
    }),
    [user, loading, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
