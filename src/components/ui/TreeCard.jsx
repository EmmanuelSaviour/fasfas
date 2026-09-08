import { Link } from "react-router-dom";

function TreeCard() {
  return (
    <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl sm:p-8">

      {/* Tree */}

      <div className="mb-5 text-7xl sm:text-8xl">
        🌱
      </div>

      {/* Rank */}

      <h2 className="text-2xl font-bold text-emerald-700">
        Chaser
      </h2>

      {/* Message */}

      <p className="mx-auto mt-3 max-w-xs leading-relaxed text-gray-500">
        Every forest begins with one tree.
        <br />
        Start your journey and watch yours grow.
      </p>

      {/* Divider */}

      <div className="my-6 h-px bg-gray-200"></div>

      {/* Minimal Journey Message */}

      <p className="text-sm font-medium text-gray-600">
        Your journey starts with one run.
      </p>

      {/* Button */}

      <Link
        to="/login"
        className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:bg-emerald-700 hover:shadow-lg active:scale-95"
      >
        🌱 Begin Today
      </Link>

    </div>
  );
}

export default TreeCard;