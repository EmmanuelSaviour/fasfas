import TreeCard from "../ui/TreeCard";
import Button from "../ui/Button";
function Hero() {
  return (
    <section className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-blue-600 text-white min-h-[90vh] flex items-center">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

        {/* Left Side */}
        <div>
          <h1 className="text-6xl font-extrabold leading-tight">
            Keep Moving.
            <br />
            Keep Growing.
          </h1>

          <p className="mt-6 text-xl max-w-2xl text-emerald-100">
            FasFas rewards consistency, not perfection.
            Every verified run helps your Consistency Tree grow.
          </p>

          <div className="mt-10 flex gap-4">
            <button className="bg-white text-emerald-600 px-6 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition duration-300">
              Start Your Journey
            </button>

            <button className="border-2 border-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-emerald-600 transition duration-300">
              Learn More
            </button>
          </div>

          <div className="mt-12 flex flex-wrap gap-6 text-lg">
            <span>🏃 Reward Every Run</span>
            <span>🔥 Build Streaks</span>
            <span>🌳 Grow Your Tree</span>
          </div>
        </div>

 
        {/* Right Side */}
        <div className="flex justify-center">
          <TreeCard />
        </div>

      </div>
    </section>
  );
}

export default Hero;