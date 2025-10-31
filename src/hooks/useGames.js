import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Timestamp,
  addDoc,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase/config.js';
import { useAuth } from './useAuth.js';

export const useGames = () => {
  const { user } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const gamesRef = collection(db, 'games');
    const gamesQuery = query(gamesRef, orderBy('startTime', 'asc'));

    const unsubscribe = onSnapshot(
      gamesQuery,
      (snapshot) => {
        const data = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setGames(data);
        setLoading(false);
      },
      (err) => {
        console.error('Failed to fetch games', err);
        setError(err.message);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  const createGame = useCallback(
    async ({
      title,
      location,
      startTime,
      groupId,
      groupName,
    }) => {
      if (!user) {
        throw new Error('You must be signed in to create a game.');
      }

      if (!groupId) {
        throw new Error('Select a group before creating a game.');
      }

      setError(null);
      const gamesRef = collection(db, 'games');
      await addDoc(gamesRef, {
        title,
        location,
        groupId,
        groupName,
        startTime: Timestamp.fromDate(new Date(startTime)),
        createdAt: serverTimestamp(),
        createdBy: user.uid,
        createdByName: user.displayName,
        participants: [
          {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
        ],
      });
    },
    [user],
  );

  const joinGame = useCallback(
    async (gameId) => {
      if (!user) {
        throw new Error('You must be signed in to join a game.');
      }

      setError(null);
      const gameRef = doc(db, 'games', gameId);
      await updateDoc(gameRef, {
        participants: arrayUnion({
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
        }),
      });
    },
    [user],
  );

  const availableGames = useMemo(() => {
    if (!user) {
      return games;
    }
    return games.filter((game) =>
      !(game.participants ?? []).some((participant) => participant.uid === user.uid),
    );
  }, [games, user]);

  const joinedGames = useMemo(() => {
    if (!user) {
      return [];
    }
    return games.filter((game) =>
      (game.participants ?? []).some((participant) => participant.uid === user.uid),
    );
  }, [games, user]);

  return {
    games,
    availableGames,
    joinedGames,
    loading,
    error,
    createGame,
    joinGame,
  };
};
