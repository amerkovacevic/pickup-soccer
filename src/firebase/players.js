import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from './config.js';

export const upsertPlayerProfile = async (user, isNewUser = false) => {
  if (!user?.uid) {
    throw new Error('A valid user is required to save the player profile.');
  }

  const playerRef = doc(db, 'pickupSoccer_players', user.uid);
  const payload = {
    displayName: user.displayName ?? '',
    email: user.email ?? '',
    photoURL: user.photoURL ?? '',
    updatedAt: serverTimestamp(),
  };

  if (isNewUser) {
    payload.createdAt = serverTimestamp();
  }

  await setDoc(playerRef, payload, { merge: true });
};
