import {
  appendToArrayField,
  createDocument,
  listenToCollection,
  serverTimestampValue,
  timestampFromDate,
} from '../firebase/firestore.js';

export const subscribeToGames = (onUpdate, onError) =>
  listenToCollection({
    path: 'games',
    orderByField: 'startTime',
    orderDirection: 'asc',
    onUpdate,
    onError,
  });

export const createGameRecord = (user, { title, location, startTime, groupId, groupName }) => {
  const trimmedTitle = title?.trim();
  if (!trimmedTitle) {
    throw new Error('Game title is required.');
  }

  if (!groupId) {
    throw new Error('A group must be selected to create a game.');
  }

  const sanitizedLocation = location?.trim() ?? '';
  const scheduledDate = new Date(startTime);
  if (Number.isNaN(scheduledDate.valueOf())) {
    throw new Error('A valid start time is required.');
  }

  return createDocument('games', {
    title: trimmedTitle,
    location: sanitizedLocation,
    groupId,
    groupName: groupName ?? '',
    startTime: timestampFromDate(scheduledDate),
    createdAt: serverTimestampValue(),
    createdBy: user.uid,
    createdByName: user.displayName ?? '',
    participants: [
      {
        uid: user.uid,
        displayName: user.displayName ?? '',
        photoURL: user.photoURL ?? '',
      },
    ],
  });
};

export const joinGameById = (gameId, participant) =>
  appendToArrayField('games', gameId, 'participants', participant);
