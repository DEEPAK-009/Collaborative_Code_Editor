import { useEffect, useEffectEvent, useState } from "react";
import { getCurrentUser, updateProfile as updateProfileRequest } from "../api/auth";
import { AuthContext } from "./auth-context";
import {
  clearPersistedAuth,
  decodeAuthToken,
  persistAuth,
  readStoredUser,
} from "../utils/auth";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(readStoredUser());
  const [isAuthReady, setIsAuthReady] = useState(false);

  const logout = () => {
    clearPersistedAuth();
    setToken(null);
    setUser(null);
    setIsAuthReady(true);
  };

  const login = (nextToken, nextUser = null) => {
    const fallbackUser = nextUser || decodeAuthToken(nextToken);

    persistAuth({
      token: nextToken,
      user: fallbackUser,
    });

    setToken(nextToken);
    setUser(fallbackUser);
    setIsAuthReady(true);
  };

  const syncUser = useEffectEvent(async () => {
    if (!token) {
      setIsAuthReady(true);
      return;
    }

    try {
      const response = await getCurrentUser();
      persistAuth({ token, user: response.user });
      setUser(response.user);
    } catch {
      logout();
      return;
    }

    setIsAuthReady(true);
  });

  useEffect(() => {
    if (!token) {
      setIsAuthReady(true);
      return;
    }

    syncUser();
  }, [token, syncUser]);

  const updateProfile = async (payload) => {
    const response = await updateProfileRequest(payload);
    login(response.token, response.user);
    return response.user;
  };

  const value = {
    isAuthReady,
    token,
    user,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
