import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  console.log("AuthContext mounted");

  const token = localStorage.getItem("token");
  console.log("Token:", token);

  if (!token) {
    setUser(null);
    setLoading(false);
    return;
  }

  api.get("/auth/me")
    .then(res => {
      console.log("ME API RESPONSE:", res.data); 
      setUser(res.data);
    })
    .catch(err => {
      console.log("ME API ERROR:", err);
      localStorage.clear();
      setUser(null);
    })
    .finally(() => setLoading(false));
}, []);


  const logout = (navigate) => {
    localStorage.clear();
    setUser(null);
    navigate("/login", { replace: true });
  };

  const refreshUser = async () => {
    setLoading(true);
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch (err) {
      localStorage.clear();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
