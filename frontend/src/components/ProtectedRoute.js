import { useEffect, useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import api from '../utils/api';

export default function ProtectedRoute({ allowedRoles }) {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(
    location.state?.user ? true : null
  );
  const [user, setUser] = useState(location.state?.user || null);
  const [isLoading, setIsLoading] = useState(!location.state?.user);

  useEffect(() => {
    // If user data passed from AuthCallback, skip auth check
    if (location.state?.user) {
      setIsAuthenticated(true);
      setUser(location.state.user);
      setIsLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const response = await api.get('/auth/me');
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [location.state]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F46E5]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet context={{ user }} />;
}
