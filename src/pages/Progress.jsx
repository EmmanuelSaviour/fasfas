import { Link } from "react-router-dom";
import { useRun } from "../context/RunContext";

import {
  getRank,
  getNextRank,
  getRunsUntilNextRank,
  getRankProgress,
} from "../utils/rankUtils";

function Progress() {
  const {
    verifiedRuns,
    totalDistance,
    currentStreak,
  } = useRun();

  const currentRank = getRank(verifiedRuns);

  const nextRank = getNextRank(verifiedRuns);

  const runsUntilNextRank =
    getRunsUntilNextRank(verifiedRuns);

  const rankProgress =
    getRankProgress(verifiedRuns);

  const isPermanent = verifiedRuns >= 30;

  /*
   * Determine the current rank's range.
   */
  const getRankRange = () => {
    if (verifiedRuns >= 30) {
      return "30+ runs";
    }

    if (verifiedRuns >= 20) {
      return "20–29 runs";
    }

    if (verifiedRuns >= 10) {
      return "10–19 runs";
    }

    return "0–9 runs";
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">

      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <section className="rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-blue-600 p-8 text-white shadow-lg md:p-10">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-100">
            FasFas Progress
          </p>

          <h1 className="mt-3 text-4xl font-extrabold md:text-5xl">
            Your Growth Journey 🌱
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-emerald-100">
            Every verified run moves you forward.
            Keep moving. Keep growing.
          </p>

        </section>

        {/* Main Stats */}
        <section className="mt-8 grid gap-6 md:grid-cols-3">

          {/* Runs */}
          <div className="rounded-3xl bg-white p-7 shadow-sm">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
              🏃
            </div>

            <p className="mt-5 text-sm font-medium text-gray-500">
              Verified Runs
            </p>

            <p className="mt-1 text-4xl font-extrabold text-gray-900">
              {verifiedRuns}
            </p>

          </div>

          {/* Distance */}
          <div className="rounded-3xl bg-white p-7 shadow-sm">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
              📍
            </div>

            <p className="mt-5 text-sm font-medium text-gray-500">
              Total Distance
            </p>

            <p className="mt-1 text-4xl font-extrabold text-gray-900">
              {Number(totalDistance || 0).toFixed(2)}
              <span className="ml-1 text-base font-semibold text-gray-500">
                km
              </span>
            </p>

          </div>

          {/* Streak */}
          <div className="rounded-3xl bg-white p-7 shadow-sm">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-2xl">
              🔥
            </div>

            <p className="mt-5 text-sm font-medium text-gray-500">
              Current Streak
            </p>

            <p className="mt-1 text-4xl font-extrabold text-gray-900">
              {currentStreak}
              <span className="ml-1 text-base font-semibold text-gray-500">
                {currentStreak === 1
                  ? "day"
                  : "days"}
              </span>
            </p>

          </div>

        </section>

        {/* Rank Section */}
        <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm md:p-10">

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div>

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Current Rank
              </p>

              <div className="mt-2 flex items-center gap-4">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-4xl">
                  {currentRank === "Stubborn"
                    ? "🏆"
                    : currentRank === "Tracker"
                      ? "🎯"
                      : currentRank === "Runner"
                        ? "🏃"
                        : "🌱"}
                </div>

                <div>

                  <h2 className="text-3xl font-extrabold text-gray-900">
                    {currentRank}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {getRankRange()}
                  </p>

                </div>

              </div>

            </div>

            <div className="text-left md:text-right">

              <p className="text-sm font-medium text-gray-500">
                Verified Runs
              </p>

              <p className="mt-1 text-4xl font-extrabold text-emerald-600">
                {verifiedRuns}
              </p>

            </div>

          </div>

          {/* Rank Progress */}
          <div className="mt-10">

            <div className="flex items-center justify-between text-sm font-semibold text-gray-600">

              <span>
                {isPermanent
                  ? "Stubborn — final rank"
                  : `Progress toward ${nextRank}`}
              </span>

              <span>
                {Math.round(rankProgress)}%
              </span>

            </div>

            <div className="mt-3 h-3 overflow-hidden rounded-full bg-emerald-100">

              <div
                className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                style={{
                  width: `${rankProgress}%`,
                }}
              />

            </div>

            {!isPermanent && (
              <p className="mt-3 text-sm text-gray-500">
                {runsUntilNextRank === 1
                  ? "1 more verified run"
                  : `${runsUntilNextRank} more verified runs`}{" "}
                to reach{" "}
                <span className="font-semibold text-gray-700">
                  {nextRank}
                </span>
                .
              </p>
            )}

            {isPermanent && (
              <p className="mt-3 text-sm font-medium text-emerald-600">
                🌳 You've reached the final FasFas rank.
              </p>
            )}

          </div>

        </section>

        {/* Rank Journey */}
        <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm md:p-10">

          <div>

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              FasFas Journey
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              Grow Through The Ranks
            </h2>

            <p className="mt-3 max-w-2xl text-gray-600">
              Every verified run brings you closer to the
              next stage of your FasFas journey.
            </p>

          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">

            {/* Chaser */}
            <div
              className={`rounded-2xl border p-6 ${
                currentRank === "Chaser"
                  ? "border-emerald-300 bg-emerald-50"
                  : "border-gray-100 bg-gray-50"
              }`}
            >

              <div className="text-4xl">
                🌱
              </div>

              <h3 className="mt-4 text-xl font-bold text-gray-900">
                Chaser
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                0–9 verified runs
              </p>

              {verifiedRuns >= 10 && (
                <p className="mt-3 text-sm font-semibold text-emerald-600">
                  ✓ Completed
                </p>
              )}

            </div>

            {/* Runner */}
            <div
              className={`rounded-2xl border p-6 ${
                currentRank === "Runner"
                  ? "border-emerald-300 bg-emerald-50"
                  : "border-gray-100 bg-gray-50"
              }`}
            >

              <div className="text-4xl">
                🏃
              </div>

              <h3 className="mt-4 text-xl font-bold text-gray-900">
                Runner
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                10–19 verified runs
              </p>

              {verifiedRuns >= 20 && (
                <p className="mt-3 text-sm font-semibold text-emerald-600">
                  ✓ Completed
                </p>
              )}

            </div>

            {/* Tracker */}
            <div
              className={`rounded-2xl border p-6 ${
                currentRank === "Tracker"
                  ? "border-emerald-300 bg-emerald-50"
                  : "border-gray-100 bg-gray-50"
              }`}
            >

              <div className="text-4xl">
                🎯
              </div>

              <h3 className="mt-4 text-xl font-bold text-gray-900">
                Tracker
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                20–29 verified runs
              </p>

              {verifiedRuns >= 30 && (
                <p className="mt-3 text-sm font-semibold text-emerald-600">
                  ✓ Completed
                </p>
              )}

            </div>

            {/* Stubborn */}
            <div
              className={`rounded-2xl border p-6 ${
                currentRank === "Stubborn"
                  ? "border-emerald-300 bg-emerald-50"
                  : "border-gray-100 bg-gray-50"
              }`}
            >

              <div className="text-4xl">
                🏆
              </div>

              <h3 className="mt-4 text-xl font-bold text-gray-900">
                Stubborn
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                30+ verified runs
              </p>

              {verifiedRuns >= 30 && (
                <p className="mt-3 text-sm font-semibold text-emerald-600">
                  ✓ Final Rank
                </p>
              )}

            </div>

          </div>

        </section>

        {/* Back to Dashboard */}
        <div className="mt-10 flex justify-center pb-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center rounded-xl px-5 py-3 text-sm font-semibold text-emerald-700 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-800 active:scale-95"
          >
            ← Back to Dashboard
          </Link>
        </div>

      </div>

    </main>
  );
}

export default Progress;