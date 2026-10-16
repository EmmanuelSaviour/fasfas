import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import { useRun } from "../context/RunContext";
import { useAuth } from "../context/AuthContext";

const ACTIVE_RUN_KEY =
  "fasfas_active_run";

/*
 * ==========================================
 * FasFas GPS Settings
 * ==========================================
 */

/*
 * Ignore only extremely tiny GPS movements.
 * 1 metre is small enough to remove GPS noise
 * without making the tracker feel static.
 */
const MIN_MOVEMENT = 0.001; // 1 metre

/*
 * Human running speed ceiling.
 * This is deliberately generous so normal GPS
 * movement is not rejected.
 */
const MAX_REALISTIC_SPEED = 50; // km/h

/*
 * Only reject a single GPS jump when it is
 * obviously too large to represent one normal
 * GPS update.
 */
const MAX_DISTANCE_PER_UPDATE = 0.50; // 500 metres

/*
 * Minimum distance required before verification.
 */
const MIN_VERIFICATION_DISTANCE = 2.0;

/*
 * Minimum GPS updates required.
 */
const MIN_VALID_GPS_POINTS = 10;

/*
 * ==========================================
 * TEMPORARY 2 KM GOAL TEST SWITCH
 * ==========================================
 *
 * TRUE = test mode:
 * the goal alert fires at 0.01 km.
 *
 * FALSE = production mode:
 * the goal alert fires at 2.00 km.
 *
 * This does NOT change GPS distance
 * calculation or verification.
 */
const GOAL_TEST_MODE = false;

const MOVE_GOAL_DISTANCE =
  GOAL_TEST_MODE ? 0.01 : 2.0;

