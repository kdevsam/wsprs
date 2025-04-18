import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Ghosts from "./components/Ghosts";
import ModeSelect from "./components/ModeSelect";
import DailyTutorial from "./components/DailyTutorial";
import StackTutorial from "./components/StackTutorial";
import SecretTutorial from "./components/SecretTutorial";

const Home = () => {
  const [showModeSelect, setShowModeSelect] = useState(false);
  const [showTutorialPopup, setShowTutorialPopup] = useState(false);
  const [pendingMode, setPendingMode] = useState<
    "daily" | "stack" | "secret" | null
  >(null);
  const [coins, setCoins] = useState(0);
  const [dailyPlayed, setDailyPlayed] = useState(false);

  useEffect(() => {
    const storedCoins = parseInt(
      localStorage.getItem("wsprs-coins") || "0",
      10
    );
    setCoins(storedCoins);

    const today = new Date();
    const todaySeed = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    const lastPlayed = localStorage.getItem("wsprs-last-played");

    if (lastPlayed === todaySeed) {
      setDailyPlayed(true);
    }
  }, []);

  const handleModeSelect = (mode: "daily" | "stack" | "secret") => {
    const tutorialKey = `wsprs-tutorial-${mode}`;
    const hasSeenTutorial = localStorage.getItem(tutorialKey);

    if (!hasSeenTutorial) {
      setPendingMode(mode); // Save mode to launch after tutorial
      setShowTutorialPopup(true); // Show tutorial popup
    } else {
      navigateToMode(mode);
    }
  };

  const navigateToMode = (mode: "daily" | "stack" | "secret") => {
    if (mode === "daily") {
      window.location.href = "/daily";
    } else if (mode === "stack") {
      window.location.href = "/stack";
    } else if (mode === "secret") {
      window.location.href = "/secret";
    }
  };

  const handleCloseTutorial = () => {
    if (pendingMode) {
      const tutorialKey = `wsprs-tutorial-${pendingMode}`;
      localStorage.setItem(tutorialKey, "true"); // Mark this tutorial as seen
      navigateToMode(pendingMode);
      setPendingMode(null);
    }
    setShowTutorialPopup(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black p-6 relative overflow-hidden">
      {/* Coins Top Right */}
      <div className="fixed top-4 right-6 text-white text-xl font-bold font-dreamy flex items-center gap-2 z-[999] pointer-events-none">
        <img
          src="/coin.png"
          alt="coin"
          className="w-7 h-7 object-contain animate-spin-slow"
        />{" "}
        {coins}
      </div>

      {/* Background */}
      <motion.div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-black/30 blur-3xl animate-floatSlow" />
      <motion.div className="absolute inset-0 bg-gradient-to-tr from-blue-900/10 via-indigo-800/10 to-black/20 blur-2xl animate-floatSlower" />
      <Ghosts />

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: [1, 1.02, 1] }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
        className="text-6xl sm:text-7xl font-bold text-indigo-200 tracking-widest mb-12 drop-shadow-lg z-10"
        style={{ fontFamily: "'Mystery Quest', cursive" }}
      >
        WSPRS
      </motion.h1>

      {/* Buttons or ModeSelect */}
      {/* Play/Shop buttons */}
      {!showModeSelect ? (
        <div className="flex gap-12 z-10">
          <button
            onClick={() => setShowModeSelect(true)}
            className="group relative w-28 h-28 rounded-full bg-indigo-400/10 hover:bg-indigo-400/20 border border-indigo-400/20 text-white flex flex-col items-center justify-center shadow-xl backdrop-blur-md hover:scale-105 transition-all"
          >
            <img src="/play.png" alt="Play" className="w-10 h-10 mb-1" />
            <span className="text-sm font-semibold tracking-wider">Play</span>
          </button>

          <button
            onClick={() => (window.location.href = "/shop")}
            className="group relative w-28 h-28 rounded-full bg-green-400/10 hover:bg-green-400/20 border border-green-400/20 text-white flex flex-col items-center justify-center shadow-xl backdrop-blur-md hover:scale-105 transition-all"
          >
            <img src="/shop.png" alt="Shop" className="w-10 h-10 mb-1" />
            <span className="text-sm font-semibold tracking-wider">Shop</span>
          </button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <ModeSelect
            dailyPlayed={dailyPlayed}
            onSelect={handleModeSelect}
            onBack={() => setShowModeSelect(false)}
          />
        </motion.div>
      )}

      {/* Tutorials */}
      {showTutorialPopup && pendingMode === "daily" && (
        <DailyTutorial onClose={handleCloseTutorial} />
      )}
      {showTutorialPopup && pendingMode === "stack" && (
        <StackTutorial onClose={handleCloseTutorial} />
      )}
      {showTutorialPopup && pendingMode === "secret" && (
        <SecretTutorial onClose={handleCloseTutorial} />
      )}
    </div>
  );
};

export default Home;
