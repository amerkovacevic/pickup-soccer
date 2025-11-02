import { logEvent, setUserProperties } from 'firebase/analytics';
import { analytics } from './config.js';

/**
 * Helper to safely log events - checks if analytics is initialized
 */
const safeLogEvent = (eventName, eventParams = {}) => {
  if (analytics) {
    try {
      logEvent(analytics, eventName, eventParams);
    } catch (error) {
      console.warn('Analytics event failed:', error);
    }
  }
};

/**
 * Track page views
 */
export const trackPageView = (pageName, pagePath) => {
  safeLogEvent('page_view', {
    page_title: pageName,
    page_location: pagePath,
    page_path: pagePath,
  });
};

/**
 * Track authentication events
 */
export const trackSignIn = (method = 'google') => {
  safeLogEvent('login', {
    method: method,
  });
};

export const trackSignOut = () => {
  safeLogEvent('logout');
};

export const trackSignUp = (method = 'google') => {
  safeLogEvent('sign_up', {
    method: method,
  });
};

/**
 * Track game-related events
 */
export const trackGameCreated = (gameData) => {
  safeLogEvent('game_created', {
    has_max_players: gameData.maxPlayers != null,
    max_players: gameData.maxPlayers || 0,
    location: gameData.location || 'unknown',
  });
};

export const trackGameJoined = (gameId, gameData) => {
  const currentPlayers = (gameData.participants || []).length;
  const maxPlayers = gameData.maxPlayers || 0;
  
  safeLogEvent('game_joined', {
    game_id: gameId,
    current_players: currentPlayers,
    max_players: maxPlayers || null,
    is_full: maxPlayers > 0 && currentPlayers >= maxPlayers,
    has_max_players: maxPlayers > 0,
  });
};

export const trackGameLeft = (gameId) => {
  safeLogEvent('game_left', {
    game_id: gameId,
  });
};

export const trackGameDeleted = (gameId) => {
  safeLogEvent('game_deleted', {
    game_id: gameId,
  });
};

/**
 * Set user properties for better analytics segmentation
 */
export const setAnalyticsUserProperties = (user) => {
  if (analytics && user) {
    try {
      setUserProperties(analytics, {
        user_id: user.uid,
        user_name: user.displayName || 'Anonymous',
      });
    } catch (error) {
      console.warn('Failed to set user properties:', error);
    }
  }
};