function Run() {
  const navigate = useNavigate();

  const {
    addVerifiedRun,
  } = useRun();

  const {
    isAuthenticated,
  } = useAuth();

  const [isRunning, setIsRunning] =
    useState(false);

  const [isFinished, setIsFinished] =
    useState(false);

  const [isVerifying, setIsVerifying] =
    useState(false);

  const [isVerified, setIsVerified] =
    useState(false);

  const [seconds, setSeconds] =
    useState(0);

  const [distance, setDistance] =
    useState(0);

  const [cadence, setCadence] = useState(0);
  const [motionStatus, setMotionStatus] = useState("idle");

  const stepCountRef = useRef(0);
  const lastStepTimeRef = useRef(0);
  const motionValuesRef = useRef([]);
  const previousVariationRef = useRef(0);
  const lastPeakRef = useRef(false);
  const cadenceStartTimeRef = useRef(0);
  const stepTimesRef = useRef([]);

  /*
   * 2 km move-goal notification.
   * This is separate from the distance
   * calculation so the GPS engine stays unchanged.
   */
  const [
    goalAccomplished,
    setGoalAccomplished,
  ] = useState(false);

  /*
   * Temporary 2 km goal alert.
   * It disappears automatically after 2 seconds.
   */
  const [
    showGoalAlert,
    setShowGoalAlert,
  ] = useState(false);

  /*
   * GPS information is kept internally.
   * The runner only sees distance and duration.
   */

  const [
    locationStatus,
    setLocationStatus,
  ] = useState("idle");

  const [
    locationError,
    setLocationError,
  ] = useState("");

  const [gpsUpdates, setGpsUpdates] =
    useState(0);

  const [gpsAccuracy, setGpsAccuracy] =
    useState(null);

  const [latitude, setLatitude] =
    useState(null);

  const [longitude, setLongitude] =
    useState(null);

  const [lastMovement, setLastMovement] =
    useState(0);

  /*
   * ==========================================
   * References
   * ==========================================
   */

  const watchIdRef =
    useRef(null);

  const previousPositionRef =
    useRef(null);

  const previousTimestampRef =
    useRef(null);

  const runStartTimeRef =
    useRef(null);

  const activeRunRef = useRef(false);

  const validGpsPointsRef =
    useRef(0);

  /*
   * Trusted accumulated distance.
   */
  const totalDistanceRef =
    useRef(0);

  /*
   * Prevent the 2 km notification from
   * firing more than once per run.
   */
  const goalAccomplishedRef =
    useRef(false);

  /*
   * Short in-page goal sound.
   * Kept in a ref so it can be reused without
   * changing the distance/GPS engine.
   */
  const goalAudioRef =
    useRef(null);

  /*
   * ==========================================
   * Haversine Distance
   * ==========================================
   */

  /*
   * STRICTER CADENCE DETECTOR
   *
   * Requires valid acceleration data, clear peaks,
   * enough detected steps, and consistent timing.
   */
  const handleMotion = useCallback((event) => {
    const acceleration = event.acceleration;

    // Require usable acceleration data.
    if (
      !acceleration ||
      acceleration.x == null ||
      acceleration.y == null ||
      acceleration.z == null ||
      !Number.isFinite(acceleration.x) ||
      !Number.isFinite(acceleration.y) ||
      !Number.isFinite(acceleration.z)
    ) {
      return;
    }

    const magnitude = Math.sqrt(
      acceleration.x ** 2 +
      acceleration.y ** 2 +
      acceleration.z ** 2
    );

    const now = Date.now();
    const values = motionValuesRef.current;

    // Estimate the recent acceleration baseline.
    const average =
      values.length > 0
        ? values.reduce((sum, value) => sum + value, 0) /
          values.length
        : magnitude;

    const variation = magnitude - average;

    values.push(magnitude);

    if (values.length > 20) {
      values.shift();
    }

    const previousVariation = previousVariationRef.current;
    previousVariationRef.current = variation;

    // Require a clear acceleration peak.
    if (variation >= 2.2) {
      lastPeakRef.current = true;
    }

    const isFallingPeak =
      lastPeakRef.current &&
      variation < previousVariation &&
      previousVariation >= 2.2;

    if (!isFallingPeak) {
      if (variation < 0.4) {
        lastPeakRef.current = false;
      }
      return;
    }

    lastPeakRef.current = false;

    // Reject peaks that occur too close together.
    const previousStepTime = lastStepTimeRef.current;

    if (
      previousStepTime !== 0 &&
      now - previousStepTime < 400
    ) {
      return;
    }

    lastStepTimeRef.current = now;

    const stepTimes = stepTimesRef.current;
    stepTimes.push(now);

    // Keep only recent peak timestamps.
    while (
      stepTimes.length > 0 &&
      now - stepTimes[0] > 8000
    ) {
      stepTimes.shift();
    }

    // Require at least 8 peaks before estimating cadence.
    if (stepTimes.length < 8) {
      return;
    }

    const recentTimes = stepTimes.slice(-8);
    const intervals = [];

    for (let i = 1; i < recentTimes.length; i += 1) {
      intervals.push(recentTimes[i] - recentTimes[i - 1]);
    }

    if (intervals.length < 7) {
      return;
    }

    // Calculate the median interval.
    const sortedIntervals = [...intervals].sort((a, b) => a - b);
    const middle = Math.floor(sortedIntervals.length / 2);

    const medianInterval =
      sortedIntervals.length % 2 === 0
        ? (sortedIntervals[middle - 1] + sortedIntervals[middle]) / 2
        : sortedIntervals[middle];

    // Reject implausibly fast or slow step rhythms.
    if (medianInterval < 300 || medianInterval > 1500) {
      return;
    }

    // Require a consistent rhythm across recent peaks.
    const consistentIntervals = intervals.filter(
      (interval) =>
        Math.abs(interval - medianInterval) <=
        Math.max(80, medianInterval * 0.12)
    );

    if (consistentIntervals.length < 6) {
      return;
    }

    const stepsPerMinute = 60000 / medianInterval;

    if (
      Number.isFinite(stepsPerMinute) &&
      stepsPerMinute >= 40 &&
      stepsPerMinute <= 200
    ) {
      setCadence(Math.round(stepsPerMinute));
    }
  }, []);

  const calculateDistance = (
    latitude1,
    longitude1,
    latitude2,
    longitude2
  ) => {
    const earthRadius = 6371;

    const latitudeDifference =
      ((latitude2 - latitude1) *
        Math.PI) /
      180;

    const longitudeDifference =
      ((longitude2 - longitude1) *
        Math.PI) /
      180;

    const a =
      Math.sin(
        latitudeDifference / 2
      ) ** 2 +
      Math.cos(
        (latitude1 * Math.PI) / 180
      ) *
        Math.cos(
          (latitude2 * Math.PI) / 180
        ) *
        Math.sin(
          longitudeDifference / 2
        ) ** 2;

    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );

    return earthRadius * c;
  };

  /*
   * ==========================================
   * Move Goal Alert + Sound
   * ==========================================
   *
   * Shows for exactly 2 seconds and does not
   * stop, pause, or otherwise affect the run.
   */

  const showMoveGoalAccomplished = () => {
    if (goalAccomplishedRef.current) {
      return;
    }

    goalAccomplishedRef.current = true;
    setGoalAccomplished(true);

    setShowGoalAlert(true);

    /*
     * Play a short notification sound.
     * Web browsers may require a previous user
     * interaction before audio can play; the run
     * itself was started by the runner, so this
     * normally satisfies that requirement.
     */
    try {
      if (!goalAudioRef.current) {
        const AudioContext =
          window.AudioContext ||
          window.webkitAudioContext;

        if (AudioContext) {
          const audioContext =
            new AudioContext();

          goalAudioRef.current =
            audioContext;
        }
      }

      const audioContext =
        goalAudioRef.current;

      if (
        audioContext &&
        audioContext.state ===
          "suspended"
      ) {
        audioContext.resume();
      }

      if (audioContext) {
        const oscillator =
          audioContext.createOscillator();

        const gain =
          audioContext.createGain();

        oscillator.type =
          "sine";

        oscillator.frequency.setValueAtTime(
          880,
          audioContext.currentTime
        );

        oscillator.frequency.exponentialRampToValueAtTime(
          1320,
          audioContext.currentTime +
            0.12
        );

        gain.gain.setValueAtTime(
          0.0001,
          audioContext.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
          0.18,
          audioContext.currentTime +
            0.02
        );

        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          audioContext.currentTime +
            0.35
        );

        oscillator.connect(gain);
        gain.connect(
          audioContext.destination
        );

        oscillator.start();

        oscillator.stop(
          audioContext.currentTime +
            0.35
        );
      }
    } catch (error) {
      console.warn(
        "Move goal sound could not play:",
        error
      );
    }

    /*
     * Automatically remove the alert after
     * exactly 2 seconds.
     */
    window.setTimeout(() => {
      setShowGoalAlert(false);
    }, 2000);
  };

  /*
   * ==========================================
   * Save Temporary Active Run
   * ==========================================
   */

  const saveActiveRun = (
    overrides = {}
  ) => {
    if (!runStartTimeRef.current || !activeRunRef.current) {
      return;
    }

    const activeRun = {
      status:
        overrides.status !==
        undefined
          ? overrides.status
          : "running",

      startTime:
        runStartTimeRef.current,

      seconds:
        overrides.seconds !==
        undefined
          ? overrides.seconds
          : seconds,

      distance:
        overrides.distance !==
        undefined
          ? overrides.distance
          : totalDistanceRef.current,

      gpsUpdates:
        overrides.gpsUpdates !==
        undefined
          ? overrides.gpsUpdates
          : gpsUpdates,

      gpsAccuracy:
        overrides.gpsAccuracy !==
        undefined
          ? overrides.gpsAccuracy
          : gpsAccuracy,

      latitude:
        overrides.latitude !==
        undefined
          ? overrides.latitude
          : latitude,

      longitude:
        overrides.longitude !==
        undefined
          ? overrides.longitude
          : longitude,

      lastMovement:
        overrides.lastMovement !==
        undefined
          ? overrides.lastMovement
          : lastMovement,

      goalAccomplished:
        overrides.goalAccomplished !==
        undefined
          ? overrides.goalAccomplished
          : goalAccomplishedRef.current,

      savedAt: Date.now(),
    };

    localStorage.setItem(
      ACTIVE_RUN_KEY,
      JSON.stringify(activeRun)
    );
  };

  /*
   * ==========================================
   * Clear Temporary Run
   * ==========================================
   */

  const clearActiveRun = () => {
    activeRunRef.current = false;

    localStorage.removeItem(
      ACTIVE_RUN_KEY
    );

    runStartTimeRef.current = null;
    totalDistanceRef.current = 0;
  };

  /*
   * ==========================================
   * Stop GPS
   * ==========================================
   */

  const stopLocationTracking =
    () => {
      if (
        watchIdRef.current !== null
      ) {
        navigator.geolocation.clearWatch(
          watchIdRef.current
        );

        watchIdRef.current =
          null;
      }

      previousPositionRef.current =
        null;

      previousTimestampRef.current =
        null;
    };

  /*
   * ==========================================
   * GPS Tracking
   * ==========================================
   */

  const startMotionTracking = async () => {
    if (!("DeviceMotionEvent" in window)) {
      setMotionStatus("unavailable");
      return;
    }

    try {
      if (
        typeof DeviceMotionEvent.requestPermission ===
        "function"
      ) {
        const permission =
          await DeviceMotionEvent.requestPermission();

        if (permission !== "granted") {
          setMotionStatus("denied");
          return;
        }
      }

      window.removeEventListener(
        "devicemotion",
        handleMotion
      );

      window.addEventListener(
        "devicemotion",
        handleMotion
      );

      setMotionStatus("listening");
    } catch (error) {
      console.warn(
        "Motion sensor unavailable:",
        error
      );

      setMotionStatus("unavailable");
    }
  };

  const stopMotionTracking = () => {
    window.removeEventListener(
      "devicemotion",
      handleMotion
    );

    setMotionStatus("idle");
  };

  const startLocationTracking =
    () => {
      if (
        !navigator.geolocation
      ) {
        setLocationStatus(
          "error"
        );

        setLocationError(
          "GPS is not supported by this browser."
        );

        return;
      }

      setLocationStatus(
        "requesting"
      );

      setLocationError("");

      const watchId =
        navigator.geolocation.watchPosition(
          (position) => {
            const {
              latitude:
                currentLatitude,
              longitude:
                currentLongitude,
              accuracy,
            } = position.coords;

            if (
              !Number.isFinite(
                currentLatitude
              ) ||
              !Number.isFinite(
                currentLongitude
              )
            ) {
              return;
            }

            /*
             * Store GPS information internally.
             */

            setLatitude(
              currentLatitude
            );

            setLongitude(
              currentLongitude
            );

            const currentAccuracy =
              Number.isFinite(accuracy)
                ? accuracy
                : null;

            if (currentAccuracy === null || currentAccuracy > 20) {
              return;
            }

            setGpsAccuracy(
              currentAccuracy
            );

            setGpsUpdates(
              (previous) =>
                previous + 1
            );

            const currentPosition = {
              latitude:
                currentLatitude,
              longitude:
                currentLongitude,
              accuracy:
                currentAccuracy,
            };

            const currentTimestamp =
              Number.isFinite(
                position.timestamp
              )
                ? position.timestamp
                : Date.now();

            /*
             * ==================================
             * FIRST GPS POINT
             * ==================================
             *
             * Establish baseline.
             * Never adds distance.
             */

            if (
              previousPositionRef.current ===
              null
            ) {
              previousPositionRef.current =
                currentPosition;

              previousTimestampRef.current =
                currentTimestamp;

              setLastMovement(0);

              setLocationStatus(
                "tracking"
              );

              saveActiveRun({
                latitude:
                  currentLatitude,

                longitude:
                  currentLongitude,

                gpsAccuracy:
                  currentAccuracy,

                lastMovement: 0,
              });

              return;
            }

            const previousPosition =
              previousPositionRef.current;

            const previousTimestamp =
              previousTimestampRef.current;

            /*
             * ==================================
             * Calculate Movement
             * ==================================
             */

            const movementDistance =
              calculateDistance(
                previousPosition.latitude,
                previousPosition.longitude,
                currentPosition.latitude,
                currentPosition.longitude
              );

            const movement =
              Number(
                movementDistance.toFixed(
                  6
                )
              );

            /*
             * Require movement to exceed the combined
             * GPS uncertainty of the current and previous
             * positions. This helps prevent stationary
             * GPS drift from being counted as distance.
             */
            const previousAccuracy =
              Number.isFinite(previousPosition.accuracy)
                ? previousPosition.accuracy
                : currentAccuracy;

            const minimumMeaningfulMovement =
              Math.max(
                MIN_MOVEMENT,
                ((currentAccuracy + previousAccuracy) * 1.5) / 1000
              );

            setLastMovement(
              movement
            );

            /*
             * ==================================
             * Calculate Time Difference
             * ==================================
             */

            const elapsedMilliseconds =
              Math.max(
                1000,
                currentTimestamp -
                  (previousTimestamp ||
                    currentTimestamp)
              );

            const elapsedHours =
              elapsedMilliseconds /
              (1000 * 60 * 60);

            /*
             * ==================================
             * Calculate Approximate Speed
             * ==================================
             */

            const calculatedSpeed =
              movementDistance /
              elapsedHours;

            /*
             * ==================================
             * Tiny Movement
             * ==================================
             *
             * GPS movement within the estimated
             * noise range is ignored. The baseline
             * stays in place so genuine movement can
             * accumulate until it is measurable.
             */

            if (
              movementDistance <
              minimumMeaningfulMovement
            ) {
              setLocationStatus(
                "tracking"
              );

              saveActiveRun({
                latitude:
                  currentLatitude,

                longitude:
                  currentLongitude,

                gpsAccuracy:
                  currentAccuracy,

                lastMovement:
                  movement,
              });

              return;
            }

            /*
             * ==================================
             * GPS FILTER
             * ==================================
             *
             * Reject only obvious GPS jumps.
             */

            const isHugeJump =
              movementDistance >
              MAX_DISTANCE_PER_UPDATE;

            /*
             * Only apply the speed filter when
             * we have a meaningful GPS interval.
             *
             * This prevents a very short GPS
             * interval from producing an absurd
             * calculated speed.
             */

            const hasReliableTimeInterval =
              elapsedMilliseconds >=
              5000;

            const isImpossibleSpeed =
              hasReliableTimeInterval &&
              calculatedSpeed >
                MAX_REALISTIC_SPEED;

            /*
             * ==================================
             * Reject Only Obvious GPS Problems
             * ==================================
             */

            if (
              isHugeJump ||
              isImpossibleSpeed
            ) {
              /*
               * Move the baseline forward.
               *
               * This is important because a bad
               * GPS point should not cause the
               * tracker to remain stuck.
               */

              previousPositionRef.current =
                currentPosition;

              previousTimestampRef.current =
                currentTimestamp;

              setLocationStatus(
                "tracking"
              );

              saveActiveRun({
                latitude:
                  currentLatitude,

                longitude:
                  currentLongitude,

                gpsAccuracy:
                  currentAccuracy,

                lastMovement:
                  movement,
              });

              return;
            }

            /*
             * ==================================
             * VALID MOVEMENT
             * ==================================
             */

            validGpsPointsRef.current +=
              1;

            /*
             * Add the movement directly.
             *
             * Distance can NEVER decrease.
             */

            const newTotalDistance =
              totalDistanceRef.current +
              movementDistance;

            totalDistanceRef.current =
              Math.max(
                totalDistanceRef.current,
                newTotalDistance
              );

            /*
             * Trigger the 2 km move goal once.
             * This does not stop or finish the run.
             */
            if (
              totalDistanceRef.current >=
                MOVE_GOAL_DISTANCE &&
              !goalAccomplishedRef.current
            ) {
              showMoveGoalAccomplished();
            }

            setDistance(
              totalDistanceRef.current
            );

            /*
             * Update GPS baseline after
             * accepted movement.
             */

            previousPositionRef.current =
              currentPosition;

            previousTimestampRef.current =
              currentTimestamp;

            setLocationStatus(
              "tracking"
            );

            saveActiveRun({
              distance:
                totalDistanceRef.current,

              latitude:
                currentLatitude,

              longitude:
                currentLongitude,

              gpsAccuracy:
                currentAccuracy,

              lastMovement:
                movement,

              goalAccomplished:
                goalAccomplishedRef.current,
            });
          },

          (error) => {
            console.error(
              "GPS error:",
              error
            );

            setLocationStatus(
              "error"
            );

            if (
              error.code === 1
            ) {
              setLocationError(
                "Location permission was denied. Please allow location access."
              );
            } else if (
              error.code === 2
            ) {
              setLocationError(
                "Your location could not be determined."
              );
            } else if (
              error.code === 3
            ) {
              setLocationError(
                "Location request timed out. Please move outside and try again."
              );
            } else {
              setLocationError(
                "Unable to access your location."
              );
            }

            saveActiveRun();
          },

          {
            enableHighAccuracy:
              true,

            /*
             * Allow the browser to use a
             * recent location, but keep it
             * reasonably fresh.
             */

            maximumAge: 2000,

            timeout: 30000,
          }
        );

      watchIdRef.current =
        watchId;
    };

  /*
   * ==========================================
   * Clear Run Completely
   * ==========================================
   */

  const resetRunState = () => {
    stopLocationTracking();
    stopMotionTracking();

    stepCountRef.current = 0;
    lastStepTimeRef.current = 0;
    motionValuesRef.current = [];
    stepTimesRef.current = [];
    previousVariationRef.current = 0;
    cadenceStartTimeRef.current = 0;
    lastPeakRef.current = false;

    setCadence(0);

    clearActiveRun();

    runStartTimeRef.current =
      null;

    previousPositionRef.current =
      null;

    previousTimestampRef.current =
      null;

    validGpsPointsRef.current =
      0;

    totalDistanceRef.current =
      0;

    goalAccomplishedRef.current =
      false;

    setGoalAccomplished(false);

    setShowGoalAlert(false);

    setIsRunning(false);

    setIsFinished(false);

    setIsVerifying(false);

    setIsVerified(false);

    setSeconds(0);

    setDistance(0);

    setLocationStatus(
      "idle"
    );

    setLocationError("");

    setGpsUpdates(0);

    setGpsAccuracy(null);

    setLatitude(null);

    setLongitude(null);

    setLastMovement(0);
  };

  /*
   * ==========================================
   * Logout Detection
   * ==========================================
   */

  const previousAuthStateRef =
    useRef(isAuthenticated);

  useEffect(() => {
    const wasAuthenticated =
      previousAuthStateRef.current;

    if (
      wasAuthenticated &&
      !isAuthenticated
    ) {
      resetRunState();
    }

    previousAuthStateRef.current =
      isAuthenticated;
  }, [isAuthenticated]);

  /*
   * ==========================================
   * Restore Active Run
   * ==========================================
   *
   * Browser refresh:
   * restore today's unfinished run.
   *
   * Logout:
   * active run has already been deleted.
   */

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const savedRun =
      localStorage.getItem(
        ACTIVE_RUN_KEY
      );

    if (!savedRun) {
      return;
    }

    try {
      const activeRun =
        JSON.parse(savedRun);

      if (
        !activeRun.startTime
      ) {
        localStorage.removeItem(
          ACTIVE_RUN_KEY
        );

        return;
      }

      if (
        activeRun.status !==
        "running"
      ) {
        localStorage.removeItem(
          ACTIVE_RUN_KEY
        );

        return;
      }

      /*
       * Only restore today's run.
       */

      const savedRunDate =
        new Date(
          activeRun.startTime
        );

      const today =
        new Date();

      const isSameCalendarDay =
        savedRunDate.getFullYear() ===
          today.getFullYear() &&
        savedRunDate.getMonth() ===
          today.getMonth() &&
        savedRunDate.getDate() ===
          today.getDate();

      if (
        !isSameCalendarDay
      ) {
        localStorage.removeItem(
          ACTIVE_RUN_KEY
        );

        return;
      }

      const elapsedSeconds =
        Math.max(
          0,
          Math.floor(
            (Date.now() -
              activeRun.startTime) /
              1000
          )
        );

      activeRunRef.current = true;
      runStartTimeRef.current =
        activeRun.startTime;

      const restoredDistance =
        Math.max(
          0,
          Number(
            activeRun.distance || 0
          )
        );

      totalDistanceRef.current =
        restoredDistance;

      const restoredGoalAccomplished =
        Boolean(
          activeRun.goalAccomplished ||
            restoredDistance >= 2
        );

      goalAccomplishedRef.current =
        restoredGoalAccomplished;

      setGoalAccomplished(
        restoredGoalAccomplished
      );

      setSeconds(
        elapsedSeconds
      );

      setDistance(
        restoredDistance
      );

      setGpsUpdates(
        Number(
          activeRun.gpsUpdates || 0
        )
      );

      setGpsAccuracy(
        activeRun.gpsAccuracy ??
          null
      );

      setLatitude(
        activeRun.latitude ??
          null
      );

      setLongitude(
        activeRun.longitude ??
          null
      );

      setLastMovement(
        Number(
          activeRun.lastMovement ||
            0
        )
      );

      /*
       * Do not restore the old GPS
       * coordinate as the new baseline.
       *
       * We want a fresh GPS position.
       */

      previousPositionRef.current =
        null;

      previousTimestampRef.current =
        null;

      validGpsPointsRef.current =
        0;

      setIsRunning(true);

      setLocationStatus(
        "requesting"
      );

      setTimeout(() => {
        if (
          !isAuthenticated
        ) {
          return;
        }

        startLocationTracking();
      }, 300);
    } catch (error) {
      console.error(
        "Unable to restore active run:",
        error
      );

      localStorage.removeItem(
        ACTIVE_RUN_KEY
      );
    }
  }, [isAuthenticated]);

  /*
   * ==========================================
   * Timer
   * ==========================================
   */

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const updateTimer = () => {
      if (
        !runStartTimeRef.current
      ) {
        return;
      }

      const elapsedSeconds =
        Math.max(
          0,
          Math.floor(
            (Date.now() -
              runStartTimeRef.current) /
              1000
          )
        );

      setSeconds(
        elapsedSeconds
      );

      saveActiveRun({
        seconds:
          elapsedSeconds,
      });
    };

    updateTimer();

    const timer =
      setInterval(
        updateTimer,
        1000
      );

    return () =>
      clearInterval(timer);
  }, [isRunning]);

  /*
   * ==========================================
   * Periodic Persistence
   * ==========================================
   */

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const persistenceTimer =
      setInterval(() => {
        saveActiveRun();
      }, 2000);

    return () =>
      clearInterval(
        persistenceTimer
      );
  }, [
    isRunning,
    seconds,
    distance,
    gpsUpdates,
    gpsAccuracy,
    latitude,
    longitude,
    lastMovement,
  ]);

  /*
   * ==========================================
   * Cleanup
   * ==========================================
   */

  useEffect(() => {
    return () => {
      stopLocationTracking();

      window.removeEventListener(
        "devicemotion",
        handleMotion
      );
    };
  }, []);

  /*
   * ==========================================
   * Start Run
   * ==========================================
   */

  const handleStart = async () => {
    startMotionTracking();
    stopLocationTracking();

    stepCountRef.current = 0;
    lastStepTimeRef.current = 0;
    motionValuesRef.current = [];
    stepTimesRef.current = [];
    previousVariationRef.current = 0;
    cadenceStartTimeRef.current = 0;
    lastPeakRef.current = false;

    setCadence(0);

    localStorage.removeItem(
      ACTIVE_RUN_KEY
    );

    previousPositionRef.current =
      null;

    previousTimestampRef.current =
      null;

    validGpsPointsRef.current =
      0;

    totalDistanceRef.current =
      0;

    goalAccomplishedRef.current =
      false;

    setGoalAccomplished(false);

    setShowGoalAlert(false);

    activeRunRef.current = true;

    const newStartTime =
      Date.now();

    runStartTimeRef.current =
      newStartTime;

    setIsRunning(true);

    setIsFinished(false);

    setIsVerifying(false);

    setIsVerified(false);

    setSeconds(0);

    setDistance(0);

    setLocationStatus(
      "requesting"
    );

    setLocationError("");

    setGpsUpdates(0);

    setGpsAccuracy(null);

    setLatitude(null);

    setLongitude(null);

    setLastMovement(0);

    localStorage.setItem(
      ACTIVE_RUN_KEY,
      JSON.stringify({
        status: "running",

        startTime:
          newStartTime,

        seconds: 0,

        distance: 0,

        gpsUpdates: 0,

        gpsAccuracy: null,

        latitude: null,

        longitude: null,

        lastMovement: 0,

        goalAccomplished: false,

        savedAt: Date.now(),
      })
    );

    startLocationTracking();
  };

  /*
   * ==========================================
   * Finish Run
   * ==========================================
   */

  const handleFinish = () => {
    setIsRunning(false);

    setIsFinished(true);

    stopLocationTracking();
    stopMotionTracking();

    setLocationStatus(
      "stopped"
    );

    saveActiveRun({
      status: "finished",

      distance:
        totalDistanceRef.current,
    });
  };

  /*
   * ==========================================
   * Verify Run
   * ==========================================
   */

  const handleVerify = () => {
    const finalDistance =
      Math.max(
        0,
        totalDistanceRef.current
      );

    if (
      finalDistance <
      MIN_VERIFICATION_DISTANCE
    ) {
      setLocationError(
        `You need to complete at least ${MIN_VERIFICATION_DISTANCE.toFixed(
          2
        )} km before your run can be verified.`
      );

      setLocationStatus(
        "error"
      );

      return;
    }

    if (
      gpsUpdates <
      MIN_VALID_GPS_POINTS
    ) {
      setLocationError(
        "We need more GPS movement data before this run can be verified."
      );

      setLocationStatus(
        "error"
      );

      return;
    }

    setIsVerifying(true);

    setLocationError("");

    setTimeout(
      async () => {
        try {
          await addVerifiedRun({
            duration: seconds,
            distance: finalDistance,
            gpsPoints: gpsUpdates,
            maxSpeed: 0,
            cadence:
              Number.isFinite(Number(cadence)) && cadence > 0
                ? Math.round(cadence)
                : null,
            route: [],
          });

          setIsVerifying(false);

          setIsVerified(true);

          clearActiveRun();
        } catch (error) {
          console.error(
            "Verification error:",
            error
          );

          setIsVerifying(false);

          setLocationStatus(
            "error"
          );

          setLocationError(
            error.message ||
              "Unable to save your verified run."
          );
        }
      },
      1500
    );
  };

  /*
   * ==========================================
   * Restart Run
   * ==========================================
   */

  const handleRestartRun = () => {
    resetRunState();
  };

  /*
   * ==========================================
   * Reset Run
   * ==========================================
   */

  const handleReset = () => {
    resetRunState();
  };

  /*
   * ==========================================
   * Format Time
   * ==========================================
   */

  const formatTime = (
    totalSeconds
  ) => {
    const hours =
      Math.floor(
        totalSeconds / 3600
      );

    const minutes =
      Math.floor(
        (totalSeconds % 3600) /
          60
      );

    const remainingSeconds =
      totalSeconds % 60;

    return [
      hours,
      minutes,
      remainingSeconds,
    ]
      .map((value) =>
        String(value).padStart(
          2,
          "0"
        )
      )
      .join(":");
  };

  /*
   * ==========================================
   * Page Title
   * ==========================================
   */

  const getTitle = () => {
    if (isVerified) {
      return "Run Verified! 🎉";
    }

    if (isVerifying) {
      return "Verifying Your Run...";
    }

    if (isFinished) {
      return "Run Complete! 🏁";
    }

    if (isRunning) {
      return "Keep Moving! 🏃";
    }

    return "Ready to Run? 🏃";
  };

  /*
   * ==========================================
   * Page Description
   * ==========================================
   */

  const getDescription = () => {
    if (isVerified) {
      return "Your run has been successfully verified.";
    }

    if (isVerifying) {
      return "We're checking your run before it counts toward your FasFas journey.";
    }

    if (isFinished) {
      return "Great work. Review your run before submitting it for verification.";
    }

    if (isRunning) {
      return "Stay consistent and keep moving.";
    }

    return "Start your run and begin growing your FasFas journey.";
  };

  /*
   * ==========================================
   * Render
   * ==========================================
   */

  return (
    <main className="relative min-h-screen bg-gray-50 px-6 py-10">
      {showGoalAlert && (
        <div
          className="pointer-events-none fixed left-1/2 top-6 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl bg-emerald-600 px-6 py-4 text-center text-white shadow-2xl"
          role="status"
          aria-live="polite"
        >
          <div className="text-2xl">
            🎉
          </div>

          <p className="mt-1 text-lg font-extrabold">
            Move goal accomplished!
          </p>

          <p className="mt-1 text-sm text-emerald-50">
            You've completed{" "}
            {MOVE_GOAL_DISTANCE.toFixed(2)} km. Keep moving!
          </p>
        </div>
      )}

      <div className="mx-auto max-w-4xl">

        {!isRunning &&
          !isVerifying && (
            <button
              onClick={() =>
                navigate(
                  "/dashboard"
                )
              }
              className="mb-6 font-medium text-gray-500 transition hover:text-emerald-600"
            >
              ← Back to Dashboard
            </button>
          )}

        {/* Header */}

        <section className="rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-blue-600 p-8 text-center text-white shadow-lg md:p-10">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-100">
            FasFas Run
          </p>

          <h1 className="mt-3 text-4xl font-extrabold md:text-5xl">
            {getTitle()}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-emerald-100">
            {getDescription()}
          </p>

        </section>

        {/* Run Card */}

        <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm md:p-10">

          <div className="flex justify-center">

            <div
              className={`rounded-full px-5 py-2 text-sm font-semibold ${
                isVerified
                  ? "bg-emerald-100 text-emerald-700"
                  : isVerifying
                    ? "bg-blue-100 text-blue-700"
                    : isRunning
                      ? "bg-emerald-100 text-emerald-700"
                      : isFinished
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600"
              }`}
            >
              {isVerified
                ? "✓ Run verified"
                : isVerifying
                  ? "● Verification in progress"
                  : isRunning
                    ? "● Run in progress"
                    : isFinished
                      ? "✓ Run finished"
                      : "● Ready to start"}
            </div>

          </div>

          {/* Stats */}

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {/* Duration */}

            <div className="rounded-2xl bg-gray-50 p-8 text-center">

              <div className="text-4xl">
                ⏱️
              </div>

              <p className="mt-4 text-sm font-medium text-gray-500">
                Duration
              </p>

              <p className="mt-2 text-4xl font-bold text-gray-900">
                {formatTime(
                  seconds
                )}
              </p>

            </div>

            {/* Distance */}

            <div className="rounded-2xl bg-gray-50 p-8 text-center">

              <div className="text-4xl">
                📍
              </div>

              <p className="mt-4 text-sm font-medium text-gray-500">
                Distance
              </p>

              <p className="mt-2 text-4xl font-bold text-gray-900">
                {distance.toFixed(
                  2
                )} km
              </p>

            </div>

            {/* Cadence */}

            <div className="rounded-2xl bg-gray-50 p-8 text-center">

              <div className="text-4xl">👟</div>

              <p className="mt-4 text-sm font-medium text-gray-500">
                Cadence
              </p>

              <p className="mt-2 text-4xl font-bold text-gray-900">
                {cadence}
              </p>

              <p className="mt-1 text-sm text-gray-400">
                steps/min
              </p>
            </div>

          </div>

          {/* Error */}

          {locationError && (
            <div className="mt-6 rounded-2xl bg-red-50 p-4 text-center">
              <p className="text-sm font-medium text-red-700">
                {locationError}
              </p>
            </div>
          )}

          {/* Verified */}

          {isVerified && (
            <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">

              <div className="text-5xl">
                🌱
              </div>

              <h2 className="mt-3 text-2xl font-bold text-gray-900">
                Your run counts!
              </h2>

              <p className="mt-2 text-gray-600">
                This verified run will
                contribute to your
                FasFas consistency
                journey.
              </p>

            </div>
          )}

          {/* Buttons */}

          <div className="mt-10 flex flex-col items-center gap-4">

            {/* Start */}

            {!isRunning &&
              !isFinished &&
              !isVerifying &&
              !isVerified && (
                <button
                  onClick={
                    handleStart
                  }
                  className="w-full max-w-md rounded-2xl bg-emerald-600 px-8 py-4 text-lg font-bold text-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:bg-emerald-700 hover:shadow-lg active:scale-[0.98]"
                >
                  🏃 Start Run
                </button>
              )}

            {/* Finish */}

            {isRunning && (
              <>
                <button
                  onClick={
                    handleFinish
                  }
                  className="w-full max-w-md rounded-2xl bg-gray-900 px-8 py-4 text-lg font-bold text-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:bg-gray-800 active:scale-[0.98]"
                >
                  ⏹ Finish Run
                </button>

                {/* Restart while running */}

                <button
                  onClick={
                    handleRestartRun
                  }
                  className="w-full max-w-md rounded-2xl border-2 border-gray-200 bg-white px-8 py-4 text-lg font-bold text-gray-700 transition-all hover:border-red-300 hover:text-red-600 active:scale-[0.98]"
                >
                  🔄 Restart Run
                </button>
              </>
            )}

            {/* Finished */}

            {isFinished &&
              !isVerifying &&
              !isVerified && (
                <>
                  <button
                    onClick={
                      handleVerify
                    }
                    className="w-full max-w-md rounded-2xl bg-emerald-600 px-8 py-4 text-lg font-bold text-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:bg-emerald-700 hover:shadow-lg active:scale-[0.98]"
                  >
                    ✅ Submit Run for Verification
                  </button>

                  <button
                    onClick={
                      handleRestartRun
                    }
                    className="w-full max-w-md rounded-2xl border-2 border-gray-200 bg-white px-8 py-4 text-lg font-bold text-gray-700 transition-all hover:border-red-300 hover:text-red-600 active:scale-[0.98]"
                  >
                    🔄 Restart Run
                  </button>
                </>
              )}

            {/* Verification */}

            {isVerifying && (
              <div className="w-full max-w-md rounded-2xl bg-blue-50 px-8 py-4 text-center font-semibold text-blue-700">
                🔍 Verifying your run...
              </div>
            )}

            {/* Verified */}

            {isVerified && (
              <>
                <button
                  onClick={() =>
                    navigate(
                      "/dashboard"
                    )
                  }
                  className="w-full max-w-md rounded-2xl bg-emerald-600 px-8 py-4 text-lg font-bold text-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:bg-emerald-700 hover:shadow-lg active:scale-[0.98]"
                >
                  🌱 View My Progress
                </button>

                <button
                  onClick={
                    handleReset
                  }
                  className="font-semibold text-emerald-600 transition hover:text-emerald-700"
                >
                  🏃 Start Another Run
                </button>
              </>
            )}

          </div>

        </section>

        {/* GPS Notice */}

        {!isVerified && (
          <section className="mt-8 rounded-3xl border border-emerald-100 bg-emerald-50 p-6 text-center">

            <div className="text-3xl">
              📍
            </div>

            <h2 className="mt-3 text-xl font-bold text-gray-900">
              Real GPS tracking is active
            </h2>

            <p className="mx-auto mt-2 max-w-2xl leading-relaxed text-gray-600">
              FasFas is tracking your
              actual movement using
              your device location.
            </p>

          </section>
        )}

      </div>
    </main>
  );
}

export default Run;