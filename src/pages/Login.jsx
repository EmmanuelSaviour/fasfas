import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logos/fasfas-logo.png";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      await login(
        email.trim().toLowerCase(),
        password
      );

      navigate("/dashboard");
    } catch (loginError) {
      console.error("Login error:", loginError);

      setError(
        loginError.message ||
          "Unable to log in. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 px-6 py-12">

      <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center">

        <div className="w-full">

          {/* Brand */}
          <div className="mb-8 text-center">

            <Link
              to="/"
              className="inline-flex items-center justify-center"
            >
              <img
                src={logo}
                alt="FasFas Logo"
                className="h-20 w-auto object-contain"
              />
            </Link>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
              Welcome back
            </h1>

            <p className="mt-2 text-gray-600">
              Keep moving. Keep growing.
            </p>

          </div>

          {/* Login Card */}
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl md:p-10">

            <form
              className="space-y-5"
              onSubmit={handleLogin}
            >

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="you@example.com"
                  disabled={loading}
                  autoComplete="email"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-gray-50"
                />
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">

                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                  >
                    Forgot password?
                  </button>

                </div>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  disabled={loading}
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-gray-50"
                />
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-emerald-600 px-6 py-3.5 font-semibold text-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:bg-emerald-700 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "🌿 Checking your account..."
                  : "🌿 Continue Growing"}
              </button>

            </form>

            {/* Register */}
            <div className="mt-8 border-t border-gray-100 pt-6 text-center">

              <p className="text-sm text-gray-600">
                Don't have a FasFas account?
              </p>

              <Link
                to="/register"
                className="mt-2 inline-block font-semibold text-emerald-600 transition hover:text-emerald-700"
              >
                Plant your tree →
              </Link>

            </div>

          </div>

          {/* Back Home */}
          <div className="mt-6 text-center">

            <Link
              to="/"
              className="text-sm font-medium text-gray-500 transition hover:text-emerald-600"
            >
              ← Back to FasFas
            </Link>

          </div>

        </div>

      </div>

    </main>
  );
}

export default Login;