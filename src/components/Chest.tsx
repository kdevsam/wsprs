import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Chest = ({
  onFinish,
  onReward,
}: {
  onFinish: () => void;
  onReward: (amount: number) => void;
}) => {
  const [opened, setOpened] = useState(false);
  const [coinsFlying, setCoinsFlying] = useState(false);
  const [earnedCoins, setEarnedCoins] = useState(0);
  const [startCollecting, setStartCollecting] = useState(false);

  const totalCoins = Math.floor(Math.random() * 30 + 20); // 20–50 coins

  const handleOpenChest = () => {
    setOpened(true); // Switch to opened chest

    // After small delay, explode coins
    setTimeout(() => {
      setCoinsFlying(true);
    }, 300);

    // After explode, start collecting
    setTimeout(() => {
      setStartCollecting(true);

      let currentCoins = 0;
      const interval = setInterval(() => {
        currentCoins += 1;
        setEarnedCoins(currentCoins);
        if (currentCoins >= totalCoins) {
          clearInterval(interval);
          onReward(totalCoins);
          setTimeout(() => {
            onFinish();
          }, 1000);
        }
      }, 40);
    }, 600);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[999] bg-black/70 backdrop-blur-sm">
      {/* Chest */}
      <motion.img
        src={opened ? "/chest-open.png" : "/chest.png"}
        className="w-48 h-48 cursor-pointer"
        whileHover={!opened ? { scale: 1.1 } : undefined}
        onClick={!opened ? handleOpenChest : undefined}
        initial={{ scale: 0 }}
        animate={{ scale: opened ? 1.1 : 1 }}
        transition={{ type: "spring", stiffness: 120 }}
      />

      {/* Coins */}
      <AnimatePresence>
        {coinsFlying &&
          Array.from({ length: totalCoins }).map((_, i) => {
            const angle = Math.random() * 2 * Math.PI;
            const radius = Math.random() * 100 + 50;
            const explodeX = Math.cos(angle) * radius;
            const explodeY = Math.sin(angle) * radius;

            return (
              <motion.img
                key={i}
                src="/coin.png"
                className="absolute w-8 h-8 pointer-events-none"
                initial={{
                  x: 0,
                  y: 0,
                  scale: 0.5,
                  opacity: 0,
                }}
                animate={{
                  x: startCollecting
                    ? "calc(50vw - 2rem)" // zip to coins UI
                    : explodeX, // first explode
                  y: startCollecting ? "-45vh" : explodeY,
                  scale: startCollecting ? 0.3 : 1,
                  opacity: startCollecting ? 0 : 1,
                }}
                transition={{
                  x: {
                    duration: startCollecting ? 1.2 : 0.5,
                    ease: startCollecting ? "easeInOut" : "easeOut",
                  },
                  y: {
                    duration: startCollecting ? 1.2 : 0.5,
                    ease: startCollecting ? "easeInOut" : "easeOut",
                  },
                  opacity: {
                    duration: startCollecting ? 1 : 0.5,
                  },
                  delay: i * 0.02,
                }}
              />
            );
          })}
      </AnimatePresence>

      {/* Coin Counter */}
      {startCollecting && (
        <motion.div
          className="absolute top-8 right-12 text-white text-3xl font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          +{earnedCoins}
        </motion.div>
      )}
    </div>
  );
};

export default Chest;
