import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from './config.js';

const mapSnapshot = (snapshot) =>
  snapshot.docs.map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() }));

export const listenToCollection = ({
  path,
  orderByField,
  orderDirection = 'asc',
  onUpdate,
  onError,
}) => {
  const collectionRef = collection(db, path);
  const constraints = [];

  if (orderByField) {
    constraints.push(orderBy(orderByField, orderDirection));
  }

  const collectionQuery = constraints.length ? query(collectionRef, ...constraints) : collectionRef;

  return onSnapshot(
    collectionQuery,
    (snapshot) => onUpdate(mapSnapshot(snapshot)),
    (error) => onError?.(error),
  );
};

export const createDocument = (path, data) => addDoc(collection(db, path), data);

export const setDocument = (path, id, data, options = {}) => setDoc(doc(db, path, id), data, options);

export const getDocument = (path, id) => getDoc(doc(db, path, id));

export const updateDocument = (path, id, data) => updateDoc(doc(db, path, id), data);

export const appendToArrayField = (path, id, field, value) =>
  updateDoc(doc(db, path, id), { [field]: arrayUnion(value) });

export const serverTimestampValue = () => serverTimestamp();

export const timestampFromDate = (date) => Timestamp.fromDate(date);
