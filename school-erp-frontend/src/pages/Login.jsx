import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/authContext";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      console.log("RAW LOGIN RESPONSE:", res.data);

      const { token, role, student_id, user_id, name } = res.data;

      if (!token || !role) {
        throw new Error("Invalid login response from server");
      }

      // 🔐 Store common data
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("user_id", user_id);
      localStorage.setItem("name", name);

      // Only student gets student_id at login
      if (student_id) {
        localStorage.setItem("student_id", student_id);
      }

      await refreshUser();

      // 🚦 Role based navigation
      if (role === "admin") {
        navigate("/admin", { replace: true });
      } else if (role === "student") {
        navigate("/student", { replace: true });
      } else if (role === "parent") {
        navigate("/parent/dashboard", { replace: true });
      } else {
        setError("Invalid user role");
      }

    } catch (err) {
      console.error("LOGIN ERROR:", err);

      setError(
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">School ERP</h1>
          <p className="login-subtitle">Sign in to your account</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleLogin} className="login-form" autoComplete="on">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
              autoComplete="email"
              name="email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
              autoComplete="current-password"
              name="password"
            />
          </div>

          <button type="submit" className="btn-login" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
