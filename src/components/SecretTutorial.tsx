import { useState } from "react";
import { motion } from "framer-motion";

const secretSlides = [
  {
    image: "/tutorial-secret1.png",
    text: "Welcome to the Secret Mode. Few have made it here...",
  },
  {
    image: "/tutorial-secret2.png",
    text: "Unravel hidden patterns and survive unknown challenges!",
  },
  {
    image: "/tutorial-secret3.png",
    text: "Trust your instincts. Only the worthy will prevail.",
  },
];

const SecretTutorial = ({ onClose }: { onClose: () => void }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < secretSlides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      onClose();
      localStorage.setItem("wsprs-secret-tutorial-seen", "true");
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
          src="/ghost-teacher.png"
          alt="Ghost Teacher"
          className="w-24 h-24 mb-2 animate-bounce-slow"
        />

        <img
          src={secretSlides[currentSlide].image}
          alt="Tutorial Step"
          className="rounded-lg shadow-lg w-full object-contain"
        />

        <p className="text-white text-lg opacity-90">
          {secretSlides[currentSlide].text}
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={nextSlide}
          className="mt-4 px-8 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all"
        >
          {currentSlide === secretSlides.length - 1 ? "Got It" : "Next"}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default SecretTutorial;
