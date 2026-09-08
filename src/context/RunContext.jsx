import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "./AuthContext";

const RunContext = createContext();

const API_URL = "";

/*
 * Convert a run timestamp into a local calendar-day key.
 * FasFas streaks are based on the user's local calendar day.
 */
function getLocalDayKey(dateValue) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/*
 * Calculate the difference between two calendar days.
 */
function getDayDifference(
  firstKey,
  secondKey
) {
  const first = new Date(
    `${firstKey}T00:00:00`
  );

  const second = new Date(
    `${secondKey}T00:00:00`
  );

  return Math.round(
    (first.getTime() - second.getTime()) /
      (1000 * 60 * 60 * 24)
  );
}

/*
 * Calculate the current FasFas streak.
 */
function calculateCurrentStreak(
  runHistory
) {
  const uniqueDays = [
    ...new Set(
      runHistory
        .filter(
          (run) =>
            run.status === "verified"
        )
        .map((run) =>
          getLocalDayKey(
            run.date ||
              run.createdAt
          )
        )
        .filter(Boolean)
    ),
  ].sort((a, b) =>
    b.localeCompare(a)
  );

  if (uniqueDays.length === 0) {
    return 0;
  }

  const todayKey =
    getLocalDayKey(new Date());

  const latestRunDay =
    uniqueDays[0];

  /*
   * A streak remains alive through the day
   * after the most recent verified run.
   */
  const latestDayAge =
    getDayDifference(
      todayKey,
      latestRunDay
    );

  if (
    latestDayAge < 0 ||
    latestDayAge > 1
  ) {
    return 0;
  }

  let streak = 1;

  for (
    let index = 1;
    index < uniqueDays.length;
    index += 1
  ) {
    const previousDay =
      uniqueDays[index - 1];

    const currentDay =
      uniqueDays[index];

    if (
      getDayDifference(
        previousDay,
        currentDay
      ) !== 1
    ) {
      break;
    }

    streak += 1;
  }

  return streak;
}

export function RunProvider({
  children,
}) {
  const {
    user,
    isAuthenticated,
  } = useAuth();

  const [runs, setRuns] = useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  /*
   * ================================
   * Load Runs From PostgreSQL
   * ================================
   */

  useEffect(() => {
    let cancelled = false;

    async function loadRuns() {
      /*
       * No logged-in user means there
       * are no runs to load.
       */
      if (
        !isAuthenticated ||
        !user?.id
      ) {
        setRuns([]);
        setError("");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await fetch(
            `${API_URL}/api/users/${user.id}/runs`
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Unable to retrieve your runs."
          );
        }

        if (!cancelled) {
          setRuns(
            Array.isArray(data.runs)
              ? data.runs
              : []
          );
        }
      } catch (loadError) {
        console.error(
          "Load runs error:",
          loadError
        );

        if (!cancelled) {
          setRuns([]);

          setError(
            loadError.message ||
              "Unable to retrieve your runs."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadRuns();

    return () => {
      cancelled = true;
    };
  }, [
    user?.id,
    isAuthenticated,
  ]);

  /*
   * ================================
   * Verified Run Count
   * ================================
   */

  const verifiedRuns =
    useMemo(() => {
      return runs.filter(
        (run) =>
          run.status === "verified"
      ).length;
    }, [runs]);

  /*
   * ================================
   * Total Distance
   * ================================
   */

  const totalDistance =
    useMemo(() => {
      return runs
        .filter(
          (run) =>
            run.status === "verified"
        )
        .reduce(
          (total, run) =>
            total +
            (Number(
              run.distance
            ) || 0),
          0
        );
    }, [runs]);

  /*
   * ================================
   * Current Streak
   * ================================
   */

  const currentStreak =
    useMemo(
      () =>
        calculateCurrentStreak(
          runs
        ),
      [runs]
    );

  /*
   * ================================
   * Add Verified Run
   * ================================
   */

  const addVerifiedRun =
    async (runData = {}) => {
      if (!user?.id) {
        throw new Error(
          "You must be logged in to save a run."
        );
      }

      try {
        setError("");

        const response =
          await fetch(
            `${API_URL}/api/users/${user.id}/runs`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                distance:
                  Number(
                    runData.distance
                  ) || 0,

                duration:
                  Number(
                    runData.duration
                  ) || 0,

                gpsPoints:
                  Number(
                    runData.gpsPoints
                  ) || 0,

                maxSpeed:
                  Number(
                    runData.maxSpeed
                  ) || 0,

                route:
                  Array.isArray(
                    runData.route
                  )
                    ? runData.route
                    : [],
              }),
            }
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Unable to save your run."
          );
        }

        /*
         * Add the database record
         * to current React state.
         */
        setRuns(
          (previousRuns) => [
            data.run,
            ...previousRuns,
          ]
        );

        return data.run;
      } catch (saveError) {
        console.error(
          "Save run error:",
          saveError
        );

        setError(
          saveError.message ||
            "Unable to save your run."
        );

        throw saveError;
      }
    };

  /*
   * ================================
   * Refresh Runs
   * ================================
   */

  const refreshRuns =
    async () => {
      if (!user?.id) {
        setRuns([]);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await fetch(
            `${API_URL}/api/users/${user.id}/runs`
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Unable to refresh your runs."
          );
        }

        setRuns(
          Array.isArray(data.runs)
            ? data.runs
            : []
        );
      } catch (
        refreshError
      ) {
        console.error(
          "Refresh runs error:",
          refreshError
        );

        setError(
          refreshError.message ||
            "Unable to refresh your runs."
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <RunContext.Provider
      value={{
        runs,
        verifiedRuns,
        totalDistance,
        currentStreak,
        loading,
        error,
        addVerifiedRun,
        refreshRuns,
      }}
    >
      {children}
    </RunContext.Provider>
  );
}

export function useRun() {
  return useContext(RunContext);
}