import { Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfileSetup from './pages/ProfileSetup';
import Discover from './pages/Discover';
import Matches from './pages/Matches';
import OAuthCallback from './pages/OAuthCallback';
import NotFound from "./pages/NotFound";

export const routers = [
    {
      path: "/",
      name: 'home',
      element: <Navigate to="/discover" replace />,
    },
    {
      path: "/login",
      name: 'login',
      element: <Login />,
    },
    {
      path: "/register",
      name: 'register',
      element: <Register />,
    },
    {
      path: "/profile/setup",
      name: 'profile-setup',
      element: <ProfileSetup />,
    },
    {
      path: "/discover",
      name: 'discover',
      element: <Discover />,
    },
    {
      path: "/matches",
      name: 'matches',
      element: <Matches />,
    },
    {
      path: "/auth/google-callback",
      name: 'google-callback',
      element: <OAuthCallback />,
    },
    {
      path: "/auth/linkedin-callback",
      name: 'linkedin-callback',
      element: <OAuthCallback />,
    },
    {
      path: "/auth/yahoo-callback",
      name: 'yahoo-callback',
      element: <OAuthCallback />,
    },
    /* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */
    {
      path: "*",
      name: '404',
      element: <NotFound />,
    },
];

declare global {
  interface Window {
    __routers__: typeof routers;
  }
}

window.__routers__ = routers;