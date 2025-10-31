import { useCallback, useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config.js';
import { useAuth } from './useAuth.js';

export const useGroups = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const groupsRef = collection(db, 'groups');
    const groupsQuery = query(groupsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      groupsQuery,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setGroups(data);
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

  return { groups, loading, error, createGroup };
};
