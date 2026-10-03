import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import logo from "../assets/logos/fasfas-logo.png";
import API_URL from "../config/api";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!token) {
      setError(
        "This password reset link is missing or invalid."
      );
      return;
    }

    if (!password) {
      setError("Please enter a new password.");
      return;
    }

    if (password.length < 8) {
      setError("Your new password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to reset your password."
        );
      }

      setMessage(
        data.message ||
          "Your password has been reset successfully."
      );

      setPassword("");
      setConfirmPassword("");
    } catch (resetError) {
      console.error("Reset password error:", resetError);

      setError(
        resetError.message ||
          "Unable to reset your password. Please try again."
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
              Create a new password
            </h1>

            <p className="mt-2 text-gray-600">
              Choose a secure password to continue your FasFas journey.
            </p>

          </div>

          {/* Reset Password Card */}
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl md:p-10">

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Success */}
              {message && (
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                  {message}
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              {/* New Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  New password
                </label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your new password"
                  disabled={loading}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-gray-50"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Confirm new password
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Confirm your new password"
                  disabled={loading}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-gray-50"
                />
              </div>

              {/* Reset Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-emerald-600 px-6 py-3.5 font-semibold text-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:bg-emerald-700 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "🌿 Resetting password..."
                  : "Reset password"}
              </button>

            </form>

            {/* Login */}
            <div className="mt-8 border-t border-gray-100 pt-6 text-center">

              <Link
                to="/login"
                className="font-semibold text-emerald-600 transition hover:text-emerald-700"
              >
                ← Back to login
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

export default ResetPassword;