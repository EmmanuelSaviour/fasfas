import { useState } from "react";
import SectionTitle from "../ui/SectionTitle";

function HowItWorks() {
  const [selectedCard, setSelectedCard] = useState(null);

  const steps = [
    {
      icon: "📍",
      title: "Verify Run",
      description:
        "Complete your run with GPS verification to ensure every achievement is earned.",
    },
    {
      icon: "🔥",
      title: "Build Streak",
      description:
        "Every successful run extends your streak and keeps your momentum alive.",
    },
    {
      icon: "🌳",
      title: "Grow Your Tree",
      description:
        "Each verified run helps your Consistency Tree grow stronger.",
    },
    {
      icon: "🏆",
      title: "Earn Your Rank",
      description:
        "Move from Chaser to Stubborn through dedication and consistency.",
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

        <SectionTitle
          title="How It Works"
          subtitle="Four simple steps. One life-changing habit."
        />

        <div className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-8">

          {steps.map((step) => {
            const isSelected = selectedCard === step.title;

            return (
              <div
                key={step.title}
                onClick={() => handleCardClick(step.title)}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleCardClick(step.title);
                  }
                }}
                className={`relative cursor-pointer rounded-2xl bg-gray-50 p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl sm:p-7 lg:p-8 ${
                  isSelected
                    ? "-translate-y-2 shadow-xl ring-2 ring-emerald-500/40"
                    : ""
                }`}
              >
                <div className="mb-4 text-5xl sm:mb-5">
                  {step.icon}
                </div>

                <h3 className="mb-3 text-xl font-bold sm:text-2xl">
                  {step.title}
                </h3>

                <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                  {step.description}
                </p>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}

export default HowItWorks;