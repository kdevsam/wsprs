import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Ghosts from "./components/Ghosts";
import ModeSelect from "./components/ModeSelect";
import TutorialPopup from "./components/Tutorial";

const Home = () => {
  const [showModeSelect, setShowModeSelect] = useState(false);
  const [showTutorialPopup, setShowTutorialPopup] = useState(false);
  const [coins, setCoins] = useState(0);
  const [dailyPlayed, setDailyPlayed] = useState(false);

  useEffect(() => {
    const storedCoins = parseInt(
      localStorage.getItem("wsprs-coins") || "0",
      10
    );
    setCoins(storedCoins);

    const hasSeenTutorial = localStorage.getItem("wsprs-tutorial-seen");
    if (!hasSeenTutorial) {
      setShowTutorialPopup(true);
    }

    const today = new Date();
    const todaySeed = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    const lastPlayed = localStorage.getItem("wsprs-last-played");

    if (lastPlayed === todaySeed) {
      setDailyPlayed(true);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black p-6 relative overflow-hidden">
      {/* Coins Top Right */}
      <div className="fixed top-4 right-6 text-white text-xl font-bold flex items-center gap-2 z-[999] pointer-events-none">
        <img
          src="/coin.png"
          alt="coin"
          className="w-7 h-7 object-contain animate-spin-slow"
        />{" "}
        {coins}
      </div>

      {/* Dreamy Background */}
      <motion.div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-black/30 blur-3xl animate-floatSlow" />
      <motion.div className="absolute inset-0 bg-gradient-to-tr from-blue-900/10 via-indigo-800/10 to-black/20 blur-2xl animate-floatSlower" />
      <Ghosts />

      {/* WSPRS Title */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: [1, 1.02, 1] }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
        className="text-6xl sm:text-7xl font-bold text-indigo-200 tracking-widest mb-12 drop-shadow-lg z-10"
        style={{ fontFamily: "'Mystery Quest', cursive" }}
      >
        WSPRS
      </motion.h1>

      {/* Play/Shop buttons */}
      {!showModeSelect && (
        <div className="flex flex-col items-center gap-6 p-8 rounded-2xl bg-gray-900/40 backdrop-blur-lg shadow-2xl z-10">
          {/* Play Button */}
          <button
            onClick={() => setShowModeSelect(true)}
            className="flex flex-col items-center gap-2 p-6 rounded-2xl bg-indigo-400/20 text-white transform transition-transform hover:scale-105 hover:brightness-110 shadow-lg backdrop-blur-md w-72"
          >
            <img src="/play.png" alt="Play" className="w-16 h-16 mb-2" />
            <span className="text-2xl font-bold">Play</span>
            <p className="text-sm opacity-70">Select your mode</p>
          </button>

          {/* Shop Button */}
          <button
            onClick={() => (window.location.href = "/shop")}
            className="flex flex-col items-center gap-2 p-6 rounded-2xl bg-green-400/20 text-white transform transition-transform hover:scale-105 hover:brightness-110 shadow-lg backdrop-blur-md w-72"
          >
            <img src="/shop.png" alt="Shop" className="w-16 h-16 mb-2" />
            <span className="text-2xl font-bold">Shop</span>
            <p className="text-sm opacity-70">Customize your journey</p>
          </button>
        </div>
      )}

      {/* ModeSelect */}
      {showModeSelect && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="z-20"
        >
          <ModeSelect
            dailyPlayed={dailyPlayed}
            onSelect={(mode) => {
              if (mode === "daily") {
                window.location.href = "/daily";
              } else if (mode === "practice") {
                window.location.href = "/practice";
              } else if (mode === "secret") {
                window.location.href = "/secret";
              }
            }}
            onBack={() => setShowModeSelect(false)}
          />
        </motion.div>
      )}

      {/* Tutorial Popup */}
      {showTutorialPopup && (
        <TutorialPopup onClose={() => setShowTutorialPopup(false)} />
      )}
    </div>
  );
};

export default Home;
