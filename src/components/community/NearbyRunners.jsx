
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import API_URL from "../../config/api";

function NearbyRunners() {
  const { user, isAuthenticated } = useAuth();

  const [enabled, setEnabled] = useState(false);
  const [radius, setRadius] = useState(5);
  const [runners, setRunners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const token = localStorage.getItem("fasfas_token");

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const getLocation = () =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Your browser does not support location sharing."));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          reject(
            new Error(
              "Location permission was denied or unavailable. Please enable location access in your browser."
            )
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        }
      );
    });

  
const loadRunners = useCallback(async () => {
  if (!token || !enabled) return;

  setLoading(true);
  setError("");

  try {
    // Get the runner's latest location.
    const coordinates = await getLocation();

    // Save the updated coordinates securely.
    const locationResponse = await fetch(
      `${API_URL}/api/nearby/location`,
      {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify(coordinates),
      }
    );

    const locationData = await locationResponse.json();

    if (!locationResponse.ok || !locationData.success) {
      throw new Error(
        locationData.message || "Unable to update your location."
      );
    }

    // Retrieve nearby runners using the updated location.
    const response = await fetch(
      `${API_URL}/api/nearby/runners?radius=${radius}`,
      {
        headers: authHeaders,
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Unable to load nearby runners."
      );
    }

    setRunners(data.runners || []);
  } catch (err) {
    setError(err.message);
    setRunners([]);
  } finally {
    setLoading(false);
  }
}, [token, enabled, radius]);

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    let cancelled = false;

    const loadSettings = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/nearby/settings`,
          {
            headers: authHeaders,
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load location settings.");
        }

        if (!cancelled) {
          setEnabled(data.locationSharingEnabled === true);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      }
    };

    loadSettings();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, token]);

  useEffect(() => {
    if (enabled) loadRunners();
  }, [enabled, radius, loadRunners]);

  const enableSharing = async () => {
    setSaving(true);
    setError("");
    setNotice("");

    try {
      // Ask permission before enabling sharing.
      const coordinates = await getLocation();

      const settingResponse = await fetch(
        `${API_URL}/api/nearby/location-sharing`,
        {
          method: "PATCH",
          headers: authHeaders,
          body: JSON.stringify({ enabled: true }),
        }
      );

      const settingData = await settingResponse.json();

      if (!settingResponse.ok || !settingData.success) {
        throw new Error(
          settingData.message || "Unable to enable location sharing."
        );
      }

      const locationResponse = await fetch(
        `${API_URL}/api/nearby/location`,
        {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify(coordinates),
        }
      );

      const locationData = await locationResponse.json();

      if (!locationResponse.ok || !locationData.success) {
        // Roll back the setting if saving the location fails.
        await fetch(`${API_URL}/api/nearby/location-sharing`, {
          method: "PATCH",
          headers: authHeaders,
          body: JSON.stringify({ enabled: false }),
        });

        throw new Error(
          locationData.message || "Unable to save your location."
        );
      }

      setEnabled(true);
      setNotice("Location sharing is on. You can switch it off anytime.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const disableSharing = async () => {
    setSaving(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch(
        `${API_URL}/api/nearby/location-sharing`,
        {
          method: "PATCH",
          headers: authHeaders,
          body: JSON.stringify({ enabled: false }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to disable location sharing.");
      }

      setEnabled(false);
      setRunners([]);
      setNotice("Location sharing is off. Your saved coordinates were cleared.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <section className="bg-emerald-50 px-6 py-16">
        <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 text-center shadow-sm">
          <div className="text-4xl">📍</div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Find Runners Near You
          </h2>
          <p className="mt-3 text-gray-600">
            Log in to discover nearby FasFas runners. Location sharing is optional.
          </p>
          <a
            href="/login"
            className="mt-6 inline-block rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            Log In
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-emerald-50 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Run Together
            </p>

            <h2 className="mt-3 text-4xl font-extrabold text-gray-900">
              Runners Near You
            </h2>

            <p className="mt-4 leading-relaxed text-gray-600">
              Discover other FasFas members around you. Connect with nearby
              runners, encourage one another, and keep moving together.
            </p>

            <div className="mt-7 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-gray-900">
                    Share my location
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Optional and off by default.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={enabled ? disableSharing : enableSharing}
                  disabled={saving}
                  aria-pressed={enabled}
                  className={`relative h-8 w-14 shrink-0 rounded-full transition ${
                    enabled ? "bg-emerald-600" : "bg-gray-300"
                  } ${saving ? "cursor-wait opacity-60" : ""}`}
                >
                  <span
                    className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ${
                      enabled ? "left-7" : "left-1"
                    }`}
                  />
                </button>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-gray-500">
                Your exact coordinates are used privately to calculate
                distances. Other runners only see an approximate distance.
                Turning sharing off clears your saved location.
              </p>

              {enabled && (
                <div className="mt-5 border-t border-gray-100 pt-5">
                  <label
                    htmlFor="nearby-radius"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Search radius
                  </label>

                  <select
                    id="nearby-radius"
                    value={radius}
                    onChange={(event) => setRadius(Number(event.target.value))}
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 outline-none focus:border-emerald-500"
                  >
                    <option value={2}>Within 2 km</option>
                    <option value={5}>Within 5 km</option>
                    <option value={10}>Within 10 km</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Nearby Community
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {enabled ? `Runners within ${radius} km` : "Your local running circle"}
                </p>
              </div>

              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                {enabled ? runners.length : "—"}
              </span>
            </div>

            {!enabled && (
              <div className="py-14 text-center">
                <div className="text-5xl">🌍</div>
                <h4 className="mt-5 text-lg font-bold text-gray-900">
                  Your running circle starts here
                </h4>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-gray-500">
                  Turn on location sharing to discover FasFas runners near you.
                  You stay in control of your location.
                </p>
              </div>
            )}

            {enabled && loading && (
              <p className="py-12 text-center text-gray-500">
                Finding runners near you...
              </p>
            )}

            {enabled && !loading && !error && runners.length === 0 && (
              <div className="py-12 text-center">
                <div className="text-5xl">🏃</div>
                <h4 className="mt-4 font-bold text-gray-900">
                  No nearby runners yet
                </h4>
                <p className="mt-2 text-sm text-gray-500">
                  Be the first in your area. Other runners may join soon.
                </p>
              </div>
            )}

            {enabled && !loading && runners.length > 0 && (
              <div className="mt-6 space-y-3">
                {runners.map((runner) => (
                  <div
                    key={runner.id}
                    className="flex items-center gap-4 rounded-2xl border border-gray-100 p-4"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-100 text-xl">
                      {runner.avatar ? (
                        <img
                          src={runner.avatar}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        "🏃"
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-gray-900">
                        {runner.name || "FasFas Runner"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {runner.distanceKm} km away
                      </p>
                    </div>

                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Nearby
                    </span>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            {notice && (
              <div
                role="status"
                className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700"
              >
                {notice}
              </div>
            )}

            {enabled && (
              <button
                type="button"
                onClick={loadRunners}
                disabled={loading}
                className="mt-6 w-full rounded-xl border border-emerald-200 px-5 py-3 font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-50"
              >
                {loading ? "Refreshing..." : "Refresh Nearby Runners"}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default NearbyRunners;
