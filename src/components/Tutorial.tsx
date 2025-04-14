import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    image: "/tutorial1.png", // Replace with your actual screenshot
    text: "When the game starts, ghosts will appear above some tiles!",
  },
  {
    image: "/tutorial2.png",
    text: "Memorize these tiles carefully... they will shuffle!",
  },
  {
    image: "/tutorial3.png",
    text: "After shuffling, click the tiles you remember. One wrong move ends the game!",
  },
];

const TutorialPopup = ({ onClose }: { onClose: () => void }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      onClose();
      localStorage.setItem("wsprs-tutorial-seen", "true");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative bg-gray-900/90 rounded-2xl shadow-2xl p-6 max-w-sm text-center flex flex-col items-center space-y-6"
      >
        <img
          src="/ghost-teacher.png" // <- Your ghost with stick
          alt="Ghost Teacher"
          className="w-24 h-24 mb-2 animate-bounce-slow"
        />

        <img
          src={slides[currentSlide].image}
          alt="Tutorial Step"
          className="rounded-lg shadow-lg w-full object-contain"
        />

        <p className="text-white text-lg opacity-90">
          {slides[currentSlide].text}
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={nextSlide}
          className="mt-4 px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-semibold transition-all"
        >
          {currentSlide === slides.length - 1 ? "Got It" : "Next"}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default TutorialPopup;
