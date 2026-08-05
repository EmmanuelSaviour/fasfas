import SectionTitle from "../ui/SectionTitle";

function CommunityForest() {
 const trees = [
  {
    emoji: "🌱",
    name: "Sarah",
    rank: "Chaser",
  },
  {
    emoji: "🌿",
    name: "David",
    rank: "Runner",
  },
  {
    emoji: "🌳",
    name: "James",
    rank: "Tracker",
  },
  {
    emoji: "🌳✨",
    name: "Emex",
    rank: "Stubborn",
  },
  {
    emoji: "🌿",
    name: "Grace",
    rank: "Runner",
  },
  {
    emoji: "🌳",
    name: "Michael",
    rank: "Tracker",
  },
];

  return (
    <section className="py-20 bg-gradient-to-b from-emerald-50 to-white">
      <div className="max-w-7xl mx-auto px-6">

      <SectionTitle
        title="Every Tree Tells a Story"
        subtitle="Every member starts as a Chaser. Through consistency, their tree grows—and so does our forest."
       />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {trees.map((tree, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center"
            >
              <div className="text-7xl mb-4">
                {tree.emoji}
              </div>

             <div>
              <h3 className="text-xl font-bold">
                {tree.name}
              </h3>

              <p className="text-emerald-600 font-medium mt-2">
                {tree.rank}
             </p>
             </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default CommunityForest;