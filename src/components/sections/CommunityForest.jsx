import SectionTitle from "../ui/SectionTitle";
import ConsistencyTree from "../ui/ConsistencyTree";
import { useEffect, useState } from "react";

function CommunityForest() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const response = await fetch("/api/community");
        const data = await response.json();

        if (response.ok && data.success) {
          // Show a maximum of 6 real community members
          setUsers((data.users || []).slice(0, 6));
        }
      } catch (error) {
        console.error("HOMEPAGE COMMUNITY ERROR:", error);
      }
    };

    fetchCommunity();
  }, []);

  return (
    <section className="bg-gradient-to-b from-emerald-50 to-white px-4 py-14 sm:px-6 sm:py-16 md:py-20">
      <div className="mx-auto max-w-7xl">

        {/* ================= Section Title ================= */}

        <SectionTitle
          title="Every Tree Tells a Story"
          subtitle="Every member starts as a Chaser. Through consistency, their tree grows—and so does our forest."
        />

        {/* ================= Community Trees ================= */}

        {users.length > 0 ? (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:mt-12 sm:gap-6 md:grid-cols-3 md:gap-8">

            {users.map((user) => (
              <div
                key={user.id}
                className="rounded-2xl bg-white p-4 text-center shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl sm:p-6 md:p-8"
              >

                {/* Real Consistency Tree */}

                <div className="mb-3 flex justify-center sm:mb-4">
                  <ConsistencyTree
                    verifiedRuns={user.verifiedRuns}
                    compact={true}
                  />
                </div>

                {/* Runner Information */}

                <div>
                  <h3 className="text-base font-bold sm:text-lg md:text-xl">
                    {user.name}
                  </h3>

                  <p className="mt-1 text-sm font-medium text-emerald-600 sm:mt-2 sm:text-base">
                    {user.rank}
                  </p>
                </div>

              </div>
            ))}

          </div>
        ) : (
          /* ================= Empty Forest ================= */

          <div className="mt-10 rounded-2xl bg-white p-8 text-center shadow-md sm:mt-12 sm:p-12">
            <div className="text-5xl sm:text-6xl">
              🌱
            </div>

            <h3 className="mt-4 text-lg font-bold text-gray-900 sm:text-xl">
              The forest is just beginning.
            </h3>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Be one of the first runners to plant a tree.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}

export default CommunityForest;