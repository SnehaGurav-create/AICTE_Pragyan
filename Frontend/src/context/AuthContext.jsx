import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchAuthUsers, loginUser } from '../services/api';

const AuthContext = createContext(null);

export const DEFAULT_OFFICER = {
  id: "USR-OFFICER-01",
  username: "officer@aicte.gov.in",
  name: "Dr. Rajesh Verma",
  role: "OFFICER",
  roleLabel: "AICTE Scrutiny Officer",
  designation: "Senior Technical Scrutiny Officer",
  organization: "Northern Regional Office (NRO), Kanpur / Bhopal",
  avatar: "👔",
  badgeColor: "#3b82f6"
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('pragyan_auth_user');
      return saved ? JSON.parse(saved) : DEFAULT_OFFICER;
    } catch {
      return DEFAULT_OFFICER;
    }
  });

  const [availableUsers, setAvailableUsers] = useState([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authFeedback, setAuthFeedback] = useState(null);
  const [unreadNotifCount, setUnreadNotifCount] = useState(3);

  // Fetch available personas on mount
  useEffect(() => {
    fetchAuthUsers().then((users) => {
      if (users && users.length > 0) {
        setAvailableUsers(users);
      }
    });
  }, []);

  // Save current user to localStorage whenever changed
  useEffect(() => {
    if (currentUser) {
      try {
        localStorage.setItem('pragyan_auth_user', JSON.stringify(currentUser));
      } catch (err) {
        console.warn('Could not persist auth user to localStorage:', err);
      }
    } else {
      localStorage.removeItem('pragyan_auth_user');
    }
  }, [currentUser]);

  // Fast 1-Click Role Login (Hero / Demo Mode)
  const loginAsRole = async (roleKey) => {
    const res = await loginUser({ role: roleKey });
    if (res && res.user) {
      setCurrentUser(res.user);
      if (res.unreadNotificationsCount !== undefined) {
        setUnreadNotifCount(res.unreadNotificationsCount);
      }
      setAuthFeedback(`Logged in as ${res.user.name} (${res.user.roleLabel})`);
      setTimeout(() => setAuthFeedback(null), 3500);
      setIsAuthModalOpen(false);
      return res.user;
    }
  };

  // Standard Username / Password Login
  const loginWithCredentials = async (username, password) => {
    const res = await loginUser({ username, password });
    if (res && res.user) {
      setCurrentUser(res.user);
      if (res.unreadNotificationsCount !== undefined) {
        setUnreadNotifCount(res.unreadNotificationsCount);
      }
      setAuthFeedback(`Welcome, ${res.user.name}`);
      setTimeout(() => setAuthFeedback(null), 3500);
      setIsAuthModalOpen(false);
      return { success: true, user: res.user };
    }
    return { success: false, error: 'Authentication failed' };
  };

  const logout = () => {
    setCurrentUser(null);
    setAuthFeedback('Signed out from AICTE Regulatory Bureau');
    setTimeout(() => setAuthFeedback(null), 3000);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        availableUsers,
        loginAsRole,
        loginWithCredentials,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authFeedback,
        setAuthFeedback,
        unreadNotifCount,
        setUnreadNotifCount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
