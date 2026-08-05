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
    <section className="py-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-6">

        <SectionTitle
        title="Your Journey"
        subtitle="Every verified run moves you one step closer to your next rank."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {ranks.map((rank) => (
            <div
              key={rank.title}
              className={`bg-white border-t-4 ${rank.color} rounded-2xl shadow-md p-8 text-center hover:-translate-y-2 transition`}
            >
              <div className="text-6xl mb-4">
                {rank.emoji}
              </div>

              <h3 className="text-2xl font-bold">
                {rank.title}
              </h3>

              <p className="text-gray-600 mt-3">
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