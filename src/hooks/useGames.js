import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Timestamp,
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase/config.js';
import { useAuth } from './useAuth.js';
import { trackGameCreated, trackGameJoined, trackGameLeft, trackGameDeleted } from '../firebase/analytics.js';

export const useGames = () => {
  const { user } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const gamesRef = collection(db, 'pickupSoccer_games');
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
    async ({ title, location, startTime, maxPlayers }) => {
      if (!user) {
        throw new Error('You must be signed in to create a game.');
      }

      setError(null);
      const gamesRef = collection(db, 'pickupSoccer_games');
      const parsedMaxPlayers = Number(maxPlayers);
      const maxPlayersValue = Number.isFinite(parsedMaxPlayers) && parsedMaxPlayers > 0 ? parsedMaxPlayers : null;
      
      const docRef = await addDoc(gamesRef, {
        title,
        location,
        startTime: Timestamp.fromDate(new Date(startTime)),
        createdAt: serverTimestamp(),
        createdBy: user.uid,
        createdByName: user.displayName,
        maxPlayers: maxPlayersValue,
        participants: [
          {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
        ],
      });

      // Track game creation
      trackGameCreated({
        maxPlayers: maxPlayersValue,
        location: location || 'unknown',
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
      const gameRef = doc(db, 'pickupSoccer_games', gameId);
      const game = games.find((item) => item.id === gameId);

      if (!game) {
        throw new Error('Game not found.');
      }

      const participantAlreadyJoined = (game.participants ?? []).some(
        (participant) => participant.uid === user.uid,
      );

      if (participantAlreadyJoined) {
        throw new Error('You are already part of this game.');
      }

      const maxPlayers =
        typeof game.maxPlayers === 'number'
          ? game.maxPlayers
          : Number.isFinite(Number(game.maxPlayers))
            ? Number(game.maxPlayers)
            : null;
      const currentPlayers = (game.participants ?? []).length;

      if (maxPlayers && currentPlayers >= maxPlayers) {
        throw new Error('This game is already full.');
      }

      await updateDoc(gameRef, {
        participants: arrayUnion({
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
        }),
      });

      // Track game join
      trackGameJoined(gameId, {
        participants: [...(game.participants || []), {
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
        }],
        maxPlayers: maxPlayers,
      });
    },
    [games, user],
  );

  const leaveGame = useCallback(
    async (gameId) => {
      if (!user) {
        throw new Error('You must be signed in to leave a game.');
      }

      const game = games.find((item) => item.id === gameId);
      const participant = game?.participants?.find((entry) => entry.uid === user.uid);

      if (!participant) {
        throw new Error('You are not part of this game.');
      }

      setError(null);
      const gameRef = doc(db, 'pickupSoccer_games', gameId);
      await updateDoc(gameRef, {
        participants: arrayRemove(participant),
      });

      // Track game leave
      trackGameLeft(gameId);
    },
    [games, user],
  );

  const deleteGame = useCallback(
    async (gameId) => {
      if (!user) {
        throw new Error('You must be signed in to delete a game.');
      }

      const game = games.find((item) => item.id === gameId);

      if (!game) {
        throw new Error('Game not found.');
      }

      if (game.createdBy !== user.uid) {
        throw new Error('Only the game creator can delete this game.');
      }

      setError(null);
      const gameRef = doc(db, 'pickupSoccer_games', gameId);
      await deleteDoc(gameRef);

      // Track game deletion
      trackGameDeleted(gameId);
    },
    [games, user],
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
    leaveGame,
    deleteGame,
  };
};
