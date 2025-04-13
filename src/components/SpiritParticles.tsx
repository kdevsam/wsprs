import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const SpiritParticles = () => {
  const [particles, setParticles] = useState<
    { id: number; left: number; top: number; delay: number }[]
  >([]);

  useEffect(() => {
    const initialParticles = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2,
    }));

    setParticles(initialParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-50">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full bg-white opacity-0"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
          }}
          initial={{
            opacity: 0,
            y: 0,
            scale: 0.8,
          }}
          animate={{
            opacity: [0, 0.7, 0],
            y: [-20, -400 - Math.random() * 200], // Upwards float
            scale: 1.2,
          }}
          transition={{
            duration: 5 + Math.random() * 2,
            delay: particle.delay,
            repeat: Infinity,
            repeatDelay: Math.random() * 2, // random delay between loops
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default SpiritParticles;
