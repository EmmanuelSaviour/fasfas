import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-slate-900 px-4 py-12 text-white sm:px-6 sm:py-14 md:px-8 md:py-16">

      <div className="mx-auto max-w-7xl">

        {/* ================= Footer Content ================= */}

        <div className="grid gap-10 sm:gap-12 md:grid-cols-3">

          {/* ================= Brand ================= */}

          <div>

            <h2 className="text-2xl font-bold text-emerald-400 sm:text-3xl">
              FasFas
            </h2>

            <p className="mt-4 max-w-md leading-7 text-gray-400 sm:mt-5">
              Keep Moving. Keep Growing.
              <br />
              A platform built to reward consistency and inspire lasting growth.
            </p>

          </div>

          {/* ================= Navigation ================= */}

          <div>

            <h3 className="mb-4 text-lg font-semibold sm:mb-5 sm:text-xl">
              Explore
            </h3>

            <ul className="space-y-3 text-gray-400">

              <li>
                <Link
                  to="/"
                  className="transition hover:text-white"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/about"
                  className="transition hover:text-white"
                >
                  About
                </Link>
              </li>

              <li>
                <Link
                  to="/#how-it-works"
                  className="transition hover:text-white"
                >
                  How It Works
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="transition hover:text-white"
                >
                  Contact
                </Link>
              </li>

            </ul>

          </div>

          {/* ================= CTA ================= */}

          <div>

            <h3 className="mb-4 text-lg font-semibold sm:mb-5 sm:text-xl">
              Ready to Grow?
            </h3>

            <p className="mb-5 max-w-md leading-7 text-gray-400 sm:mb-6">
              Plant your Consistency Tree today and begin your journey.
            </p>

            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-6 py-3 font-semibold transition-all duration-300 hover:bg-emerald-600 active:scale-95"
            >
              🌱 Plant Your Tree
            </Link>

          </div>

        </div>

        {/* ================= Copyright ================= */}

        <div className="mt-10 border-t border-slate-700 pt-6 text-center text-sm text-gray-500 sm:mt-14 sm:pt-8">
          © 2026 FasFas. All rights reserved.
        </div>

      </div>

    </footer>
  );
}

export default Footer;