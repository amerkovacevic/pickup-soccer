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

   Update the variables with your Firebase project credentials. The app expects Google sign-in to be enabled in Firebase Authentication and Cloud Firestore to be set up in **production mode** or with appropriate rules for your use case.

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
- Group management to organize your teams or communities.
- Game scheduling form that attaches games to groups.
- Live views for available games and the games you have already joined.
- Tailwind CSS design system with dark theme styling.

## Project structure

The React application lives in the [`app`](./app) directory:

- `src/firebase/config.js` – Firebase initialization.
- `src/context/AuthContext.jsx` – Authentication context for the app.
- `src/hooks/useGroups.js` and `src/hooks/useGames.js` – Firestore data hooks.
- `src/components/` – Layout, group, and game UI components.
- `src/pages/` – Route-level pages for login, dashboard, groups, and games.

Feel free to customize the UI, expand the data model, or add additional Firebase functionality to suit your league.
