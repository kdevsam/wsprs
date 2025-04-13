import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TileGrid from "./components/TileGrid";
import SpiritParticles from "./components/SpiritParticles";
import Ghosts from "./components/Ghosts";
import Chest from "./components/Chest";

const emojiList = [
  "🐱",
  "👻",
  "🏀",
  "🌙",
  "🎵",
  "💨",
  "🍔",
  "🚗",
  "🌵",
  "🐸",
  "🍕",
  "🎲",
  "🕹️",
  "🎯",
  "🚀",
  "🔥",
];

const initialTiles = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  icon: emojiList[i],
  pulsing: false,
  position: i,
  clicked: false,
  disabled: false,
  blowaway: false,
  vanished: false,
}));

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [coins, setCoins] = useState(0);
  const [showTutorialPopup, setShowTutorialPopup] = useState(false);
  const [tiles, setTiles] = useState(initialTiles);
  const [whisperedTiles, setWhisperedTiles] = useState<number[]>([]);
  const [whisperStarted, setWhisperStarted] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [lost, setLost] = useState(false);
  const [won, setWon] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [preparingDone, setPreparingDone] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [showChest, setShowChest] = useState(false);

  const getTodaySeed = () => {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  };
  const [dailyPlayed, setDailyPlayed] = useState(false);
  const [todaySeed, setTodaySeed] = useState(getTodaySeed());
  const [lastResult, setLastResult] = useState<"won" | "lost" | null>(null);

  useEffect(() => {
    const storedCoins = parseInt(
      localStorage.getItem("wsprs-coins") || "0",
      10
    );
    setCoins(storedCoins);
  }, []);
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem("wsprs-tutorial-seen");
    if (!hasSeenTutorial) {
      setShowTutorialPopup(true);
    }
    const stored = localStorage.getItem("wsprs-last-played");
    const storedResult = localStorage.getItem("wsprs-last-result");

    if (stored === todaySeed) {
      if (won || lost) {
        setTimeout(() => {
          setDailyPlayed(true);
          if (storedResult === "won" || storedResult === "lost") {
            setLastResult(storedResult);
          }
        }, 5000);
      } else {
        setDailyPlayed(true);
        if (storedResult === "won" || storedResult === "lost") {
          setLastResult(storedResult);
        }
      }
    }
  }, [todaySeed, won, lost]);

  useEffect(() => {
    if (dailyPlayed) {
      const interval = setInterval(() => {
        const now = new Date();
        const midnight = new Date();
        midnight.setHours(24, 0, 0, 0);
        const diff = Math.floor((midnight.getTime() - now.getTime()) / 1000);
        setSecondsLeft(diff);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [dailyPlayed]);

  const addCoins = (amount: number) => {
    setCoins((prev) => {
      const newCoins = prev + amount;
      localStorage.setItem("wsprs-coins", newCoins.toString());
      return newCoins;
    });
  };

  const formatTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const handleTileClick = (id: number) => {
    if (!gameStarted || gameOver) return;
    const clickedTile = tiles.find((tile) => tile.id === id);
    if (!clickedTile || clickedTile.disabled) return;

    if (whisperedTiles.includes(id)) {
      const newWhispered = whisperedTiles.filter((tileId) => tileId !== id);
      setWhisperedTiles(newWhispered);
      const updatedTiles = tiles.map((tile) =>
        tile.id === id ? { ...tile, clicked: true, disabled: true } : tile
      );
      setTiles(updatedTiles);

      if (newWhispered.length === 0) {
        setGameOver(true);
        setWon(true);
        setTimeout(() => {
          setShowChest(true); // 🧳 Show Chest instead of daily
        }, 2000);

        // setTimeout(() => {
        //   setTiles((prev) => prev.map((tile) => ({ ...tile, vanished: true })));
        // }, 2000);
        localStorage.setItem("wsprs-last-played", todaySeed);
        localStorage.setItem("wsprs-last-result", "won");
      }
    } else {
      setTiles(
        tiles.map((tile) => (tile.id === id ? { ...tile, wrong: true } : tile))
      );
      setGameOver(true);
      setLost(true);
      setTimeout(() => {
        setTiles((prev) => prev.map((tile) => ({ ...tile, blowaway: true })));
      }, 1500);
      setTimeout(() => {
        // optional fade-out later
      }, 2500);
      localStorage.setItem("wsprs-last-played", todaySeed);
      localStorage.setItem("wsprs-last-result", "lost");
    }
  };

  const shuffleTiles = () => {
    const shuffled = [...tiles]
      .sort(() => Math.random() - 0.5)
      .map((tile, index) => ({ ...tile, position: index }));
    setTiles(shuffled);
  };

  const startWhisperPhase = async () => {
    if (dailyPlayed) {
      return;
    }

    setPreparing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setPreparingDone(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setPreparing(false);
    setPreparingDone(false);

    const newTiles = [...tiles];
    const numberOfPulses = 5;
    const randomIndexes = [...Array(newTiles.length).keys()]
      .sort(() => Math.random() - 0.5)
      .slice(0, numberOfPulses);

    for (let i = 0; i < randomIndexes.length; i++) {
      const index = randomIndexes[i];
      newTiles[index].pulsing = true;
      setTiles([...newTiles]);
      await new Promise((resolve) => setTimeout(resolve, 1300));
      newTiles[index].pulsing = false;
      setTiles([...newTiles]);
    }

    const previewTiles = newTiles.map((tile) => ({
      ...tile,
      preview: randomIndexes.includes(tile.id),
    }));
    setTiles(previewTiles);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setTiles(previewTiles.map((tile) => ({ ...tile, preview: false })));

    shuffleTiles();
    setWhisperedTiles(randomIndexes);
    setGameStarted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col items-center justify-center p-6">
      <div className="fixed top-4 right-6 text-white text-xl font-bold font-dreamy flex items-center gap-2 z-[999] pointer-events-none">
        <img
          src="/coin.png"
          alt="coin"
          className="w-7 h-7 object-contain animate-spin-slow"
        />{" "}
        {coins}
      </div>
      {/* Splash screen */}
      {showSplash && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-gray-950 via-black to-gray-950 z-50"
        >
          {/* Dream Mist Layers */}
          <motion.div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-black/30 blur-3xl animate-floatSlow" />
          <motion.div className="absolute inset-0 bg-gradient-to-tr from-blue-900/10 via-indigo-800/10 to-black/20 blur-2xl animate-floatSlower" />
          <Ghosts />
          {/* WSPRS Title */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: [1, 1.02, 1] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="text-6xl sm:text-7xl font-bold text-indigo-200 tracking-widest mb-12 drop-shadow-lg"
            style={{ fontFamily: "'Mystery Quest', cursive" }} // <--- ADD THIS
          >
            WSPRS
          </motion.h1>

          {/* Animated Floating Menu */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className="flex flex-col items-center gap-6 p-8 rounded-2xl bg-gray-900/40 border border-indigo-500/30 backdrop-blur-lg shadow-2xl"
          >
            {/* Play Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowSplash(false);
                setTimeout(() => startWhisperPhase(), 200);
              }}
              className="flex items-center gap-4 w-72 justify-center px-8 py-5 rounded-2xl bg-gradient-to-br from-indigo-400 via-indigo-500 to-indigo-600 hover:brightness-110 text-white text-3xl font-semibold shadow-lg backdrop-blur-md transition-all"
            >
              <img src="/play.png" alt="Play" className="w-16 h-16" />
              <span>Play</span>
            </motion.button>

            {/* Shop Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                window.location.href = "/shop";
              }}
              className="flex items-center gap-4 w-72 justify-center px-8 py-5 rounded-2xl bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 hover:brightness-110 text-white text-3xl font-semibold shadow-lg backdrop-blur-md transition-all"
            >
              <img src="/shop.png" alt="Shop" className="w-16 h-16" />
              <span>Shop</span>
            </motion.button>
          </motion.div>
        </motion.div>
      )}

      {showTutorialPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md z-50"
        >
          <div className="bg-gray-900/90 p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm text-center space-y-4">
            <h2 className="text-3xl font-bold text-white tracking-wide">
              How to Play
            </h2>
            <p className="text-white text-opacity-80">
              Remember the tiles that pulse...
            </p>
            <p className="text-white text-opacity-80">
              After the whispers fade, find them again.
            </p>
            <p className="text-white text-opacity-80">
              But beware... one wrong choice ends your journey.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowTutorialPopup(false);
                localStorage.setItem("wsprs-tutorial-seen", "true");
              }}
              className="mt-6 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md transition-all"
            >
              Got It
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Mist background */}
      <motion.div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-gray-800/40 via-gray-900/30 to-black/40 blur-2xl animate-floatSlow z-0" />
      <motion.div className="pointer-events-none absolute inset-0 bg-gradient-to-bl from-gray-700/30 via-gray-800/20 to-black/30 blur-3xl animate-floatSlower z-0" />
      {showChest && (
        <Chest onFinish={() => setShowChest(false)} onReward={addCoins} />
      )}
      {/* Daily screen if already played */}
      {dailyPlayed ? (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
          <h1 className="text-4xl font-bold text-white mb-6">WSPRS</h1>
          {lastResult === "won" ? (
            <p className="text-white text-2xl opacity-80">
              ✨ You mastered today's whispers.
              <div className="mt-6 text-lg opacity-70">
                New whisper in {formatTime(secondsLeft)}
              </div>
            </p>
          ) : (
            <p className="text-white text-2xl opacity-80">
              🌫️ The whispers eluded you today.
              <div className="mt-6 text-lg opacity-70">
                New whisper in {formatTime(secondsLeft)}
              </div>
            </p>
          )}
        </div>
      ) : (
        <>
          {preparing && (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: preparingDone ? 0 : 1 }}
              transition={{ duration: 2 }}
              className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-gradient-to-br from-black via-gray-900/80 to-black backdrop-blur-sm"
            >
              <motion.h1
                initial={{ y: 0 }}
                animate={{
                  y: preparingDone ? -50 : 0,
                  opacity: preparingDone ? 0 : 1,
                }}
                transition={{ duration: 2 }}
                className="text-4xl sm:text-5xl font-bold text-white tracking-widest mb-4"
              >
                Prepare Your Mind
              </motion.h1>
              <motion.p
                initial={{ y: 0 }}
                animate={{
                  y: preparingDone ? -30 : 0,
                  opacity: preparingDone ? 0 : 1,
                }}
                transition={{ duration: 2 }}
                className="text-lg sm:text-xl text-white opacity-80"
              >
                The whispers are coming...
              </motion.p>
            </motion.div>
          )}

          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 tracking-widest">
            WSPRS
          </h1>

          <div className="relative bg-gray-950/50 p-6 rounded-2xl shadow-2xl">
            <TileGrid
              tiles={tiles}
              onTileClick={handleTileClick}
              lost={lost}
              blowaway={false}
              pulse={won}
              won={won}
            />
          </div>
          <AnimatePresence>
            {lost && (
              <>
                {/* Flying Ghost Image */}
                <motion.img
                  src="/angryGhost.png"
                  initial={{ x: "-20%", opacity: 0, scale: 1 }}
                  animate={{ x: "150%", opacity: 1, scale: 1.2 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className="absolute top-1/2 left-0 w-36 h-36 pointer-events-none z-50"
                  style={{
                    filter: "blur(1px)",
                    opacity: 0.1,
                    transform: "translateY(-50%)", // Center it vertically properly
                  }}
                />

                {/* Wind Gust Effect */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.4, 0] }}
                  transition={{ duration: 1.5, ease: "easeInOut", delay: 0.7 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-lg pointer-events-none"
                />
              </>
            )}
          </AnimatePresence>

          {won && <SpiritParticles />}
        </>
      )}
    </div>
  );
}

export default App;
