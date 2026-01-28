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

      const { token, role, student_id, user_id } = res.data;

      if (!token || !role) {
        throw new Error("Invalid login response from server");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      if (user_id) localStorage.setItem("user_id", user_id);
      if (student_id) localStorage.setItem("student_id", student_id);

      // Update auth context from token so ProtectedRoute sees user immediately
      await refreshUser();

      if (role === "admin") navigate("/admin", { replace: true });
      else if (role === "student") navigate("/student", { replace: true });
      else setError("Invalid user role");
    } catch (err) {
      console.error("LOGIN ERROR:", err);

      if (err.response?.status === 404) {
        setError("Login API not found (404)");
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Login failed. Please try again."
        );
      }
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

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <button
            type="submit"
            className="btn-login"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
