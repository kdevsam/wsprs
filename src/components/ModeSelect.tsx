const ModeSelect = ({
  dailyPlayed,
  onSelect,
  onBack,
}: {
  dailyPlayed: boolean;
  onSelect: (mode: "daily" | "stack" | "secret") => void;
  onBack: () => void;
}) => {
  return (
    <div className="flex flex-col items-center gap-8 mt-8">
      {/* Mode Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {/* Daily Puzzle */}
        <div
          className={`relative p-6 rounded-2xl shadow-2xl cursor-pointer border transform transition-transform hover:scale-105 ${
            dailyPlayed
              ? "bg-gray-700/50 border-gray-600 text-gray-400"
              : "bg-indigo-500/20 border-indigo-400 text-white"
          }`}
          onClick={() => !dailyPlayed && onSelect("daily")}
        >
          <img
            src="/daily.png"
            alt="Daily"
            className="w-20 h-20 mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold mb-2 text-center">Tiles</h2>
          <p className="text-center opacity-80 text-sm">
            {dailyPlayed ? "Already Played Today" : "One attempt per day"}
          </p>
          {dailyPlayed && (
            <div className="absolute top-2 right-2 text-xs bg-red-600 px-2 py-1 rounded-full">
              1/1
            </div>
          )}
          {!dailyPlayed && (
            <div className="absolute top-2 right-2 text-xs bg-blue-600 px-2 py-1 rounded-full">
              0/1
            </div>
          )}
        </div>

        {/* Stack Mode */}
        <div
          className="p-6 rounded-2xl shadow-2xl cursor-pointer bg-green-500/20 border border-green-400 text-white transform transition-transform hover:scale-105"
          //   onClick={() => onSelect("stack")}
        >
          <img
            src="/stack.png"
            alt="Stack"
            className="w-20 h-20 mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold mb-2 text-center">Stacks</h2>
          <p className="text-center opacity-80 text-sm">Unlimited retries</p>
        </div>

        {/* Secret Mode */}
        <div className="p-6 rounded-2xl shadow-2xl cursor-not-allowed bg-gray-800/50 border border-gray-700 text-gray-400 transform transition-transform">
          <img
            src="/secret.png"
            alt="Secret"
            className="w-20 h-20 mx-auto mb-4 opacity-40"
          />
          <h2 className="text-2xl font-bold mb-2 text-center">Secret Mode</h2>
          <p className="text-center opacity-60 text-sm">Locked</p>
        </div>
      </div>

      {/* Back Button */}
      <button
        onClick={onBack}
        className="mt-8 px-8 py-4 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-semibold shadow-lg transition-all transform hover:scale-105"
      >
        Back
      </button>
    </div>
  );
};

export default ModeSelect;
