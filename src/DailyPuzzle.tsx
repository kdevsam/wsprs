import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TileGrid from "./components/TileGrid";
import SpiritParticles from "./components/SpiritParticles";
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

const DailyPuzzle = () => {
  const [tiles, setTiles] = useState(initialTiles);
  const [whisperedTiles, setWhisperedTiles] = useState<number[]>([]);
  const [, setInitialBoardShown] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [lost, setLost] = useState(false);
  const [won, setWon] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [preparingDone, setPreparingDone] = useState(false);
  const [showChest, setShowChest] = useState(false);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [coins, setCoins] = useState(0);
  const [alreadyPlayedToday, setAlreadyPlayedToday] = useState(false);
  const [lastResult, setLastResult] = useState<"won" | "lost" | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const todaySeed = `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`;

  useEffect(() => {
    const storedCoins = parseInt(
      localStorage.getItem("wsprs-coins") || "0",
      10
    );
    setCoins(storedCoins);

    const lastPlayed = localStorage.getItem("wsprs-last-played");
    const lastGameResult = localStorage.getItem("wsprs-last-result");

    if (lastPlayed === todaySeed) {
      setAlreadyPlayedToday(true);
      if (lastGameResult === "won" || lastGameResult === "lost") {
        setLastResult(lastGameResult);
      }
    }
  }, []);

  useEffect(() => {
    if (!alreadyPlayedToday && !gameOver) return;

    const calc = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      return Math.floor((midnight.getTime() - now.getTime()) / 1000);
    };

    setSecondsLeft(calc());
    const interval = setInterval(() => setSecondsLeft(calc()), 1000);
    return () => clearInterval(interval);
  }, [alreadyPlayedToday, gameOver]);

  const formatTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const addCoins = (amount: number) => {
    setCoins((prev) => {
      const updated = prev + amount;
      localStorage.setItem("wsprs-coins", updated.toString());
      return updated;
    });
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
          setShowChest(true);
        }, 2000);
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
      localStorage.setItem("wsprs-last-played", todaySeed);
      localStorage.setItem("wsprs-last-result", "lost");
      setTimeout(() => {
        setShowEndScreen(true);
      }, 2300);
    }
  };

  const shuffleTiles = () => {
    const shuffled = [...tiles]
      .sort(() => Math.random() - 0.5)
      .map((tile, idx) => ({ ...tile, position: idx }));
    setTiles(shuffled);
  };

  const startWhisperPhase = async () => {
    setInitialBoardShown(true);
    await new Promise((r) => setTimeout(r, 1000));

    setPreparing(true);
    await new Promise((r) => setTimeout(r, 1000));
    setPreparingDone(true);
    await new Promise((r) => setTimeout(r, 2000));
    setPreparing(false);
    setPreparingDone(false);

    const newTiles = [...tiles];
    const numberOfPulses = 5;
    const seed = todaySeed.split("-").join("");
    let randomSeed = parseInt(seed, 10);

    const seededRandom = () => {
      const x = Math.sin(randomSeed++) * 10000;
      return x - Math.floor(x);
    };

    const randomIndexes = [...Array(newTiles.length).keys()]
      .sort(() => seededRandom() - 0.5)
      .slice(0, numberOfPulses);

    for (const idx of randomIndexes) {
      setTiles(
        newTiles.map((tile, i) => ({
          ...tile,
          pulsing: i === idx,
        }))
      );
      await new Promise((r) => setTimeout(r, 1000));
      setTiles(newTiles.map((tile) => ({ ...tile, pulsing: false })));
      await new Promise((r) => setTimeout(r, 300));
    }

    setTiles(
      newTiles.map((tile, idx) => ({
        ...tile,
        preview: randomIndexes.includes(idx),
      }))
    );
    await new Promise((r) => setTimeout(r, 1000));
    setTiles(newTiles.map((tile) => ({ ...tile, preview: false })));
    await new Promise((r) => setTimeout(r, 300));
    shuffleTiles();
    setWhisperedTiles(
      newTiles.filter((_, idx) => randomIndexes.includes(idx)).map((t) => t.id)
    );
    setGameStarted(true);
  };

  useEffect(() => {
    if (!alreadyPlayedToday) {
      startWhisperPhase();
    }
  }, [alreadyPlayedToday]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black p-6 relative">
      {/* Coin Counter */}
      <div className="fixed top-4 right-6 text-white text-xl font-bold flex items-center gap-2 z-[999] pointer-events-none">
        <img src="/coin.png" alt="coin" className="w-7 h-7 animate-spin-slow" />{" "}
        {coins}
      </div>

      {/* Main Logic */}
      {alreadyPlayedToday || showEndScreen ? (
        <motion.div className="flex flex-col items-center justify-center text-center p-8">
          <h1 className="text-4xl font-bold text-white mb-6">WSPRS</h1>
          {lastResult === "won" || won ? (
            <p className="text-white text-2xl opacity-80">
              ✨ You mastered today's whispers.
            </p>
          ) : (
            <p className="text-white text-2xl opacity-80">
              🌫️ The whispers eluded you today.
            </p>
          )}
          <div className="mt-6 text-white text-2xl opacity-70">
            New whisper in {formatTime(secondsLeft)}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => (window.location.href = "/")}
            className="mt-8 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg transition-all"
          >
            Return to Home
          </motion.button>
        </motion.div>
      ) : (
        <>
          {/* Preparing */}
          <AnimatePresence>
            {preparing && (
              <motion.div
                className={`absolute inset-0 flex flex-col items-center justify-center z-50 bg-black/30 ${
                  !preparingDone ? "backdrop-blur-xl" : ""
                }`}
              >
                <motion.h1
                  className="text-4xl sm:text-5xl font-bold text-white mb-4"
                  initial={{ y: 0 }}
                  animate={{
                    y: preparingDone ? -50 : 0,
                    opacity: preparingDone ? 0 : 1,
                  }}
                  transition={{ duration: 2 }}
                >
                  Prepare Your Mind
                </motion.h1>
                <motion.p
                  className="text-lg sm:text-xl text-white opacity-80"
                  initial={{ y: 0 }}
                  animate={{
                    y: preparingDone ? -30 : 0,
                    opacity: preparingDone ? 0 : 1,
                  }}
                  transition={{ duration: 2 }}
                >
                  The whispers are coming...
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* TileGrid */}
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6">
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

          {/* Effects */}
          {lost && (
            <motion.img
              src="/angryGhost.png"
              initial={{ x: "-20%", opacity: 0, scale: 1 }}
              animate={{
                x:
                  typeof window !== "undefined" && window.innerWidth < 640
                    ? "100%"
                    : "150%",
                opacity: 1,
                scale: 1.2,
              }}
              transition={{ duration: 1.2 }}
              className="absolute top-1/2 left-0 w-36 h-36 pointer-events-none"
              style={{ transform: "translateY(-50%)" }}
            />
          )}
          {won && <SpiritParticles />}

          {/* Chest */}
          {showChest && (
            <Chest
              onFinish={() => {
                setAlreadyPlayedToday(true);
                setShowChest(false);
                setShowEndScreen(true);
                setLastResult("won");
              }}
              onReward={addCoins}
            />
          )}
        </>
      )}
    </div>
  );
};

export default DailyPuzzle;
