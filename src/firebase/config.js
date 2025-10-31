import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  setPersistence,
} from 'firebase/auth';
import { getFirestore, initializeFirestore } from 'firebase/firestore';

const ENV_KEYS = {
  apiKey: 'VITE_FIREBASE_API_KEY',
  authDomain: 'VITE_FIREBASE_AUTH_DOMAIN',
  projectId: 'VITE_FIREBASE_PROJECT_ID',
  storageBucket: 'VITE_FIREBASE_STORAGE_BUCKET',
  messagingSenderId: 'VITE_FIREBASE_MESSAGING_SENDER_ID',
  appId: 'VITE_FIREBASE_APP_ID',
  measurementId: 'VITE_FIREBASE_MEASUREMENT_ID',
};

const firebaseConfig = Object.entries(ENV_KEYS).reduce((config, [configKey, envKey]) => {
  const value = import.meta.env[envKey];

  if (value) {
    config[configKey] = value;
  }

  return config;
}, {});

const missingKeys = Object.entries(ENV_KEYS)
  .filter(([, envKey]) => !import.meta.env[envKey])
  .map(([, envKey]) => envKey);

if (missingKeys.length) {
  console.warn(
    `Missing Firebase environment variables: ${missingKeys.join(', ')}. ` +
      'Authentication and database features will not work until they are provided.',
  );
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
void setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.warn('Failed to configure Firebase auth persistence', error);
});

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

let db;
try {
  db = initializeFirestore(app, { ignoreUndefinedProperties: true });
} catch (error) {
  console.warn('Falling back to default Firestore instance', error);
  db = getFirestore(app);
}

export { app, auth, db, googleProvider };
