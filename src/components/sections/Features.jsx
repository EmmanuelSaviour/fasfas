import { useState } from "react";
import SectionTitle from "../ui/SectionTitle";

function Features() {
  const [selectedCard, setSelectedCard] = useState(null);

  const features = [
    {
      icon: "🏃",
      title: "Movement",
      description:
        "Every journey begins with one step. FasFas celebrates every verified run.",
    },
    {
      icon: "🔥",
      title: "Consistency",
      description:
        "Progress comes from showing up regularly, not from being perfect.",
    },
    {
      icon: "🏅",
      title: "Earn Your Rank",
      description:
        "Climb from Chaser to Stubborn by staying committed to your journey.",
    },
    {
      icon: "🤝",
      title: "Community",
      description:
        "Join runners who motivate and inspire one another every day.",
    },
  ];

  const handleCardClick = (title) => {
    setSelectedCard((current) =>
      current === title ? null : title
    );
  };

  return (
    <section className="bg-white px-4 py-14 sm:px-6 sm:py-16 md:py-20">
      <div className="mx-auto max-w-7xl">

        {/* ================= Section Title ================= */}

        <SectionTitle
          title="Why FasFas?"
          subtitle="FasFas is more than a running app. It rewards consistency and helps people build lasting discipline through movement."
        />

        {/* ================= Feature Cards ================= */}

        <div className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-8">

          {features.map((feature) => {
            const isSelected = selectedCard === feature.title;

            return (
              <div
                key={feature.title}
                onClick={() => handleCardClick(feature.title)}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleCardClick(feature.title);
                  }
                }}
                className={`cursor-pointer rounded-2xl bg-gray-50 p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl sm:p-7 lg:p-8 ${
                  isSelected
                    ? "-translate-y-2 shadow-xl ring-2 ring-emerald-500/40"
                    : ""
                }`}
              >

                <div className="mb-4 text-5xl sm:mb-5">
                  {feature.icon}
                </div>

                <h3 className="mb-3 text-xl font-semibold sm:text-2xl">
                  {feature.title}
                </h3>

                <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                  {feature.description}
                </p>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}

export default Features;