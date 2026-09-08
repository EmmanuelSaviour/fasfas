import { Link } from "react-router-dom";
import { useRun } from "../context/RunContext";

function Runs() {
  const {
    runs,
    verifiedRuns,
    totalDistance,
    currentStreak,
    loading,
    error,
    refreshRuns,
  } = useRun();

  const formatTime = (totalSeconds) => {
    const secondsValue = Number(totalSeconds) || 0;

    const hours = Math.floor(secondsValue / 3600);

    const minutes = Math.floor(
      (secondsValue % 3600) / 60
    );

    const seconds = secondsValue % 60;

    return [
      hours,
      minutes,
      seconds,
    ]
      .map((value) =>
        String(value).padStart(2, "0")
      )
      .join(":");
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Unknown date";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Unknown date";
    }

    return date.toLocaleDateString(
      "en-NG",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatDateTime = (dateValue) => {
    if (!dateValue) {
      return "";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleString(
      "en-NG",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }
    );
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">

      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <section className="rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-blue-600 p-8 text-white shadow-lg md:p-10">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-100">
            FasFas Activity
          </p>

          <h1 className="mt-3 text-4xl font-extrabold md:text-5xl">
            Your Runs 🏃
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-emerald-100">
            Every verified run is another step in your
            FasFas consistency journey.
          </p>

        </section>

        {/* Summary */}
        <section className="mt-8 grid gap-4 sm:grid-cols-3">

          {/* Verified Runs */}
          <div className="rounded-3xl bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Verified Runs
                </p>

                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {verifiedRuns}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
                🏃
              </div>

            </div>

          </div>

          {/* Total Distance */}
          <div className="rounded-3xl bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Distance
                </p>

                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {totalDistance.toFixed(2)}
                  <span className="ml-1 text-base font-semibold text-gray-500">
                    km
                  </span>
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                📍
              </div>

            </div>

          </div>

          {/* Current Streak */}
          <div className="rounded-3xl bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Current Streak
                </p>

                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {currentStreak}
                  <span className="ml-1 text-base font-semibold text-gray-500">
                    {currentStreak === 1
                      ? "day"
                      : "days"}
                  </span>
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-2xl">
                🔥
              </div>

            </div>

          </div>

        </section>

        {/* Error */}
        {error && (
          <section className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-5">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="font-semibold text-red-800">
                  Unable to load your runs
                </p>

                <p className="mt-1 text-sm text-red-700">
                  {error}
                </p>
              </div>

              <button
                type="button"
                onClick={refreshRuns}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Try Again
              </button>

            </div>

          </section>
        )}

        {/* Run History */}
        <section className="mt-8">

          <div className="mb-5">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Run History
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

              <div>
                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  Your verified activity
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Stored securely with your FasFas account.
                </p>
              </div>

              <button
                type="button"
                onClick={refreshRuns}
                disabled={loading}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-emerald-200 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Refreshing..."
                  : "↻ Refresh"}
              </button>

            </div>

          </div>

          {/* Loading */}
          {loading && runs.length === 0 && (
            <div className="rounded-3xl bg-white p-10 text-center shadow-sm">

              <div className="text-5xl">
                🏃
              </div>

              <h3 className="mt-4 text-xl font-bold text-gray-900">
                Loading your runs...
              </h3>

              <p className="mt-2 text-gray-500">
                Retrieving your activity from PostgreSQL.
              </p>

            </div>
          )}

          {/* Empty State */}
          {!loading && runs.length === 0 && (
            <div className="rounded-3xl bg-white p-10 text-center shadow-sm">

              <div className="text-6xl">
                🏃‍♂️
              </div>

              <h3 className="mt-5 text-2xl font-bold text-gray-900">
                No runs yet
              </h3>

              <p className="mx-auto mt-3 max-w-md leading-relaxed text-gray-600">
                Your verified runs will appear here once
                you complete your first FasFas run.
              </p>

            </div>
          )}

          {/* Runs */}
          {runs.length > 0 && (
            <div className="space-y-4">

              {runs.map((run) => (

                <div
                  key={run.id}
                  className="rounded-3xl bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md"
                >

                  <div className="flex flex-col gap-6">

                    {/* Top */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                      <div>

                        <div className="flex flex-wrap items-center gap-3">

                          <h3 className="text-xl font-bold text-gray-900">
                            Run #{run.runNumber}
                          </h3>

                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                            ✓ {run.status || "Verified"}
                          </span>

                        </div>

                        <p className="mt-2 text-sm text-gray-500">
                          {formatDate(
                            run.createdAt || run.date
                          )}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {formatDateTime(
                            run.createdAt || run.date
                          )}
                        </p>

                      </div>

                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

                      {/* Distance */}
                      <div className="rounded-2xl bg-gray-50 p-4">

                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          Distance
                        </p>

                        <p className="mt-1 text-lg font-bold text-gray-900">
                          {Number(run.distance || 0).toFixed(2)}
                          <span className="ml-1 text-sm font-semibold text-gray-500">
                            km
                          </span>
                        </p>

                      </div>

                      {/* Duration */}
                      <div className="rounded-2xl bg-gray-50 p-4">

                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          Duration
                        </p>

                        <p className="mt-1 text-lg font-bold text-gray-900">
                          {formatTime(run.duration)}
                        </p>

                      </div>

                      {/* GPS Points */}
                      <div className="rounded-2xl bg-gray-50 p-4">

                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          GPS Points
                        </p>

                        <p className="mt-1 text-lg font-bold text-gray-900">
                          {Number(run.gpsPoints || 0)}
                        </p>

                      </div>

                      {/* Max Speed */}
                      <div className="rounded-2xl bg-gray-50 p-4">

                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          Max Speed
                        </p>

                        <p className="mt-1 text-lg font-bold text-gray-900">
                          {Number(run.maxSpeed || 0).toFixed(1)}
                          <span className="ml-1 text-sm font-semibold text-gray-500">
                            km/h
                          </span>
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

              ))}

            </div>
          )}

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

export default Runs;