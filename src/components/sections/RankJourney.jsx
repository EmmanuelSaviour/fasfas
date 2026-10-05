import { useState } from "react";
import SectionTitle from "../ui/SectionTitle";

function RankJourney() {
  const [selectedCard, setSelectedCard] = useState(null);

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

  const handleCardClick = (title) => {
    setSelectedCard((current) =>
      current === title ? null : title
    );
  };

  return (
    <section className="bg-gray-100 px-4 py-14 sm:px-6 sm:py-16 md:py-20">
      <div className="mx-auto max-w-7xl">

        <SectionTitle
          title="Your Journey"
          subtitle="Every verified run moves you one step closer to your next rank."
        />

        <div className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-8">

          {ranks.map((rank) => {
            const isSelected = selectedCard === rank.title;

            return (
              <div
                key={rank.title}
                onClick={() => handleCardClick(rank.title)}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleCardClick(rank.title);
                  }
                }}
                className={`cursor-pointer rounded-2xl border-t-4 bg-white p-6 text-center shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-xl sm:p-7 lg:p-8 ${rank.color} ${
                  isSelected
                    ? "-translate-y-2 shadow-xl ring-2 ring-emerald-500/40"
                    : ""
                }`}
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
            );
          })}

        </div>
      </div>
    </section>
  );
}

export default RankJourney;