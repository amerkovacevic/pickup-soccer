# Pickup Soccer

This repository contains a Vite + React single-page application that helps local players organize pickup soccer games. It is preconfigured with Tailwind CSS for styling, Firebase Authentication (Google provider), and Cloud Firestore for data storage.

## Getting started

1. Install dependencies:

   ```bash
   cd app
   npm install
   ```

2. Create an environment file from the provided template:

   ```bash
   cp .env.example .env.local
   ```

   Update the variables with your Firebase project credentials. The app expects Google sign-in to be enabled in Firebase Authentication and Cloud Firestore to be set up in **production mode** or with the security rules described below.

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Build for production:

   ```bash
   npm run build
   ```

## Features

- Google sign-in via Firebase Authentication.
- Any signed-in player can create a game that everyone can join.
- Players can join or leave games and see the roster update instantly.
- Game scheduling form that tracks kickoff time and location.
- Live views for available games and the games you have already joined.
- Tailwind CSS design system with dark theme styling.

Every time a player signs in, the app stores or updates a profile document in the `players` collection. This keeps basic contact details handy for future extensions like messaging or attendance tracking.

## Project structure

The React application lives in the [`app`](./app) directory:

- `src/firebase/config.js` – Firebase initialization.
- `src/firebase/players.js` – Helper to store player profiles in Firestore.
- `src/context/AuthContext.jsx` – Authentication context for the app.
- `src/hooks/useGames.js` – Firestore data hook for games.
- `src/components/` – Layout and game UI components.
- `src/pages/` – Route-level pages for login, dashboard, and games.

## Firebase configuration

This project includes a hardened set of Firestore security rules that allow authenticated players to create games while preventing them from editing other users' data. After updating the environment variables you can deploy the rules to your Firebase project:

```bash
firebase deploy --only firestore:rules
```

The rules live in [`firestore.rules`](./firestore.rules) and cover the following scenarios:

- Games can be read by anyone, but only signed-in users can create a game. The creator is stored as the organizer and is automatically the first entry in the `participants` list. Other signed-in users can add or remove themselves as participants.
- Signed-in users can read the `players` directory. Each user can create or update only their own profile document.

Feel free to customize the UI, expand the data model, or add additional Firebase functionality to suit your league.
