import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchMe, loginUser, logoutUser, registerUser } from "../api/auth.js";
import { setAuthToken } from "../api/client.js";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const response = await fetchMe();
      setUser(response.data.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
    }
    loadUser();
  }, []);

  const login = async (payload) => {
    const response = await loginUser(payload);
    const token = response.data.data.token;
    localStorage.setItem("token", token);
    setAuthToken(token);
    setUser(response.data.data.user);
  };

  const register = async (payload) => {
    const response = await registerUser(payload);
    const token = response.data.data.token;
    localStorage.setItem("token", token);
    setAuthToken(token);
    setUser(response.data.data.user);
  };

  const logout = async () => {
    await logoutUser();
    localStorage.removeItem("token");
    setAuthToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
