import { Link } from "react-router-dom";
import TreeCard from "../ui/TreeCard";

function Hero() {
  return (
    <section className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-700 px-4 py-12 text-white sm:px-6 sm:py-16 md:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-10">

        {/* ================= Left Side ================= */}

        <div className="min-w-0">

          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
            Keep Moving.
            <br />
            Keep Growing.
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-emerald-100 sm:text-lg md:text-xl">
            FasFas rewards consistency, not perfection.
            Every verified run helps your Consistency Tree grow.
          </p>

          {/* ================= Buttons ================= */}

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">

            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-center font-semibold text-emerald-700 shadow-lg transition duration-300 hover:scale-105"
            >
              🌱 Plant Your Tree
            </Link>

            <Link
              to="/about"
              className="inline-flex items-center justify-center rounded-xl border-2 border-white px-6 py-3 text-center font-semibold transition duration-300 hover:bg-white hover:text-emerald-700"
            >
              Learn More
            </Link>

          </div>

          {/* ================= Highlights ================= */}

          <div className="mt-8 grid grid-cols-1 gap-3 text-base text-emerald-100 sm:grid-cols-2 lg:flex lg:flex-wrap lg:gap-x-8 lg:gap-y-3">

            <div className="flex items-center gap-2">
              <span>🏃</span>
              <span>Reward Every Run</span>
            </div>

            <div className="flex items-center gap-2">
              <span>🔥</span>
              <span>Build Streaks</span>
            </div>

            <div className="flex items-center gap-2">
              <span>🌳</span>
              <span>Grow Your Tree</span>
            </div>

          </div>

        </div>

        {/* ================= Right Side ================= */}

        <div className="flex w-full justify-center lg:justify-end">
          <TreeCard />
        </div>

      </div>
    </section>
  );
}

export default Hero;