import { motion, AnimatePresence } from "framer-motion";

const Tile = ({
  tile,
  onClick,
  lost,
  blowaway,
  pulse,
  won,
}: {
  tile: any;
  onClick: () => void;
  lost: boolean;
  blowaway: boolean;
  pulse: boolean;
  won: boolean;
}) => {
  const showMist = tile.pulsing || tile.preview; // pulsing OR preview

  return (
    <div className="relative">
      {/* Animated Swirling Mist Border */}
      <AnimatePresence>
        {showMist && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: tile.pulsing ? 0.8 : 0.4 }} // stronger if pulsing
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
          >
            <motion.div
              animate={{
                rotate: tile.pulsing ? [0, 360] : 0, // Only rotate if pulsing
              }}
              transition={{
                repeat: tile.pulsing ? Infinity : 0,
                duration: 10,
                ease: "linear",
              }}
              className="absolute w-[140%] h-[140%] rounded-full"
              style={{
                backgroundImage: "url('/mist-pattern.png')",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                filter: "blur(8px)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Whisper Ghost Head */}
      <AnimatePresence>
        {tile.pulsing && (
          <motion.img
            src="/whisper-ghost.png"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: -10, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute z-30 top-0 left-1/2 -translate-x-1/2 w-12 h-12 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Tile Core */}
      <motion.button
        onClick={onClick}
        whileTap={!lost ? { scale: 0.95 } : undefined}
        whileHover={
          !tile.disabled && !tile.clicked && !tile.wrong && !tile.blowaway
            ? { scale: 1.05 }
            : undefined
        }
        animate={{
          ...(blowaway
            ? {
                x: 800 + Math.random() * 400,
                y: (Math.random() - 0.5) * 400,
                rotate: Math.random() * 720 - 360,
                opacity: 0,
                transition: { duration: 2, ease: "easeOut" },
              }
            : won
            ? {
                opacity: 0,
                y: -100,
                transition: { duration: 2, ease: "easeOut" },
              }
            : pulse
            ? {
                scale: [1, 1.1, 1],
                transition: { repeat: Infinity, duration: 1.2 },
              }
            : {
                scale: 1,
              }),
        }}
        transition={{
          duration: blowaway ? 2 : won ? 2 : 0.8,
          ease: blowaway || won ? "easeOut" : "easeInOut",
        }}
        className={`relative z-10 w-28 h-28 sm:w-24 sm:h-24 rounded-2xl shadow-lg flex items-center justify-center text-white text-4xl font-bold ${
          tile.clicked
            ? "bg-gradient-to-br from-green-600 to-green-800 ring-4 ring-green-400"
            : tile.wrong
            ? "bg-gradient-to-br from-red-600 to-red-800 ring-4 ring-red-400"
            : "bg-gradient-to-br from-gray-800 to-gray-900"
        } ${
          tile.disabled || tile.clicked || tile.wrong || blowaway
            ? "pointer-events-none"
            : "hover:scale-110 hover:ring-4 hover:ring-indigo-300"
        } transition-all`}
      >
        {tile.icon}
      </motion.button>
    </div>
  );
};

export default Tile;
