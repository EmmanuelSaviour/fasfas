import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

function Community() {
  return (
    <main className="min-h-screen bg-white">

      {/* Navigation */}
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-blue-600 px-6 py-24 text-white">
        <div className="mx-auto max-w-6xl text-center">

          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-100">
            The FasFas Community
          </p>

          <h1 className="text-5xl font-extrabold leading-tight md:text-6xl">
            Your run is personal.
            <br />
            Your growth is shared.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-emerald-100 md:text-xl">
            FasFas brings runners together through consistency,
            progress, and the simple goal of keeping each other moving.
          </p>

        </div>
      </section>

      {/* Community Vision */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">

          <div className="grid gap-12 md:grid-cols-2 md:items-center">

            {/* Text */}
            <div>

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Grow Together
              </p>

              <h2 className="mt-3 text-4xl font-bold leading-tight text-gray-900">
                Every runner adds
                <br />
                something to the forest.
              </h2>

              <p className="mt-6 text-lg leading-relaxed text-gray-600">
                FasFas isn't only about your individual progress.
                It's about creating a community where everyone's
                consistency contributes to something bigger.
              </p>

              <p className="mt-4 text-lg leading-relaxed text-gray-600">
                As members run, grow their trees, and progress through
                the FasFas ranks, the community grows alongside them.
              </p>

            </div>

            {/* Forest Card */}
            <Link
              to="/community/forest"
              className="group block rounded-3xl border border-emerald-100 bg-emerald-50 p-10 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >

              <div className="text-7xl transition-transform duration-300 group-hover:scale-105">
                🌳🌳🌳
              </div>

              <h3 className="mt-6 text-2xl font-bold text-gray-900">
                The Community Forest
              </h3>

              <p className="mt-4 leading-relaxed text-gray-600">
                Imagine seeing the collective growth of every FasFas
                member in one place. Every consistent runner helps
                build the forest.
              </p>

              <div className="mt-8 flex items-center gap-3">

                <div className="h-3 flex-1 overflow-hidden rounded-full bg-emerald-200">
                  <div className="h-full w-2/3 rounded-full bg-emerald-600"></div>
                </div>

                <span className="text-sm font-semibold text-emerald-700">
                  Growing
                </span>

              </div>

              <div className="mt-6 text-sm font-bold text-emerald-700 transition-all duration-300 group-hover:text-emerald-800">
                Explore the Forest →
              </div>

            </Link>

          </div>

        </div>
      </section>

      {/* Community Values */}
      <section className="bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-6xl text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Built Together
          </p>

          <h2 className="mt-3 text-4xl font-bold text-gray-900">
            What brings us together?
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-3">

            <div className="rounded-2xl bg-white p-8 shadow-sm">

              <div className="text-4xl">
                🏃
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                Show Up
              </h3>

              <p className="mt-3 leading-relaxed text-gray-600">
                Progress begins with showing up and taking the next step.
              </p>

            </div>

            <div className="rounded-2xl bg-white p-8 shadow-sm">

              <div className="text-4xl">
                🤝
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                Support Others
              </h3>

              <p className="mt-3 leading-relaxed text-gray-600">
                A strong community makes consistency easier and more enjoyable.
              </p>

            </div>

            <div className="rounded-2xl bg-white p-8 shadow-sm">

              <div className="text-4xl">
                🌱
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                Grow Together
              </h3>

              <p className="mt-3 leading-relaxed text-gray-600">
                Individual progress becomes something bigger when we grow together.
              </p>

            </div>

          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">

        <div className="mx-auto max-w-4xl rounded-3xl bg-emerald-600 px-8 py-14 text-center text-white shadow-xl">

          <h2 className="text-4xl font-bold">
            Ready to join the movement?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-emerald-100">
            Plant your tree, start your journey, and become part of
            the FasFas community.
          </p>

          <Link
            to="/register"
            className="mt-8 inline-block rounded-xl bg-white px-7 py-3.5 font-semibold text-emerald-600 shadow-md transition-all duration-300 hover:scale-105 hover:bg-emerald-50"
          >
            🌱 Plant Your Tree
          </Link>

        </div>

      </section>

    </main>
  );
}

export default Community;