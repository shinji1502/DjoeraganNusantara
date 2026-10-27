import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * ScrollToTop Component
 * Ensures every navigation to a new route displays the destination at scrollY = 0.
 * Handles client-side routing, direct URL access, browser refresh, and browser history.
 * Supports smooth scrolling to hash anchors (e.g. #section-id) if specified.
 * Preserves normal page scrolling for on-page interactions, modals, and dropdowns.
 */
export const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    // If a hash anchor is provided (e.g. /#katalog or /tentang#visi), scroll to target element
    if (hash) {
      const elementId = hash.replace(/^#/, '');
      const timer = setTimeout(() => {
        const targetElement = document.getElementById(elementId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }
      }, 60);
      return () => clearTimeout(timer);
    }

    // For route navigation (PUSH or REPLACE): reset window scroll position to (0, 0)
    // Using 'instant' ensures no jarring animation from bottom to top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, [pathname, search, hash, navType]);

  return null;
};
