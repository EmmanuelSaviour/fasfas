import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logos/fasfas-logo.png";

function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please create a password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to create user."
        );
      }

      /*
       * Store the authenticated user.
       */
      login(data.user);

      navigate("/dashboard");
    } catch (registerError) {
      console.error("Registration error:", registerError);

      setError(
        registerError.message ||
          "Unable to create user."
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
              Start your journey
            </h1>

            <p className="mt-2 text-gray-600">
              Plant your tree and start growing.
            </p>

          </div>

          {/* Register Card */}
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl md:p-10">

            <form
              className="space-y-5"
              onSubmit={handleRegister}
            >

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Full name
                </label>

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Your full name"
                  disabled={loading}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-gray-50"
                />
              </div>

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
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-gray-50"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Create a password"
                  disabled={loading}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-gray-50"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Confirm password
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Confirm your password"
                  disabled={loading}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-gray-50"
                />
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-emerald-600 px-6 py-3.5 font-semibold text-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:bg-emerald-700 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "🌱 Planting your tree..."
                  : "🌱 Plant Your Tree"}
              </button>

            </form>

            {/* Login */}
            <div className="mt-8 border-t border-gray-100 pt-6 text-center">

              <p className="text-sm text-gray-600">
                Already have a FasFas account?
              </p>

              <Link
                to="/login"
                className="mt-2 inline-block font-semibold text-emerald-600 transition hover:text-emerald-700"
              >
                Continue growing →
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

export default Register;