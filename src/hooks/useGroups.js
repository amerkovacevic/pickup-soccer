import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from './useAuth.js';
import {
  createGroupRecord,
  joinGroupById,
  subscribeToGroups,
} from '../services/groupsService.js';

export const useGroups = () => {
  const { user } = useAuth();
  const [allGroups, setAllGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToGroups(
      (groups) => {
        setAllGroups(groups);
        setLoading(false);
      },
      (subscriptionError) => {
        console.error('Failed to fetch groups', subscriptionError);
        setError('Unable to load groups at this time.');
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  const createGroup = useCallback(
    async ({ name, description }) => {
      if (!user) {
        throw new Error('You must be signed in to create a group.');
      }

      setError(null);
      await createGroupRecord(user, { name, description });
    },
    [user],
  );

  const joinGroup = useCallback(
    async (groupId) => {
      if (!user) {
        throw new Error('You must be signed in to join a group.');
      }

      const targetGroup = allGroups.find((group) => group.id === groupId);
      if (targetGroup && (targetGroup.members ?? []).includes(user.uid)) {
        throw new Error('You are already a member of this group.');
      }

      setError(null);
      await joinGroupById(groupId, user.uid);
    },
    [allGroups, user],
  );

  const userGroups = useMemo(() => {
    if (!user) {
      return [];
    }

    return allGroups.filter((group) => (group.members ?? []).includes(user.uid));
  }, [allGroups, user]);

  const discoverableGroups = useMemo(() => {
    if (!user) {
      return [];
    }

    return allGroups.filter((group) => !(group.members ?? []).includes(user.uid));
  }, [allGroups, user]);

  return {
    groups: userGroups,
    discoverableGroups,
    loading,
    error,
    createGroup,
    joinGroup,
  };
};
