import Button from "../components/button";
import Input from "../components/input";
import Password from "../components/password";
import { FaUser, FaLock } from "react-icons/fa";
import img from "../assets/Logo Unand.png";
import "../index.css";
import "../styles/login.css";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {

      if (!username || !password) {
        setError("Username dan password harus diisi");
        setLoading(false);
        return;
      }

      await login(username, password);

      // After login, user should be available from context
      // Navigate based on role (or just go to home)
      navigate("/home");
    } catch (err: any) {

      console.error("Login error:", err);

      if (err.response?.status === 401) {
        setError("Username atau password salah");
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Terjadi kesalahan. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="login-content">
        <div>
          <img src={img} alt="Logo Unand" width={200} />
        </div>
        <form className="input" onSubmit={handleSubmit}>
          <Input
            placeholder="Username"
            icon={<FaUser />}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
          <Password
            placeholder="Password"
            icon={<FaLock />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="pt-2">
            <Button type="submit" disabled={loading}>
              {loading ? "LOADING..." : "LOGIN"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}