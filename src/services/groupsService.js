import {
  appendToArrayField,
  createDocument,
  listenToCollection,
  serverTimestampValue,
} from '../firebase/firestore.js';

export const subscribeToGroups = (onUpdate, onError) =>
  listenToCollection({
    path: 'groups',
    orderByField: 'createdAt',
    orderDirection: 'desc',
    onUpdate,
    onError,
  });

export const createGroupRecord = (user, { name, description }) => {
  const trimmedName = name?.trim();
  if (!trimmedName) {
    throw new Error('Group name is required.');
  }

  const sanitizedDescription = description?.trim() ?? '';

  return createDocument('groups', {
    name: trimmedName,
    description: sanitizedDescription,
    ownerId: user.uid,
    ownerName: user.displayName ?? '',
    ownerEmail: user.email ?? '',
    members: [user.uid],
    createdAt: serverTimestampValue(),
  });
};

export const joinGroupById = (groupId, userId) =>
  appendToArrayField('groups', groupId, 'members', userId);
