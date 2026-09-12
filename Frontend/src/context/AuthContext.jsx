import { useCallback, useEffect, useEffectEvent, useRef, useState } from "react";
import { getCurrentUser, updateProfile as updateProfileRequest } from "../api/auth";
import { AuthContext } from "./auth-context";
import {
  clearPersistedAuth,
  decodeAuthToken,
  persistAuth,
  readStoredToken,
  readStoredUser,
} from "../utils/auth";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(readStoredToken());
  const [user, setUser] = useState(readStoredUser());
  const [isAuthReady, setIsAuthReady] = useState(false);
  const authOperationRef = useRef(0);

  const logout = useCallback(() => {
    // Invalidate any session validation request that is still in flight.
    authOperationRef.current += 1;
    clearPersistedAuth();
    setToken(null);
    setUser(null);
    setIsAuthReady(true);
  }, []);

  const login = useCallback((nextToken, nextUser = null) => {
    authOperationRef.current += 1;
    const fallbackUser = nextUser || decodeAuthToken(nextToken);

    persistAuth({
      token: nextToken,
      user: fallbackUser,
    });

    setToken(nextToken);
    setUser(fallbackUser);
    setIsAuthReady(true);
  }, []);

  const syncUser = useEffectEvent(async () => {
    if (!token) {
      setIsAuthReady(true);
      return;
    }

    const operationId = authOperationRef.current;
    const tokenBeingValidated = token;

    try {
      const response = await getCurrentUser();

      if (
        operationId !== authOperationRef.current ||
        tokenBeingValidated !== readStoredToken()
      ) {
        return;
      }

      persistAuth({ token, user: response.user });
      setUser(response.user);
    } catch {
      if (operationId === authOperationRef.current) {
        logout();
      }
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
  }, [logout, token, syncUser]);

  const updateProfile = useCallback(async (payload) => {
    const response = await updateProfileRequest(payload);
    login(response.token, response.user);
    return response.user;
  }, [login]);

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
