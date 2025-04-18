// Updated DailyPuzzle.tsx with tile reset, stage indicator, lives display, and stage transition message
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

const initialTiles = () =>
  Array.from({ length: 16 }, (_, i) => ({
    id: i,
    icon: emojiList[i],
    pulsing: false,
    position: i,
    clicked: false,
    disabled: false,
    blowaway: false,
    vanished: false,
    wrong: false,
    preview: false,
  }));

const DailyPuzzle = () => {
  const [tiles, setTiles] = useState(initialTiles());
  const [whisperedTiles, setWhisperedTiles] = useState<number[]>([]);
  const [stage, setStage] = useState(1);
  const [lives, setLives] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [lost, setLost] = useState(false);
  const [won, setWon] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [preparingDone, setPreparingDone] = useState(false);
  const [showChest, setShowChest] = useState(false);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [showNextStageMsg, setShowNextStageMsg] = useState(false);
  const [showRetryMsg, setShowRetryMsg] = useState(false);
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
        if (stage === 3) {
          setGameOver(true);
          setWon(true);
          setTimeout(() => setShowChest(true), 2000);
          localStorage.setItem("wsprs-last-played", todaySeed);
          localStorage.setItem("wsprs-last-result", "won");
        } else {
          setShowNextStageMsg(true);
          setTimeout(() => {
            setShowNextStageMsg(false);
            setStage(stage + 1);
            setTiles(initialTiles());
            startWhisperPhase(stage + 1);
          }, 2000);
        }
      }
    } else {
      setTiles(
        tiles.map((tile) => (tile.id === id ? { ...tile, wrong: true } : tile))
      );
      setLives((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          setGameOver(true);
          setLost(true);
          setTimeout(() => {
            setTiles((prev) =>
              prev.map((tile) => ({ ...tile, blowaway: true }))
            );
          }, 1500);
          setTimeout(() => {
            setShowEndScreen(true);
            localStorage.setItem("wsprs-last-played", todaySeed);
            localStorage.setItem("wsprs-last-result", "lost");
          }, 2300);
        } else {
          setShowRetryMsg(true);
          setTimeout(() => {
            setShowRetryMsg(false);
            setTiles(initialTiles());
            startWhisperPhase(stage);
          }, 2000);
        }
        return next;
      });
    }
  };

  const shuffleTiles = () => {
    setTiles((prev) =>
      prev
        .sort(() => Math.random() - 0.5)
        .map((tile, idx) => ({ ...tile, position: idx }))
    );
  };

  const startWhisperPhase = async (stageOverride = stage) => {
    setGameStarted(false);
    setTiles(initialTiles());

    const numberOfPulses = stageOverride + 2;
    setPreparing(true);
    await new Promise((r) => setTimeout(r, 1000));
    setPreparingDone(true);
    await new Promise((r) => setTimeout(r, 2000));
    setPreparing(false);
    setPreparingDone(false);

    const seed = todaySeed.split("-").join("") + stageOverride;
    let randomSeed = parseInt(seed, 10);
    const seededRandom = () => {
      const x = Math.sin(randomSeed++) * 10000;
      return x - Math.floor(x);
    };

    const shuffledIndexes = [...Array(16).keys()].sort(
      () => seededRandom() - 0.5
    );
    const targetIndexes = shuffledIndexes.slice(0, numberOfPulses);

    for (const idx of targetIndexes) {
      setTiles((prev) =>
        prev.map((tile, i) => ({ ...tile, pulsing: i === idx }))
      );
      await new Promise((r) => setTimeout(r, 1000));
      setTiles((prev) => prev.map((tile) => ({ ...tile, pulsing: false })));
      await new Promise((r) => setTimeout(r, 300));
    }

    setTiles((prev) =>
      prev.map((tile, i) => ({
        ...tile,
        preview: targetIndexes.includes(i),
        clicked: false,
        disabled: false,
        wrong: false,
      }))
    );

    await new Promise((r) => setTimeout(r, 1000));
    setTiles((prev) => prev.map((tile) => ({ ...tile, preview: false })));
    await new Promise((r) => setTimeout(r, 300));
    shuffleTiles();
    setWhisperedTiles(targetIndexes);
    setGameStarted(true);
  };

  useEffect(() => {
    if (!alreadyPlayedToday) {
      startWhisperPhase();
    }
  }, [alreadyPlayedToday]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black p-6 relative">
      {/* Coin + Lives Counter */}
      <div className="fixed top-4 right-6 text-white text-xl font-bold flex flex-col items-end z-[999] pointer-events-none">
        <div className="flex items-center gap-2">
          <img
            src="/coin.png"
            alt="coin"
            className="w-7 h-7 animate-spin-slow"
          />{" "}
          {coins}
        </div>
      </div>

      {/* Next Stage Transition Message */}
      {/* Next Stage Transition Message */}
      <AnimatePresence>
        {showNextStageMsg && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black/30 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-4xl sm:text-5xl font-bold text-white mb-4"
              initial={{ y: 0 }}
              animate={{ y: -50, opacity: 0 }}
              transition={{ duration: 2 }}
            >
              ✅ Well done!
            </motion.h1>
            <motion.p
              className="text-lg sm:text-xl text-white opacity-80"
              initial={{ y: 0 }}
              animate={{ y: -30, opacity: 0 }}
              transition={{ duration: 2 }}
            >
              Moving to Stage {stage + 1}...
            </motion.p>
          </motion.div>
        )}
        {showRetryMsg && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black/30 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-4xl sm:text-5xl font-bold text-white mb-4"
              initial={{ y: 0 }}
              animate={{ y: -50, opacity: 0 }}
              transition={{ duration: 2 }}
            >
              😵 Oops!
            </motion.h1>
            <motion.p
              className="text-lg sm:text-xl text-white opacity-80"
              initial={{ y: 0 }}
              animate={{ y: -30, opacity: 0 }}
              transition={{ duration: 2 }}
            >
              Try again...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

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

          {/* Title */}
          <motion.h1
            initial={{ opacity: 1, scale: 0.9 }}
            animate={{ scale: [1, 1.02, 1] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="text-6xl sm:text-7xl font-bold text-indigo-200 tracking-widest mb-2 drop-shadow-lg z-10"
            style={{ fontFamily: "'Mystery Quest', cursive" }}
          >
            WSPRS
          </motion.h1>

          <div className="flex gap-1 mt-1 relative">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="relative w-15 h-15">
                <img
                  src={i < lives ? "/ghost-alive.png" : "/ghost-dead.png"}
                  alt={i < lives ? "Ghost" : "Ghost X"}
                  className="w-full h-full"
                />
                {i >= lives && (
                  <div className="absolute inset-5 flex items-center justify-center text-red-600 text-2xl font-bold">
                    ❌
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* Stage Indicator */}
          {!alreadyPlayedToday && !gameOver && (
            <motion.div
              className="mb-4 text-white text-xl font-bold bg-indigo-900/40 px-6 py-2 rounded-full"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Stage {stage} of 3
            </motion.div>
          )}

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
