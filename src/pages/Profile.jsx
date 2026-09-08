import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/layout/DashboardNavbar";
import { useAuth } from "../context/AuthContext";
import { useRun } from "../context/RunContext";
import { getRank } from "../utils/rankUtils";

function Profile() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const {
    verifiedRuns,
    totalDistance,
    currentStreak,
  } = useRun();

  const currentRank = getRank(verifiedRuns);

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
                👤
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