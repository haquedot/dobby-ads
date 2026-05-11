import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="glass-panel shadow-soft rounded-3xl p-10 w-full max-w-md">
        <h1 className="font-display text-3xl mb-2">Create account</h1>
        <p className="text-sm text-ink/60 mb-6">Start organizing your assets.</p>
        {error && <p className="text-sm text-coral mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full border rounded-xl px-3 py-2"
            placeholder="Name"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
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
          <button className="w-full py-2 rounded-xl bg-ink text-white">Register</button>
        </form>
        <p className="text-sm text-ink/60 mt-4">
          Already have an account? <Link to="/login" className="text-ink">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
