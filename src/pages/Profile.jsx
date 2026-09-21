import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/layout/DashboardNavbar";
import { useAuth } from "../context/AuthContext";
import { useRun } from "../context/RunContext";
import { getRank } from "../utils/rankUtils";

const AVATAR_OPTIONS = [
  { id: "runner", emoji: "🏃", label: "Runner" },
  { id: "runner-light", emoji: "🏃‍♀️", label: "Runner" },
  { id: "runner-dark", emoji: "🏃‍♂️", label: "Runner" },
  { id: "person", emoji: "🧑", label: "Classic" },
  { id: "person-beard", emoji: "🧔", label: "Classic" },
  { id: "fire", emoji: "🔥", label: "Fire" },
  { id: "lightning", emoji: "⚡", label: "Energy" },
  { id: "tree", emoji: "🌳", label: "Tree" },
];

function Profile() {
  const navigate = useNavigate();

  const { user, logout, updateProfile } = useAuth();

  const {
    verifiedRuns,
    totalDistance,
    currentStreak,
  } = useRun();

  const currentRank = getRank(verifiedRuns);

  // ================= Customization State =================

  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("runner");
  const [communityVisible, setCommunityVisible] = useState(true);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Load current profile information
  useEffect(() => {
    if (!user) return;

    setName(user.name || "");
    setAvatar(user.avatar || "runner");
    setCommunityVisible(user.communityVisible ?? true);
  }, [user]);

  const selectedAvatar =
    AVATAR_OPTIONS.find((option) => option.id === avatar)?.emoji || "🏃";

  // ================= Save Profile =================

  const handleSaveProfile = async () => {
    setMessage("");
    setError("");

    if (!name.trim()) {
      setError("Your name cannot be empty.");
      return;
    }

    try {
      setSaving(true);

      await updateProfile({
        name: name.trim(),
        avatar,
        communityVisible,
      });

      setMessage("Profile saved successfully.");
    } catch (err) {
      setError(err.message || "Unable to save your profile.");
    } finally {
      setSaving(false);
    }
  };

  // ================= Logout =================

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <main className="min-h-screen bg-gray-50">

      <DashboardNavbar />

      <div className="px-4 py-6 sm:px-6 sm:py-8 lg:py-10">

        <div className="mx-auto max-w-6xl">

          {/* ================= Profile Header ================= */}

          <section className="rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-blue-600 p-6 text-white shadow-lg sm:p-8 md:p-10">

            <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left">

              {/* Avatar */}

              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-white/20 text-5xl shadow-inner backdrop-blur-sm sm:h-28 sm:w-28 sm:text-6xl">
                {selectedAvatar}
              </div>

              {/* User Information */}

              <div className="mt-5 sm:ml-6 sm:mt-0">

                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100 sm:text-sm">
                  FasFas Runner
                </p>

                <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
                  {user?.name || "Runner"}
                </h1>

                <p className="mt-2 text-emerald-100">
                  {currentRank} 🌱
                </p>

              </div>

            </div>

          </section>

          {/* ================= Running Statistics ================= */}

          <section className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-3 sm:gap-6">

            {/* Verified Runs */}

            <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
                🏃
              </div>

              <p className="mt-4 text-sm font-medium text-gray-500">
                Verified Runs
              </p>

              <p className="mt-1 text-3xl font-extrabold text-gray-900">
                {verifiedRuns}
              </p>

            </div>

            {/* Distance */}

            <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                📍
              </div>

              <p className="mt-4 text-sm font-medium text-gray-500">
                Total Distance
              </p>

              <p className="mt-1 text-3xl font-extrabold text-gray-900">
                {Number(totalDistance || 0).toFixed(2)}
                <span className="ml-1 text-base font-semibold text-gray-500">
                  km
                </span>
              </p>

            </div>

            {/* Streak */}

            <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-2xl">
                🔥
              </div>

              <p className="mt-4 text-sm font-medium text-gray-500">
                Current Streak
              </p>

              <p className="mt-1 text-3xl font-extrabold text-gray-900">
                {currentStreak}
                <span className="ml-1 text-base font-semibold text-gray-500">
                  {currentStreak === 1 ? "day" : "days"}
                </span>
              </p>

            </div>

          </section>

          {/* ================= Customize Profile ================= */}

          <section className="mt-6 sm:mt-8">

            <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 sm:text-sm">
                Personalize
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                Customize Your Profile
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">
                Make your FasFas profile yours. Your customization does not
                affect your runs, rank, streak, or Consistency Tree.
              </p>

              {/* Display Name */}

              <div className="mt-7">

                <label
                  htmlFor="profile-name"
                  className="text-sm font-semibold text-gray-800"
                >
                  Display Name
                </label>

                <input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  maxLength={60}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  placeholder="Enter your name"
                />

              </div>

              {/* Avatar */}

              <div className="mt-7">

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Choose Your Avatar
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Pick an avatar that represents you.
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-8">

                  {AVATAR_OPTIONS.map((option) => {
                    const isSelected = avatar === option.id;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setAvatar(option.id)}
                        aria-label={`Select ${option.label} avatar`}
                        className={`flex aspect-square items-center justify-center rounded-2xl border-2 text-3xl transition-all duration-200 sm:text-4xl ${
                          isSelected
                            ? "scale-[1.03] border-emerald-500 bg-emerald-50 shadow-sm"
                            : "border-gray-100 bg-gray-50 hover:border-emerald-200 hover:bg-emerald-50/50"
                        }`}
                      >
                        {option.emoji}
                      </button>
                    );
                  })}

                </div>

              </div>

              {/* Community Visibility */}

              <div className="mt-7 rounded-2xl border border-gray-100 bg-gray-50 p-4 sm:p-5">

                <div className="flex items-start justify-between gap-4">

                  <div className="min-w-0">

                    <p className="font-semibold text-gray-900">
                      Show Me in Community Forest
                    </p>

                    <p className="mt-1 text-sm leading-relaxed text-gray-500">
                      Show your name, rank, and tree in the public Community
                      Forest.
                    </p>

                  </div>

                  {/* Toggle */}

                  <button
                    type="button"
                    onClick={() =>
                      setCommunityVisible((current) => !current)
                    }
                    aria-label={
                      communityVisible
                        ? "Hide profile from Community Forest"
                        : "Show profile in Community Forest"
                    }
                    aria-pressed={communityVisible}
                    className={`relative mt-1 h-7 w-12 shrink-0 rounded-full transition-colors duration-200 ${
                      communityVisible
                        ? "bg-emerald-600"
                        : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        communityVisible
                          ? "translate-x-5"
                          : "translate-x-0"
                      }`}
                    />
                  </button>

                </div>

              </div>

              {/* Save Feedback */}

              {message && (
                <div className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                  ✓ {message}
                </div>
              )}

              {error && (
                <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              {/* Save Button */}

              <div className="mt-6 flex justify-end">

                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="w-full rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {saving ? "Saving..." : "Save Profile"}
                </button>

              </div>

            </div>

          </section>

          {/* ================= Account Information ================= */}

          <section className="mt-6 sm:mt-8">

            <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 sm:text-sm">
                Account
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                Account Information
              </h2>

              <div className="mt-6 divide-y divide-gray-100">

                {/* Name */}

                <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">

                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Full Name
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {user?.name || "Not available"}
                    </p>
                  </div>

                  <span className="text-xl">
                    👤
                  </span>

                </div>

                {/* Email */}

                <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">

                  <div className="min-w-0">

                    <p className="text-sm font-medium text-gray-500">
                      Email Address
                    </p>

                    <p className="mt-1 break-all font-semibold text-gray-900">
                      {user?.email || "Not available"}
                    </p>

                  </div>

                  <span className="text-xl">
                    📧
                  </span>

                </div>

                {/* Rank */}

                <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">

                  <div>

                    <p className="text-sm font-medium text-gray-500">
                      FasFas Rank
                    </p>

                    <p className="mt-1 font-semibold text-emerald-600">
                      {currentRank}
                    </p>

                  </div>

                  <span className="text-xl">
                    🏅
                  </span>

                </div>

              </div>

            </div>

          </section>

          {/* ================= Back to Dashboard ================= */}

          <div className="mt-8 flex justify-center">

            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-xl px-5 py-3 text-sm font-semibold text-emerald-700 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-800 active:scale-95"
            >
              ← Back to Dashboard
            </button>

          </div>

          {/* ================= Logout ================= */}

          <section className="mt-6 rounded-3xl bg-white p-6 text-center shadow-sm sm:mt-8 sm:p-8">

            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Ready to step away?
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-600 sm:text-base">
              You can safely log out of your FasFas account.
            </p>

            <button
              onClick={handleLogout}
              className="mt-5 rounded-xl bg-red-50 px-6 py-3 font-semibold text-red-600 transition-all duration-300 hover:bg-red-100 active:scale-95"
            >
              🚪 Log Out
            </button>

          </section>

        </div>

      </div>

    </main>
  );
}

export default Profile;