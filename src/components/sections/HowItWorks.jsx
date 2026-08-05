import SectionTitle from "../ui/SectionTitle";

function HowItWorks() {
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

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <SectionTitle
          title="How It Works"
          subtitle="Four simple steps. One life-changing habit."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div
              key={step.title}
              className="relative bg-gray-50 rounded-2xl p-8 shadow-sm hover:shadow-xl transition"
            >
              <div className="text-5xl mb-5">
                {step.icon}
              </div>

              <h3 className="text-2xl font-bold mb-3">
                {step.title}
              </h3>

              <p className="text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default HowItWorks;