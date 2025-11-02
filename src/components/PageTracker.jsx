import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../firebase/analytics.js';

const pageNames = {
  '/': 'Dashboard',
  '/login': 'Login',
  '/games': 'Games',
  '/games/available': 'Available Games',
  '/games/create': 'Create Game',
};

export const PageTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const pageName = pageNames[location.pathname] || location.pathname;
    trackPageView(pageName, location.pathname);
  }, [location]);

  return null;
};

