import { format } from 'date-fns';

export const formatStartTime = (startTime) => {
  try {
    if (!startTime) return 'TBD';
    const date = startTime.toDate ? startTime.toDate() : new Date(startTime);
    return format(date, 'PPpp');
  } catch (error) {
    return 'TBD';
  }
};

export const getMaxPlayers = (game) => {
  if (!game) return null;
  if (typeof game.maxPlayers === 'number') {
    return game.maxPlayers;
  }
  const parsed = Number(game.maxPlayers);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

export const getPlayerProgress = (game) => {
  const totalPlayers = (game?.participants ?? []).length;
  const maxPlayers = getMaxPlayers(game);

  if (!maxPlayers) {
    return { totalPlayers, maxPlayers: null, percentage: null };
  }

  const percentage = Math.min(100, Math.round((totalPlayers / maxPlayers) * 100));
  return { totalPlayers, maxPlayers, percentage };
};
