import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ConsistencyTree from "../components/ui/ConsistencyTree";

function CommunityForest() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const response = await fetch("/api/community");
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load Community Forest."
          );
        }

        setUsers(data.users || []);
      } catch (err) {
        console.error("COMMUNITY FOREST ERROR:", err);
        setError(
          err.message || "Unable to load Community Forest."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCommunity();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link
            to="/community"
            className="text-sm font-semibold text-emerald-600 transition hover:text-emerald-700"
          >
            ← Back to Community
          </Link>

          <Link
            to="/"
            className="text-xl font-bold text-emerald-600"
          >
            FasFas
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 pb-10 pt-14 text-center">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            FasFas Community
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Community Forest
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
            Every runner has a tree. Every tree tells a story.
            See the FasFas community grow together.
          </p>
        </div>
      </section>

      {/* Forest */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        {loading && (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <p className="text-gray-500">
              Growing the forest...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <p className="font-semibold text-red-600">
              {error}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Please try refreshing the page.
            </p>
          </div>
        )}

        {!loading && !error && users.length === 0 && (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <div className="text-5xl">🌱</div>

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              The forest is waiting.
            </h2>

            <p className="mt-2 text-gray-500">
              Be one of the first runners to plant a tree.
            </p>
          </div>
        )}

        {!loading && !error && users.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Consistency Tree */}
                <ConsistencyTree
                  verifiedRuns={user.verifiedRuns}
                  compact={true}
                />

                {/* Runner Information */}
                <div className="border-t border-gray-100 px-6 py-5">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="truncate text-lg font-bold text-gray-900">
                      {user.name}
                    </h2>

                    <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {user.rank}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-gray-50 p-3 text-center">
                      <p className="text-lg font-bold text-gray-900">
                        {user.verifiedRuns}
                      </p>

                      <p className="text-xs text-gray-500">
                        Verified Runs
                      </p>
                    </div>

                    <div className="rounded-2xl bg-gray-50 p-3 text-center">
                      <p className="text-lg font-bold text-gray-900">
                        {user.totalDistance}
                      </p>

                      <p className="text-xs text-gray-500">
                        Kilometers
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default CommunityForest;