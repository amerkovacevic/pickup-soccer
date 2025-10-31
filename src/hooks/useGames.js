import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from './useAuth.js';
import {
  createGameRecord,
  joinGameById,
  subscribeToGames,
} from '../services/gamesService.js';

export const useGames = () => {
  const { user } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToGames(
      (fetchedGames) => {
        setGames(fetchedGames);
        setLoading(false);
      },
      (subscriptionError) => {
        console.error('Failed to fetch games', subscriptionError);
        setError('Unable to load games at this time.');
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  const createGame = useCallback(
    async ({ title, location, startTime, groupId, groupName }) => {
      if (!user) {
        throw new Error('You must be signed in to create a game.');
      }

      setError(null);
      await createGameRecord(user, { title, location, startTime, groupId, groupName });
    },
    [user],
  );

  const joinGame = useCallback(
    async (gameId) => {
      if (!user) {
        throw new Error('You must be signed in to join a game.');
      }

      const targetGame = games.find((game) => game.id === gameId);
      if (targetGame && (targetGame.participants ?? []).some((participant) => participant.uid === user.uid)) {
        throw new Error('You have already joined this game.');
      }

      setError(null);
      await joinGameById(gameId, {
        uid: user.uid,
        displayName: user.displayName ?? '',
        photoURL: user.photoURL ?? '',
      });
    },
    [games, user],
  );

  const availableGames = useMemo(() => {
    if (!user) {
      return games;
    }

    return games.filter(
      (game) => !(game.participants ?? []).some((participant) => participant.uid === user.uid),
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
