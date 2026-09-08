import SectionTitle from "../ui/SectionTitle";

function RankJourney() {
  const ranks = [
    {
      emoji: "🟢",
      title: "Chaser",
      runs: "0 - 9 Runs",
      color: "border-green-500",
    },
    {
      emoji: "🔵",
      title: "Runner",
      runs: "10 - 19 Runs",
      color: "border-blue-500",
    },
    {
      emoji: "🟣",
      title: "Tracker",
      runs: "20 - 39 Runs",
      color: "border-purple-500",
    },
    {
      emoji: "🟡",
      title: "Stubborn",
      runs: "40+ Runs",
      color: "border-yellow-400",
    },
  ];

  return (
    <section className="bg-gray-100 px-4 py-14 sm:px-6 sm:py-16 md:py-20">
      <div className="mx-auto max-w-7xl">

        {/* ================= Section Title ================= */}

        <SectionTitle
          title="Your Journey"
          subtitle="Every verified run moves you one step closer to your next rank."
        />

        {/* ================= Rank Cards ================= */}

        <div className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-8">

          {ranks.map((rank) => (
            <div
              key={rank.title}
              className={`rounded-2xl border-t-4 bg-white p-6 text-center shadow-md transition duration-300 hover:-translate-y-2 sm:p-7 lg:p-8 ${rank.color}`}
            >

              <div className="mb-4 text-5xl sm:text-6xl">
                {rank.emoji}
              </div>

              <h3 className="text-xl font-bold sm:text-2xl">
                {rank.title}
              </h3>

              <p className="mt-2 text-sm text-gray-600 sm:mt-3 sm:text-base">
                {rank.runs}
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default RankJourney;