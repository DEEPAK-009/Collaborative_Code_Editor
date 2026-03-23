const AUTH_STORAGE = window.sessionStorage;
const LEGACY_STORAGE = window.localStorage;

const decodeBase64Url = (value) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const remainder = normalized.length % 4;
  const padded =
    remainder === 0 ? normalized : normalized.padEnd(normalized.length + (4 - remainder), "=");

  return atob(padded);
};

export const decodeAuthToken = (token) => {
  if (!token) {
    return null;
  }

  try {
    const [, payload] = token.split(".");

    if (!payload) {
      return null;
    }

    return JSON.parse(decodeBase64Url(payload));
  } catch {
    return null;
  }
};

export const readStoredToken = () => {
  try {
    return AUTH_STORAGE.getItem("token");
  } catch {
    return null;
  }
};

export const readStoredUser = () => {
  try {
    const rawUser = AUTH_STORAGE.getItem("user");
    return rawUser ? JSON.parse(rawUser) : null;
  } catch {
    return null;
  }
};

export const persistAuth = ({ token, user }) => {
  if (token) {
    AUTH_STORAGE.setItem("token", token);
    LEGACY_STORAGE.removeItem("token");
  }

  if (user) {
    AUTH_STORAGE.setItem("user", JSON.stringify(user));
    LEGACY_STORAGE.removeItem("user");
  }
};

export const clearPersistedAuth = () => {
  AUTH_STORAGE.removeItem("token");
  AUTH_STORAGE.removeItem("user");
  AUTH_STORAGE.removeItem("activeRoomId");
  LEGACY_STORAGE.removeItem("token");
  LEGACY_STORAGE.removeItem("user");
  LEGACY_STORAGE.removeItem("activeRoomId");
};
