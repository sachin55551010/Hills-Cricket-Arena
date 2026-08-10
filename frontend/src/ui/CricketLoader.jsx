import cricketBall from "../../assets/cricket_ball.svg";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
// import { useEffect, useState } from "react";

export const CricketLoader = () => {
  const loadingMessages = [
    "Getting things ready…",
    "Loading your experience…",
    "Preparing your dashboard…",
    "Just a moment…",
    "Setting things up…",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overflow-hidden bg-black flex items-center justify-center h-dvh w-screen">
      <div className="flex flex-col items-center gap-8">
        <AnimatePresence mode="wait">
          <motion.p
            key={loadingMessages[index]}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{
              duration: 0.35,
              ease: "easeInOut",
            }}
            className="text-3xl font-fredoka font-medium"
          >
            {loadingMessages[index]}
          </motion.p>
        </AnimatePresence>
        <div className="flex gap-2">
          <motion.div
            className="h-7 w-7"
            animate={{ y: [0, -20, 0] }}
            transition={{
              duration: 1,
              delay: 0.3,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          >
            <img src={cricketBall} alt="" />
          </motion.div>
          <motion.div
            className="h-7 w-7"
            animate={{ y: [0, -20, 0] }}
            transition={{
              duration: 1,
              delay: 0.6,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          >
            <img src={cricketBall} alt="" />
          </motion.div>
          <motion.div
            className="h-7 w-7"
            animate={{ y: [0, -20, 0] }}
            transition={{
              duration: 1,
              delay: 0.9,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          >
            <img src={cricketBall} alt="" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
