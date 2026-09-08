function ConsistencyTree({
  verifiedRuns = 0,
  compact = false,
}) {
  const stages = [
    {
      number: 1,
      name: "Seed",
      icon: "🌱",
      description: "Your journey begins.",
    },
    {
      number: 2,
      name: "Sprout",
      icon: "🌿",
      description: "Consistency starts taking root.",
    },
    {
      number: 3,
      name: "Young Tree",
      icon: "🌱",
      description: "Your effort is becoming visible.",
    },
    {
      number: 4,
      name: "Growing",
      icon: "🌳",
      description: "Your consistency is getting stronger.",
    },
    {
      number: 5,
      name: "Flourishing",
      icon: "🌳",
      description: "Your consistency is taking shape.",
    },
  ];

  /*
   * ================================
   * FasFas Rank System
   * ================================
   *
   * 0–9   → Chaser
   * 10–19 → Runner
   * 20–29 → Tracker
   * 30+   → Stubborn
   */

  const getRank = (runs) => {
    if (runs >= 30) return "Stubborn";
    if (runs >= 20) return "Tracker";
    if (runs >= 10) return "Runner";

    return "Chaser";
  };

  const currentRank = getRank(verifiedRuns);

  /*
   * Stubborn is the final rank.
   *
   * Once a member reaches 30 verified runs,
   * their tree becomes permanently flourished.
   */

  const isPermanent = verifiedRuns >= 30;

  /*
   * Each rank has a fresh 10-run tree journey.
   *
   * 0–9   → Chaser journey
   * 10–19 → Runner journey
   * 20–29 → Tracker journey
   * 30+   → Permanent Stubborn tree
   */

  const journeyRuns = isPermanent
    ? 10
    : verifiedRuns % 10;

  /*
   * ================================
   * Determine Tree Stage
   * ================================
   */

  const getStage = (runs) => {
    if (runs >= 8) return 5;
    if (runs >= 6) return 4;
    if (runs >= 4) return 3;
    if (runs >= 2) return 2;

    return 1;
  };

  const currentStage = isPermanent
    ? 5
    : getStage(journeyRuns);

  const currentTree = stages[currentStage - 1];

  const journeyProgress = isPermanent
    ? 100
    : (journeyRuns / 10) * 100;

  /*
   * ================================
   * Rank-Up Celebration
   * ================================
   */

  const hasCompletedJourney =
    verifiedRuns === 10 ||
    verifiedRuns === 20 ||
    verifiedRuns === 30;

  const completedRank =
    verifiedRuns === 10
      ? "Chaser"
      : verifiedRuns === 20
        ? "Runner"
        : verifiedRuns === 30
          ? "Tracker"
          : null;

  const newRank =
    verifiedRuns === 10
      ? "Runner"
      : verifiedRuns === 20
        ? "Tracker"
        : verifiedRuns >= 30
          ? "Stubborn"
          : currentRank;

  return (
    <div className="w-full">

      {/* =====================================
          Compact Community Tree
          ===================================== */}

      {compact && (
        <div className="flex flex-col items-center justify-center rounded-3xl bg-gradient-to-b from-emerald-50 to-white p-6 text-center">

          <div className="text-7xl transition-transform duration-500 hover:scale-110">
            {isPermanent
              ? "🌳"
              : currentTree.icon}
          </div>

          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
            {isPermanent
              ? "Permanent Tree"
              : `${currentRank} Journey`}
          </p>

          <h3 className="mt-1 text-2xl font-bold text-gray-900">
            {isPermanent
              ? "Permanently Flourished"
              : currentTree.name}
          </h3>

          <p className="mt-2 max-w-xs text-sm leading-relaxed text-gray-500">
            {isPermanent
              ? "Your consistency has become part of the FasFas forest."
              : currentTree.description}
          </p>

        </div>
      )}

      {/* =====================================
          Full Personal Tree
          ===================================== */}

      {!compact && (
        <>
          {/* Rank-Up Celebration */}

          {hasCompletedJourney && !isPermanent && (
            <div className="mb-8 rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 p-8 text-center shadow-sm">

              <div className="text-6xl">
                🎉
              </div>

              <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Congratulations!
              </p>

              <h3 className="mt-2 text-3xl font-extrabold text-gray-900">
                You completed your {completedRank} journey!
              </h3>

              <p className="mx-auto mt-4 max-w-xl leading-relaxed text-gray-600">
                Your consistency helped your tree flourish.
                You've earned the next FasFas rank and your next
                journey is ready to begin.
              </p>

              <div className="mt-6 inline-flex items-center gap-3 rounded-2xl bg-emerald-600 px-6 py-3 text-lg font-bold text-white shadow-md">
                🏅 {newRank}
              </div>

              <p className="mt-5 font-medium text-emerald-700">
                🌱 Your new journey starts here.
              </p>

            </div>
          )}

          {/* Permanent Stubborn Tree */}

          {isPermanent && (
            <div className="mb-8 rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 p-8 text-center shadow-sm">

              <div className="text-7xl">
                🌳
              </div>

              <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Stubborn
              </p>

              <h3 className="mt-2 text-3xl font-extrabold text-gray-900">
                Your Tree Has Permanently Flourished
              </h3>

              <p className="mx-auto mt-4 max-w-xl leading-relaxed text-gray-600">
                You've reached Stubborn — the final FasFas rank.
                Your consistency has become part of the FasFas forest.
              </p>

              <div className="mt-6 inline-flex items-center gap-3 rounded-2xl bg-emerald-600 px-6 py-3 text-lg font-bold text-white shadow-md">
                🔥 Stubborn
              </div>

              <p className="mt-5 font-medium text-emerald-700">
                🌳 Your tree will remain permanently flourished.
              </p>

            </div>
          )}

          {/* Tree Display */}

          <div className="flex min-h-[280px] flex-col items-center justify-center rounded-3xl bg-gradient-to-b from-emerald-50 to-white p-8">

            <div className="text-8xl transition-transform duration-500 hover:scale-110">
              {isPermanent
                ? "🌳"
                : currentTree.icon}
            </div>

            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              {isPermanent
                ? "Permanent Tree"
                : `${currentRank} Journey`}
            </p>

            <h3 className="mt-2 text-3xl font-bold text-gray-900">
              {isPermanent
                ? "Permanently Flourished"
                : currentTree.name}
            </h3>

            <p className="mt-2 text-center text-gray-600">
              {isPermanent
                ? "Your consistency has become part of the FasFas forest."
                : currentTree.description}
            </p>

          </div>

          {/* Growth Journey */}

          <div className="mt-8">

            <div className="mb-4 flex items-center justify-between">

              <div>

                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                  {isPermanent
                    ? "Consistency Complete"
                    : "Growth Journey"}
                </p>

                <h3 className="mt-1 text-xl font-bold text-gray-900">
                  {isPermanent
                    ? "Your tree has flourished."
                    : "Watch your tree grow"}
                </h3>

              </div>

              <span className="text-sm font-semibold text-gray-500">
                {isPermanent
                  ? "30+ runs"
                  : `${journeyRuns} / 10 runs`}
              </span>

            </div>

            {/* Progress */}

            <div className="mb-6 h-2 overflow-hidden rounded-full bg-emerald-100">

              <div
                className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                style={{
                  width: `${journeyProgress}%`,
                }}
              />

            </div>

            {/* Stage Cards */}

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">

              {stages.map((stage) => {

                const isCurrent =
                  stage.number === currentStage;

                const isCompleted =
                  stage.number < currentStage;

                return (
                  <div
                    key={stage.number}
                    className={`rounded-2xl border p-4 text-center transition-all duration-300 ${
                      isCurrent
                        ? "border-emerald-300 bg-emerald-50 shadow-sm"
                        : isCompleted
                          ? "border-emerald-100 bg-white"
                          : "border-gray-100 bg-gray-50"
                    }`}
                  >

                    <div
                      className={`text-3xl ${
                        !isCurrent && !isCompleted
                          ? "grayscale opacity-50"
                          : ""
                      }`}
                    >
                      {stage.icon}
                    </div>

                    <p
                      className={`mt-2 text-sm font-semibold ${
                        isCurrent
                          ? "text-emerald-700"
                          : "text-gray-600"
                      }`}
                    >
                      {stage.name}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Stage {stage.number}
                    </p>

                  </div>
                );
              })}

            </div>

          </div>
        </>
      )}

    </div>
  );
}

export default ConsistencyTree;