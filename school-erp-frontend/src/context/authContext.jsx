import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");

    if (!token || !role) {
      setUser(null);
      setLoading(false);
      return;
    }

    setUser({ role, name: name || "User" });
    setLoading(false);
  }, []);

  const logout = (navigate) => {
    localStorage.clear();
    setUser(null);
    navigate("/login", { replace: true });
  };

  const refreshUser = async () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");

    if (!token || !role) {
      setUser(null);
      return;
    }

    setUser({ role, name: name || "User" });
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
