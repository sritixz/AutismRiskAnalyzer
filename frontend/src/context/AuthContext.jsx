import { createContext, useState, useEffect, useCallback } from "react";
import * as authApi from "../api/authApi";
import { getItem, setItem, removeItem } from "../utils/localStorageHelper";
import { STORAGE_KEYS } from "../utils/constants";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate auth state from localStorage on first mount, so a page
  // refresh doesn't log the user out.
  useEffect(() => {
    const storedUser = getItem(STORAGE_KEYS.AUTH_USER);
    const storedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

    if (storedUser && storedToken) {
      setUser(storedUser);
    }

    setIsLoading(false);
  }, []);

  // React to a 401 from any API call (token expired/invalid) by
  // clearing local state. The axios interceptor already clears
  // localStorage itself; this just keeps React state in sync with it.
  useEffect(() => {
    const handleUnauthorized = () => setUser(null);
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () =>
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);

  const persistSession = (token, userData) => {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    setItem(STORAGE_KEYS.AUTH_USER, userData);
    setUser(userData);
  };

  const signup = useCallback(async (payload) => {
    const response = await authApi.signup(payload);
    const { token, user: userData } = response.data;
    persistSession(token, userData);
    return response;
  }, []);

  const login = useCallback(async (payload) => {
    const response = await authApi.login(payload);
    const { token, user: userData } = response.data;
    persistSession(token, userData);
    return response;
  }, []);

  const logout = useCallback(() => {
    removeItem(STORAGE_KEYS.AUTH_TOKEN);
    removeItem(STORAGE_KEYS.AUTH_USER);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const response = await authApi.getProfile();
    const userData = response.data.user;
    setItem(STORAGE_KEYS.AUTH_USER, userData);
    setUser(userData);
    return userData;
  }, []);

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    signup,
    login,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
