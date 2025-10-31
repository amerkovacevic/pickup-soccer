import { useCallback, useEffect, useMemo, useState } from 'react';
import {
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

export const useGroups = () => {
  const { user } = useAuth();
  const [allGroups, setAllGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const groupsRef = collection(db, 'groups');
    const groupsQuery = query(groupsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      groupsQuery,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAllGroups(data);
        setLoading(false);
      },
      (err) => {
        console.error('Failed to fetch groups', err);
        setError(err.message);
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
      const groupsRef = collection(db, 'groups');
      await addDoc(groupsRef, {
        name,
        description,
        ownerId: user.uid,
        ownerName: user.displayName,
        members: [user.uid],
        createdAt: serverTimestamp(),
      });
    },
    [user],
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

  const joinGroup = useCallback(
    async (groupId) => {
      if (!user) {
        throw new Error('You must be signed in to join a group.');
      }

      const group = allGroups.find((item) => item.id === groupId);
      if (group && (group.members ?? []).includes(user.uid)) {
        throw new Error('You are already a member of this group.');
      }

      setError(null);
      const groupRef = doc(db, 'groups', groupId);
      await updateDoc(groupRef, {
        members: arrayUnion(user.uid),
      });
    },
    [allGroups, user],
  );

  const addMemberToGroup = useCallback(
    async (groupId, memberId) => {
      if (!user) {
        throw new Error('You must be signed in to manage groups.');
      }

      if (!memberId) {
        throw new Error('Select a player before adding them to the group.');
      }

      const group = allGroups.find((item) => item.id === groupId);
      if (!group) {
        throw new Error('Group not found.');
      }

      if (group.ownerId !== user.uid) {
        throw new Error('Only the group owner can add new members.');
      }

      if ((group.members ?? []).includes(memberId)) {
        throw new Error('This player is already a member of the group.');
      }

      setError(null);
      const groupRef = doc(db, 'groups', groupId);
      await updateDoc(groupRef, {
        members: arrayUnion(memberId),
      });
    },
    [allGroups, user],
  );

  return {
    groups: userGroups,
    discoverableGroups,
    loading,
    error,
    createGroup,
    joinGroup,
    addMemberToGroup,
  };
};
