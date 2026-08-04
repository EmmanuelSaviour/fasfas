function TreeCard() {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-10 border border-white/20 shadow-2xl max-w-md">

      <div className="text-center">

        <div className="text-8xl">
          🌱
        </div>

        <h2 className="text-3xl font-bold mt-6">
          Your Consistency Tree
        </h2>

        <p className="mt-4 text-emerald-100">
          Every verified run helps your tree grow.
        </p>

        <div className="mt-8">

          <div className="bg-white/20 rounded-full h-3 overflow-hidden">

            <div className="bg-white h-full w-1/4 rounded-full"></div>

          </div>

          <p className="mt-3 text-sm">
            Growth Progress • 25%
          </p>

        </div>

      </div>

    </div>
  );
}

export default TreeCard;