import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/layout/DashboardNavbar";
import { useRun } from "../context/RunContext";

function formatDuration(seconds) {
  const totalSeconds = Number(seconds) || 0;

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
    2,
    "0")}`;
}

function formatRunDate(date) {
  if (!date) return "Unknown date";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Unknown date";
  }

  return parsedDate.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatRunTime(date) {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function RunHistory() {
  const navigate = useNavigate();

  const {
    runs,
    verifiedRuns,
    totalDistance,
    currentStreak,
  } = useRun();

  const verifiedRunsList = [...(runs || [])]
    .filter((run) => run.status === "verified")
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime() || 0;
      const dateB = new Date(b.date).getTime() || 0;

      return dateB - dateA;
    });

  return (
    <main className="min-h-screen bg-gray-50">
      <DashboardNavbar />

      <div className="px-6 py-10">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <section className="rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-blue-600 p-8 text-white shadow-lg md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-100">
              FasFas Activity
            </p>

            <h1 className="mt-3 text-4xl font-extrabold md:text-5xl">
              Run History 🏃
            </h1>

            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-emerald-100">
              Every verified run is a step forward. Look back at your
              progress and keep moving. Keep growing. 🌱
            </p>
          </section>

          {/* Summary */}
          <section className="mt-8 grid gap-6 sm:grid-cols-3">

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="text-3xl">🏃</div>

              <p className="mt-4 text-sm font-medium text-gray-500">
                Verified Runs
              </p>

              <p className="mt-1 text-3xl font-bold text-gray-900">
                {verifiedRuns}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="text-3xl">📍</div>

              <p className="mt-4 text-sm font-medium text-gray-500">
                Total Distance
              </p>

              <p className="mt-1 text-3xl font-bold text-gray-900">
                {Number(totalDistance || 0).toFixed(2)} km
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="text-3xl">🔥</div>

              <p className="mt-4 text-sm font-medium text-gray-500">
                Current Streak
              </p>

              <p className="mt-1 text-3xl font-bold text-gray-900">
                {currentStreak}{" "}
                {currentStreak === 1 ? "day" : "days"}
              </p>
            </div>

          </section>

          {/* History */}
          <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm">

            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                  Your Activity
                </p>

                <h2 className="mt-2 text-3xl font-bold text-gray-900">
                  All Verified Runs
                </h2>
              </div>

              <p className="text-sm text-gray-500">
                {verifiedRunsList.length}{" "}
                {verifiedRunsList.length === 1 ? "run" : "runs"} recorded
              </p>
            </div>

            {verifiedRunsList.length === 0 ? (
              <div className="mt-8 rounded-2xl bg-gray-50 p-10 text-center">
                <div className="text-6xl">🏃‍♂️</div>

                <h3 className="mt-5 text-2xl font-bold text-gray-900">
                  Your history is empty
                </h3>

                <p className="mx-auto mt-2 max-w-md leading-relaxed text-gray-600">
                  Complete your first verified run and your activity will
                  appear here.
                </p>

                <button
                  onClick={() => navigate("/run")}
                  className="mt-6 rounded-xl bg-emerald-600 px-7 py-3 font-semibold text-white shadow-md transition hover:bg-emerald-700 active:scale-95"
                >
                  🏃 Start a Run
                </button>
              </div>
            ) : (
              <div className="mt-8 space-y-4">
                {verifiedRunsList.map((run) => (
                  <article
                    key={run.id}
                    className="rounded-2xl border border-gray-100 p-5 transition-shadow hover:shadow-sm"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                      {/* Run identity */}
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-2xl">
                          🏃
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-bold text-gray-900">
                              Run #{run.runNumber}
                            </h3>

                            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                              ✓ Verified
                            </span>
                          </div>

                          <p className="mt-1 text-sm text-gray-500">
                            {formatRunDate(run.date)}
                            {formatRunTime(run.date)
                              ? ` • ${formatRunTime(run.date)}`
                              : ""}
                          </p>
                        </div>
                      </div>

                      {/* Run stats */}
                      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:min-w-[520px]">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Distance
                          </p>

                          <p className="mt-1 font-bold text-gray-900">
                            {Number(run.distance || 0).toFixed(2)} km
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Duration
                          </p>

                          <p className="mt-1 font-bold text-gray-900">
                            {formatDuration(run.duration)}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            GPS Points
                          </p>

                          <p className="mt-1 font-bold text-gray-900">
                            {Number(run.gpsPoints || 0)}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Max Speed
                          </p>

                          <p className="mt-1 font-bold text-gray-900">
                            {Number(run.maxSpeed || 0).toFixed(1)} km/h
                          </p>
                        </div>
                      </div>

                    </div>
                  </article>
                ))}
              </div>
            )}

          </section>

          {/* Back */}
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-xl border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 active:scale-95"
            >
              ← Back to Dashboard
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}

export default RunHistory;
