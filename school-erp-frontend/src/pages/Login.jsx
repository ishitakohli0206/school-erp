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

      
      const { token, role_id, student_id, user_id, name } = res.data;

    
      if (!token || !role_id) {
        throw new Error("Invalid login response from server");
      }

      //  STORE TOKEN
      localStorage.setItem("token", token);
      
      localStorage.setItem("role", role_id === 1 ? "admin" : role_id === 4 ? "teacher" : "student");
      
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: user_id,
          name,
          role_id,
        })
      );

      //  Only student gets student_id
      if (student_id) {
        localStorage.setItem("student_id", student_id);
      }

      //  REFRESH AUTH CONTEXT
      await refreshUser();

      //  ROLE_ID BASED NAVIGATION
      if (role_id === 1) {
        navigate("/admin", { replace: true });
      } else if (role_id === 2) {
        navigate("/student", { replace: true });
      } else if (role_id === 3) {
        navigate("/parent/dashboard", { replace: true });
      } else if (role_id === 4) {
        navigate("/teacher/dashboard", { replace: true });
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