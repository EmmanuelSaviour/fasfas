function Features() {
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

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-gray-900">
            Why FasFas?
          </h2>

          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            FasFas is more than a running app. It is a platform that rewards
            consistency and helps people build lasting discipline through
            movement.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-gray-50 rounded-2xl p-8 shadow-sm hover:shadow-lg transition"
            >
              <div className="text-5xl mb-5">{feature.icon}</div>

              <h3 className="text-2xl font-semibold mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Features;