import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Email and password are required");
      return;
    }
    try {
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="glass-panel shadow-soft rounded-3xl p-10 w-full max-w-md">
        <h1 className="font-display text-3xl mb-2">Welcome back</h1>
        <p className="text-sm text-ink/60 mb-6">Sign in to manage your folders.</p>
        {error && <p className="text-sm text-coral mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full border rounded-xl px-3 py-2"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
          <input
            className="w-full border rounded-xl px-3 py-2"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
          />
          <button className="w-full py-2 rounded-xl bg-ink text-white">Login</button>
        </form>
        <p className="text-sm text-ink/60 mt-4">
          New here? <Link to="/register" className="text-ink">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
