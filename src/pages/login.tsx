import Button from "../components/button";
import Input from "../components/input";
import Password from "../components/password";
import { FaUser, FaLock } from "react-icons/fa";
import img from "../assets/Logo Unand.png";
import "../index.css";
import "../styles/login.css";
import { useState } from "react";
import { AuthService } from "../services/auth.service";
import { useNavigate } from "react-router-dom"; 

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

      const response = await AuthService.login(username, password);

      console.log("Login berhasil:", response);

      const userData = AuthService.getUserData();
      
      
      if (userData?.role === "kadep") {
        navigate("/home");
      } else if (userData?.role === "dosen") {
        navigate("/home");
      } else {
        navigate("/home");
      }
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
      <div className="content">
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