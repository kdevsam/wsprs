import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Ghosts = () => {
  const [ghosts, setGhosts] = useState<any[]>([]);

  useEffect(() => {
    const initialGhosts = Array.from({ length: 20 }).map(() => createGhost());
    setGhosts(initialGhosts);

    const interval = setInterval(() => {
      setGhosts((prev) => {
        if (prev.length < 20) {
          return [...prev, createGhost()];
        }
        return prev;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const createGhost = () => {
    const id = Math.random().toString(36).substring(2);
    const directionX = (Math.random() - 0.5) * 200;
    const directionY = (Math.random() - 0.5) * 200;
    return {
      id,
      top: Math.random() * 100,
      left: Math.random() * 100,
      scale: Math.random() * 0.5 + 0.1, // 0.3 - 1.2
      driftDuration: Math.random() * 40 + 30,
      floatAmplitude: Math.random() * 20 + 10,
      floatSpeed: Math.random() * 6 + 4,
      directionX,
      directionY,
      flip: Math.random() > 0.5,
    };
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      <AnimatePresence>
        {ghosts.map((ghost) => (
          <motion.div
            key={ghost.id}
            initial={{
              x: 0,
              y: 0,
              opacity: 0,
            }}
            animate={{
              x: `${ghost.directionX}vw`,
              y: `${ghost.directionY}vh`,
              opacity: [0.2, 0.4, 0],
            }}
            transition={{
              x: { duration: ghost.driftDuration, ease: "linear" },
              y: { duration: ghost.driftDuration, ease: "linear" },
              opacity: { duration: ghost.driftDuration, ease: "easeInOut" },
            }}
            style={{
              position: "absolute",
              top: `${ghost.top}%`,
              left: `${ghost.left}%`,
              width: "8rem",
              height: "8rem",
              pointerEvents: "none",
            }}
            onAnimationComplete={() => {
              setGhosts((prev) => prev.filter((g) => g.id !== ghost.id));
            }}
          >
            <motion.img
              src="/ghost.png"
              alt="ghost"
              initial={{ y: 0 }}
              animate={{
                y: [0, -ghost.floatAmplitude, 0, ghost.floatAmplitude, 0],
              }}
              transition={{
                duration: ghost.floatSpeed,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-full h-full object-contain"
              style={{
                transform: `
                  scale(${ghost.scale}) 
                  ${ghost.flip ? "scaleX(-1)" : "scaleX(1)"}
                `,
                filter: "blur(2px)",
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Ghosts;
