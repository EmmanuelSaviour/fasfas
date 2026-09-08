import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/layout/DashboardNavbar";
import ConsistencyTree from "../components/ui/ConsistencyTree";
import { useRun } from "../context/RunContext";

import {
  getRank,
  getNextRank,
  getRunsUntilNextRank,
  getRankProgress,
} from "../utils/rankUtils";

function formatDuration(seconds) {
  const totalSeconds = Number(seconds) || 0;

  const hours = Math.floor(totalSeconds / 3600);

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60
  );

  const secs = totalSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(
    secs
  ).padStart(2, "0")}`;
}

function formatRunDate(date) {
  if (!date) {
    return "Unknown date";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Unknown date";
  }

  return parsedDate.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Dashboard() {
  const navigate = useNavigate();

  const {
    runs,
    verifiedRuns,
    totalDistance,
    currentStreak,
  } = useRun();

  /*
   * ================================
   * FasFas Rank
   * ================================
   */

  const currentRank = getRank(verifiedRuns);

  const nextRank = getNextRank(verifiedRuns);

  const runsUntilNextRank =
    getRunsUntilNextRank(verifiedRuns);

  const journeyProgress =
    getRankProgress(verifiedRuns);

  const isPermanent = verifiedRuns >= 30;

  /*
   * ================================
   * Recent Runs
   * ================================
   */

  const recentRuns = [...(runs || [])]
    .sort((a, b) => {
      const dateA =
        new Date(
          a.createdAt || a.date
        ).getTime() || 0;

      const dateB =
        new Date(
          b.createdAt || b.date
        ).getTime() || 0;

      return dateB - dateA;
    })
    .slice(0, 5);

  return (
    <main className="min-h-screen bg-gray-50">

      <DashboardNavbar />

      <div className="px-4 py-6 sm:px-6 sm:py-8 lg:py-10">

        <div className="mx-auto max-w-7xl">

          {/* ================= Welcome ================= */}

          <section className="rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-blue-600 p-6 text-white shadow-lg sm:p-8 md:p-10">

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100 sm:text-sm">
              FasFas Dashboard
            </p>

            <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
              Welcome back, Runner. 🌱
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-emerald-100 sm:text-lg">
              Keep moving, keep growing, and build your
              consistency one verified run at a time.
            </p>

          </section>

          {/* ================= Stats ================= */}

          <section className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">

            {/* Verified Runs */}

            <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">

              <div className="text-3xl">
                🏃
              </div>

              <p className="mt-3 text-sm font-medium text-gray-500 sm:mt-4">
                Verified Runs
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
                {verifiedRuns}
              </p>

            </div>

            {/* Total Distance */}

            <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">

              <div className="text-3xl">
                📍
              </div>

              <p className="mt-3 text-sm font-medium text-gray-500 sm:mt-4">
                Total Distance
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
                {Number(totalDistance || 0).toFixed(2)} km
              </p>

            </div>

            {/* Current Streak */}

            <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">

              <div className="text-3xl">
                🔥
              </div>

              <p className="mt-3 text-sm font-medium text-gray-500 sm:mt-4">
                Current Streak
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
                {currentStreak}{" "}
                {currentStreak === 1
                  ? "day"
                  : "days"}
              </p>

            </div>

            {/* Current Rank */}

            <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">

              <div className="text-3xl">
                🏅
              </div>

              <p className="mt-3 text-sm font-medium text-gray-500 sm:mt-4">
                Current Rank
              </p>

              <p className="mt-1 text-2xl font-bold text-emerald-600 sm:text-3xl">
                {currentRank}
              </p>

            </div>

          </section>

          {/* ================= Main Dashboard ================= */}

          <section className="mt-6 grid gap-6 sm:mt-8 lg:grid-cols-3 lg:gap-8">

            {/* ================= Consistency Tree ================= */}

            <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8 lg:col-span-2">

              <div className="flex items-start justify-between gap-4">

                <div className="min-w-0">

                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 sm:text-sm">
                    Your Progress
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                    Consistency Tree
                  </h2>

                </div>

                <div className="shrink-0 text-4xl sm:text-5xl">
                  🌱
                </div>

              </div>

              <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-600 sm:mt-5 sm:text-base">
                Every verified run helps your tree grow.
                Keep showing up and watch your progress
                take shape.
              </p>

              <div className="mt-6 sm:mt-8">
                <ConsistencyTree
                  verifiedRuns={verifiedRuns}
                />
              </div>

            </div>

            {/* ================= Next Rank ================= */}

            <div className="rounded-3xl bg-emerald-50 p-6 sm:p-8">

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 sm:text-sm">
                {isPermanent
                  ? "FasFas Milestone"
                  : "Next Milestone"}
              </p>

              <h2 className="mt-3 text-xl font-bold text-gray-900 sm:text-2xl">
                {isPermanent
                  ? "Permanently Flourished"
                  : `Become a ${nextRank}`}
              </h2>

              <div className="mt-5 text-5xl sm:mt-6 sm:text-6xl">
                {isPermanent
                  ? "🌳"
                  : "🏃"}
              </div>

              <p className="mt-5 text-sm leading-relaxed text-gray-600 sm:mt-6 sm:text-base">
                {isPermanent
                  ? "You've reached Stubborn, the final FasFas rank. Your Consistency Tree is now permanently flourished and you're part of the FasFas forest."
                  : `Complete your next ${runsUntilNextRank} verified ${
                      runsUntilNextRank === 1
                        ? "run"
                        : "runs"
                    } to progress from ${currentRank} to ${nextRank}.`}
              </p>

              <div className="mt-6">

                <div className="flex justify-between gap-4 text-xs font-medium text-gray-600 sm:text-sm">

                  <span>
                    {isPermanent
                      ? "30+ runs"
                      : `${verifiedRuns} / ${
                          verifiedRuns < 10
                            ? 10
                            : verifiedRuns < 20
                              ? 20
                              : 30
                        } runs`}
                  </span>

                  <span>
                    {Math.round(journeyProgress)}%
                  </span>

                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-emerald-200">

                  <div
                    className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                    style={{
                      width: `${journeyProgress}%`,
                    }}
                  />

                </div>

              </div>

            </div>

          </section>

          {/* ================= Recent Runs ================= */}

          <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm sm:mt-8 sm:p-8">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 sm:text-sm">
                Your Activity
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                Recent Runs
              </h2>

            </div>

            {recentRuns.length === 0 ? (

              <div className="mt-5 rounded-2xl bg-gray-50 p-6 text-center sm:mt-6 sm:p-8">

                <div className="text-4xl sm:text-5xl">
                  🏃‍♂️
                </div>

                <h3 className="mt-4 text-lg font-bold text-gray-900 sm:text-xl">
                  No verified runs yet
                </h3>

                <p className="mt-2 text-sm text-gray-600 sm:text-base">
                  Complete your first verified run and
                  it will appear here.
                </p>

              </div>

            ) : (

              <div className="mt-5 space-y-3 sm:mt-6 sm:space-y-4">

                {recentRuns.map((run) => (

                  <div
                    key={run.id}
                    className="flex flex-col gap-4 rounded-2xl border border-gray-100 p-4 transition-shadow hover:shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5"
                  >

                    <div className="flex items-center gap-3 sm:gap-4">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xl sm:h-12 sm:w-12 sm:text-2xl">
                        🏃
                      </div>

                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-2">

                          <h3 className="font-bold text-gray-900">
                            Run #{run.runNumber}
                          </h3>

                          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                            ✓ Verified
                          </span>

                        </div>

                        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                          {formatRunDate(
                            run.createdAt || run.date
                          )}
                        </p>

                      </div>

                    </div>

                    <div className="flex items-center gap-8 pl-14 text-sm sm:gap-6 sm:pl-0">

                      {/* Distance */}

                      <div>

                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          Distance
                        </p>

                        <p className="mt-1 font-bold text-gray-900">
                          {Number(
                            run.distance || 0
                          ).toFixed(2)} km
                        </p>

                      </div>

                      {/* Duration */}

                      <div>

                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          Duration
                        </p>

                        <p className="mt-1 font-bold text-gray-900">
                          {formatDuration(
                            run.duration
                          )}
                        </p>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </section>

          {/* ================= Start Run ================= */}

          <section className="mt-6 rounded-3xl bg-white p-6 text-center shadow-sm sm:mt-8 sm:p-8">

            <div className="mx-auto max-w-2xl">

              <div className="text-4xl sm:text-5xl">
                🏃‍♂️
              </div>

              <h2 className="mt-4 text-2xl font-bold text-gray-900 sm:mt-5 sm:text-3xl">
                Ready for your next run?
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
                Your verified runs are the foundation of
                your FasFas journey. Lace up and keep
                moving.
              </p>

              <button
                onClick={() => navigate("/run")}
                className="mt-6 rounded-xl bg-emerald-600 px-7 py-3.5 font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-emerald-700 hover:shadow-lg active:scale-95 sm:mt-7 sm:px-8"
              >
                🏃 Start a Run
              </button>

            </div>

          </section>

        </div>

      </div>

    </main>
  );
}

export default Dashboard;