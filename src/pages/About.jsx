import { Link } from "react-router-dom";

function About() {
  return (
    <main className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-blue-600 px-6 py-24 text-white">
        <div className="mx-auto max-w-6xl text-center">

          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-100">
            About FasFas
          </p>

          <h1 className="text-5xl font-extrabold leading-tight md:text-6xl">
            Movement becomes
            <br />
            consistency.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-emerald-100 md:text-xl">
            FasFas is built to make running more than just a workout.
            We turn consistent movement into progress you can see,
            track, and grow.
          </p>

        </div>
      </section>

      {/* Our Philosophy */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">

          <div className="grid gap-12 md:grid-cols-2 md:items-center">

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Our Philosophy
              </p>

              <h2 className="mt-3 text-4xl font-bold leading-tight text-gray-900">
                Keep Moving.
                <br />
                Keep Growing.
              </h2>

              <p className="mt-6 text-lg leading-relaxed text-gray-600">
                FasFas is designed around one simple idea:
                consistency matters more than perfection.
              </p>

              <p className="mt-4 text-lg leading-relaxed text-gray-600">
                Every verified run is another step forward.
                Over time, those steps build streaks, unlock ranks,
                and help your Consistency Tree grow.
              </p>
            </div>

            {/* Growth Card */}
            <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-10 shadow-sm">

              <div className="text-7xl">
                🌱
              </div>

              <h3 className="mt-6 text-2xl font-bold text-gray-900">
                Progress you can see.
              </h3>

              <p className="mt-4 leading-relaxed text-gray-600">
                Your journey isn't just about numbers.
                FasFas gives your consistency a visual identity
                through your growing tree and progression through
                the FasFas ranks.
              </p>

            </div>

          </div>

        </div>
      </section>

      {/* What FasFas Stands For */}
      <section className="bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-6xl text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            What We Stand For
          </p>

          <h2 className="mt-3 text-4xl font-bold text-gray-900">
            More than running.
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-3">

            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <div className="text-4xl">🏃</div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                Movement
              </h3>

              <p className="mt-3 leading-relaxed text-gray-600">
                Every run is a step toward becoming more consistent.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <div className="text-4xl">🔥</div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                Consistency
              </h3>

              <p className="mt-3 leading-relaxed text-gray-600">
                Small actions repeated over time create meaningful progress.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <div className="text-4xl">🌳</div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                Growth
              </h3>

              <p className="mt-3 leading-relaxed text-gray-600">
                Your progress becomes something you can actually see.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl rounded-3xl bg-emerald-600 px-8 py-14 text-center text-white shadow-xl">

          <h2 className="text-4xl font-bold">
            Ready to start growing?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-emerald-100">
            Start your FasFas journey and turn every verified run
            into another step forward.
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

export default About;