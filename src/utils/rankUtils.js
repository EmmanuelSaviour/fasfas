/*
 * ==========================================
 * FasFas Rank System
 * ==========================================
 *
 * All rank calculations should use these
 * functions so Dashboard, Progress, Runs,
 * and future features stay synchronized.
 */

export const FASFAS_RANKS = [
  {
    name: "Chaser",
    minRuns: 0,
    maxRuns: 9,
    nextRuns: 10,
  },
  {
    name: "Runner",
    minRuns: 10,
    maxRuns: 19,
    nextRuns: 20,
  },
  {
    name: "Tracker",
    minRuns: 20,
    maxRuns: 29,
    nextRuns: 30,
  },
  {
    name: "Stubborn",
    minRuns: 30,
    maxRuns: Infinity,
    nextRuns: null,
  },
];

/*
 * Get the current rank from verified run count.
 */
export function getRank(runCount = 0) {
  const count = Math.max(
    0,
    Number(runCount) || 0
  );

  if (count >= 30) {
    return "Stubborn";
  }

  if (count >= 20) {
    return "Tracker";
  }

  if (count >= 10) {
    return "Runner";
  }

  return "Chaser";
}

/*
 * Get the complete rank object.
 */
export function getRankInfo(runCount = 0) {
  const count = Math.max(
    0,
    Number(runCount) || 0
  );

  if (count >= 30) {
    return FASFAS_RANKS[3];
  }

  if (count >= 20) {
    return FASFAS_RANKS[2];
  }

  if (count >= 10) {
    return FASFAS_RANKS[1];
  }

  return FASFAS_RANKS[0];
}

/*
 * Get the next rank.
 */
export function getNextRank(runCount = 0) {
  const count = Math.max(
    0,
    Number(runCount) || 0
  );

  if (count < 10) {
    return "Runner";
  }

  if (count < 20) {
    return "Tracker";
  }

  if (count < 30) {
    return "Stubborn";
  }

  return null;
}

/*
 * Get the number of runs required to reach
 * the next rank.
 */
export function getRunsUntilNextRank(
  runCount = 0
) {
  const count = Math.max(
    0,
    Number(runCount) || 0
  );

  if (count < 10) {
    return 10 - count;
  }

  if (count < 20) {
    return 20 - count;
  }

  if (count < 30) {
    return 30 - count;
  }

  return 0;
}

/*
 * Get progress through the current rank.
 *
 * Example:
 * Chaser with 5 runs = 50%
 * Runner with 15 runs = 50%
 * Tracker with 25 runs = 50%
 * Stubborn = 100%
 */
export function getRankProgress(runCount = 0) {
  const count = Math.max(
    0,
    Number(runCount) || 0
  );

  if (count >= 30) {
    return 100;
  }

  if (count < 10) {
    return (count / 10) * 100;
  }

  if (count < 20) {
    return ((count - 10) / 10) * 100;
  }

  return ((count - 20) / 10) * 100;
}

/*
 * Get a complete progress summary.
 */
export function getRankProgressInfo(
  runCount = 0
) {
  const count = Math.max(
    0,
    Number(runCount) || 0
  );

  const currentRank = getRank(count);
  const nextRank = getNextRank(count);
  const runsUntilNextRank =
    getRunsUntilNextRank(count);
  const progress = getRankProgress(count);

  return {
    currentRank,
    nextRank,
    runsUntilNextRank,
    progress,
    isPermanent: count >= 30,
  };
}