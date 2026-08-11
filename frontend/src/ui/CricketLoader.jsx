import cricketBall from "../../assets/cricket_ball.svg";
import myAppLogo from "../../public/my_app_logo.png";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

export const CricketLoader = ({ progress } = {}) => {
  const loadingMessages = [
    "Getting things ready…",
    "Loading your experience…",
    "Preparing your dashboard…",
    "Just a moment…",
    "Setting things up…",
  ];

  const [index, setIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const isDeterminate = typeof progress === "number";

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2200);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const balls = [0, 1, 2];

  return (
    <div className="relative overflow-hidden bg-black flex items-center justify-center h-dvh w-screen px-6">
      {/* Ambient vignette — static, no motion, just depth */}
      <div className="pointer-events-none absolute inset-0" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative flex flex-col items-center gap-8"
      >
        {/* Brand mark */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-2"
        >
          <img src={myAppLogo} alt="" className="h-10 w-auto" />
          <span className="text-2xl font-fredoka font-semibold tracking-wide text-white">
            Hills Cricket Arena
          </span>
        </motion.div>

        {/* Balls with seam-ring behind and grounding shadows */}
        <div className="relative flex h-20 items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="h-28 w-28 rounded-full"
              animate={shouldReduceMotion ? {} : { rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            />
          </div>

          <div className="relative z-10 flex gap-4">
            {balls.map((i) => {
              const ballAnimate = shouldReduceMotion
                ? { opacity: [0.4, 1, 0.4] }
                : { y: [0, -20, 0], rotate: [0, 180, 360] };
              const shadowAnimate = shouldReduceMotion
                ? { opacity: 0.35 }
                : { scaleX: [1, 0.5, 1], opacity: [0.45, 0.15, 0.45] };
              const timing = {
                duration: 1,
                delay: i * 0.15,
                repeat: Infinity,
                repeatDelay: 0.5,
                ease: "easeInOut",
              };

              return (
                <div key={i} className="flex flex-col items-center gap-2">
                  <motion.div
                    className="h-7 w-7"
                    animate={ballAnimate}
                    transition={timing}
                  >
                    <img src={cricketBall} alt="" className="h-full w-full" />
                  </motion.div>
                  <motion.div
                    className="h-1.5 w-5 rounded-full bg-white/15 blur-[1px]"
                    animate={shadowAnimate}
                    transition={timing}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Loading message */}
        <AnimatePresence mode="wait">
          <motion.p
            key={loadingMessages[index]}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="text-xl font-fredoka font-medium text-white/80 text-center"
            role="status"
            aria-live="polite"
          >
            {loadingMessages[index]}
          </motion.p>
        </AnimatePresence>

        {/* Progress indicator — real progress if passed in, indeterminate otherwise */}
        <div className="relative h-1 w-48 overflow-hidden rounded-full bg-white/10">
          {isDeterminate ? (
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-red-600 to-red-400"
              animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          ) : (
            <motion.div
              className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-gradient-to-r from-red-600 to-red-400"
              animate={
                shouldReduceMotion
                  ? { opacity: [0.4, 1, 0.4] }
                  : { x: ["-100%", "260%"] }
              }
              transition={
                shouldReduceMotion
                  ? { duration: 1.6, repeat: Infinity }
                  : { duration: 1.4, repeat: Infinity, ease: "easeInOut" }
              }
            />
          )}
        </div>
      </motion.div>
    </div>
  );
};
