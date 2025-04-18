import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface Block {
  id: number;
  width: number;
  left: number;
  top: number;
}

const StackGame = () => {
  const [stack, setStack] = useState<Block[]>([]);
  const [stackCount, setStackCount] = useState(0);

  const [current, setCurrent] = useState<Block | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [score, setScore] = useState(0);
  const [movingRight, setMovingRight] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const gameWidth = 300;
  const gameHeight = 480;
  const maxBlocks = 16;
  const blockHeight = gameHeight / maxBlocks;
  const speed = 4;

  useEffect(() => {
    startGame();
  }, []);

  const startGame = () => {
    const baseBlock: Block = {
      id: 0,
      width: 200,
      left: (gameWidth - 200) / 2,
      top: gameHeight - blockHeight,
    };
    setStack([baseBlock]);
    spawnNextBlock(baseBlock, 1);
    setScore(0);
    setWon(false);
    setGameOver(false);
  };

  const spawnNextBlock = (prev: Block, id: number) => {
    const newBlock: Block = {
      id,
      width: prev.width,
      left: 0,
      top: prev.top - blockHeight,
    };
    setCurrent(newBlock);
    setMovingRight(true);
  };

  const placeBlock = () => {
    if (!current || stack.length === 0) return;
    const last = stack[stack.length - 1];

    const overlapStart = Math.max(current.left, last.left);
    const overlapEnd = Math.min(
      current.left + current.width,
      last.left + last.width
    );
    const overlapWidth = overlapEnd - overlapStart;

    if (overlapWidth <= 0) {
      setGameOver(true);
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    const newBlock: Block = {
      id: current.id,
      width: overlapWidth,
      left: overlapStart,
      top: current.top,
    };

    const newStack = [...stack, newBlock];
    setStack(newStack);
    setScore((s) => s + 1);
    setStackCount((prev) => prev + 1);
    if (newStack.length === maxBlocks) {
      setWon(true);
      setCurrent(null);
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    spawnNextBlock(newBlock, current.id + 1);
  };

  useEffect(() => {
    if (!current || gameOver || won) return;

    intervalRef.current = setInterval(() => {
      setCurrent((prev) => {
        if (!prev) return null;
        const newLeft = movingRight ? prev.left + speed : prev.left - speed;
        const shouldReverse = newLeft <= 0 || newLeft + prev.width >= gameWidth;

        if (shouldReverse) {
          setMovingRight(!movingRight);
        }

        return {
          ...prev,
          left: Math.max(0, Math.min(newLeft, gameWidth - prev.width)),
        };
      });
    }, 16);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [current, movingRight, gameOver, won]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black p-6 text-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-purple-900/10 to-black/30 blur-3xl animate-floatSlow pointer-events-none" />
      <motion.img
        src="/ghost.png"
        alt="ghost"
        className="absolute top-1/4 left-1/2 w-32 h-32 opacity-10 animate-floatSlow pointer-events-none"
        style={{ transform: "translateX(-50%)" }}
      />
      <motion.img
        src="/ghost-climber.png"
        alt="Ghost"
        animate={{ y: -stackCount * blockHeight }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="absolute left-1/2 -translate-x-1/2 w-16 h-16 z-10"
      />

      <h1 className="text-5xl font-bold text-indigo-200 tracking-widest mb-6 z-10 font-dreamy">
        STACKS
      </h1>

      <div
        className="relative rounded-2xl backdrop-blur-md bg-gray-950/30 border border-white/10 shadow-xl overflow-hidden"
        style={{ width: `${gameWidth}px`, height: `${gameHeight}px` }}
        onClick={placeBlock}
      >
        {stack.map((block) => (
          <div
            key={block.id}
            className="absolute rounded-md border border-indigo-400 shadow-inner bg-indigo-400/30 backdrop-blur-lg"
            style={{
              width: `${block.width}px`,
              height: `${blockHeight}px`,
              left: `${block.left}px`,
              top: `${block.top}px`,
            }}
          />
        ))}
        {current && (
          <motion.div
            key={`moving-${current.id}`}
            className="absolute rounded-md border border-green-400 shadow-inner bg-green-400/30 backdrop-blur-lg"
            style={{
              width: `${current.width}px`,
              height: `${blockHeight}px`,
              left: `${current.left}px`,
              top: `${current.top}px`,
            }}
          />
        )}
      </div>

      <div className="mt-6 z-10 text-center">
        {won ? (
          <>
            <p className="text-indigo-400 text-xl mb-2">🎉 You won!</p>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all"
            >
              Play Again
            </button>
          </>
        ) : gameOver ? (
          <>
            <p className="text-red-400 text-xl mb-2">Game Over!</p>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all"
            >
              Retry
            </button>
          </>
        ) : (
          <p className="text-lg mt-4 text-white/80">Score: {score}</p>
        )}
      </div>
    </div>
  );
};

export default StackGame;
