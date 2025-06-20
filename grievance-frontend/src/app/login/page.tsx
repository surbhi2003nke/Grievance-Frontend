"use client";
import { useState } from "react";

export default function LoginPage() {
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNo, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      // Store JWT token (localStorage or cookie)
      localStorage.setItem("token", data.token);
      document.cookie = `token=${data.token}; path=/;`;
      // Redirect or update UI as needed
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && (
          <div className="mb-4 text-red-600 text-sm text-center">{error}</div>
        )}
        <div className="mb-4">
          <label className="block mb-1 font-medium" htmlFor="rollNo">
            Roll Number
          </label>
          <input
            id="rollNo"
            type="text"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Enter your roll number"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Enter your password"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
