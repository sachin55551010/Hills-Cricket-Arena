import { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "motion/react";

const tips = [
  "Preparing the pitch...",
  "Polishing the ball...",
  "Setting the field...",
  "Tossing the coin...",
];

const G = {
  bg: "#0a0f1c",
  pitch: "#c8a96e",
  ball: "#d32f2f",
  seam: "#ffd54f",
  bat: "#d4a256",
  handle: "#8d6e63",
  text: "#e8d5b0",
  dot: "#f59e0b",
};

// ── Animation variants ──────────────────────────────────

const batVariants = {
  animate: {
    rotate: [-5, 38, 34, -5],
    transition: {
      duration: 1.8,
      ease: "easeInOut",
      repeat: Infinity,
      times: [0, 0.3, 0.55, 1],
    },
  },
};

const ballVariants = {
  animate: {
    x: [0, 20, 60, 90, 0, 0, 0],
    y: [0, -55, -20, 10, 0, 0, 0],
    opacity: [1, 1, 1, 0, 0, 1, 1],
    transition: {
      duration: 1.8,
      ease: "easeInOut",
      repeat: Infinity,
      times: [0, 0.25, 0.5, 0.7, 0.71, 0.8, 1],
    },
  },
};

const shadowVariants = {
  animate: {
    scaleX: [1, 0.6, 1.2, 1],
    opacity: [0.4, 0.2, 0.5, 0.4],
    transition: {
      duration: 1.8,
      ease: "easeInOut",
      repeat: Infinity,
      times: [0, 0.3, 0.55, 1],
    },
  },
};

export const CricketLoader = () => {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setTipIndex((p) => (p + 1) % tips.length),
      1800,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: G.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Georgia, serif",
        gap: 28,
        userSelect: "none",
      }}
    >
      {/* ── Scene ── */}
      <div style={{ position: "relative", width: 200, height: 200 }}>
        {/* Pitch strip */}
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            width: 120,
            height: 8,
            background: G.pitch,
            borderRadius: 4,
            opacity: 0.45,
          }}
        />

        {/* Stumps */}
        <div
          style={{
            position: "absolute",
            bottom: 28,
            right: 38,
            display: "flex",
            gap: 5,
            alignItems: "flex-end",
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 4,
                height: 36,
                background: G.text,
                borderRadius: 2,
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -4,
                  left: -2,
                  width: 8,
                  height: 3,
                  background: G.text,
                  borderRadius: 2,
                }}
              />
            </div>
          ))}
        </div>

        {/* Bat */}
        <motion.div
          variants={batVariants}
          animate="animate"
          style={{
            position: "absolute",
            bottom: 28,
            left: 30,
            transformOrigin: "bottom center",
          }}
        >
          <div
            style={{
              width: 6,
              height: 38,
              background: G.handle,
              borderRadius: 3,
              margin: "0 auto",
            }}
          />
          <div
            style={{
              width: 28,
              height: 52,
              background: G.bat,
              borderRadius: "4px 4px 8px 8px",
              boxShadow: "inset -3px 0 6px rgba(0,0,0,0.25)",
            }}
          />
        </motion.div>

        {/* Ball */}
        <motion.div
          variants={ballVariants}
          animate="animate"
          style={{ position: "absolute", top: 30, left: 60 }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              background: `radial-gradient(circle at 35% 35%, #ef5350, ${G.ball})`,
              borderRadius: "50%",
              boxShadow: "0 2px 8px rgba(211,47,47,0.55)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "42%",
                left: 0,
                right: 0,
                height: 2,
                background: G.seam,
                borderRadius: 2,
                opacity: 0.7,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: "42%",
                top: 0,
                bottom: 0,
                width: 2,
                background: G.seam,
                borderRadius: 2,
                opacity: 0.7,
              }}
            />
          </div>
        </motion.div>

        {/* Ground shadow */}
        <motion.div
          variants={shadowVariants}
          animate="animate"
          style={{
            position: "absolute",
            bottom: 14,
            left: "50%",
            translateX: "-50%",
            width: 60,
            height: 8,
            background: "rgba(0,0,0,0.4)",
            borderRadius: "50%",
            filter: "blur(4px)",
          }}
        />
      </div>

      {/* Rotating tip with AnimatePresence */}
      <AnimatePresence mode="wait">
        <motion.p
          key={tipIndex}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 0.8, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{
            color: G.text,
            fontSize: 14,
            letterSpacing: "0.09em",
            margin: 0,
          }}
        >
          {tips[tipIndex]}
        </motion.p>
      </AnimatePresence>

      {/* Bouncing dots */}
      <div style={{ display: "flex", gap: 8 }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ scale: [0.6, 1.2, 0.6], opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 1.2,
              ease: "easeInOut",
              repeat: Infinity,
              delay: i * 0.18,
            }}
            style={{
              width: 7,
              height: 7,
              background: G.dot,
              borderRadius: "50%",
            }}
          />
        ))}
      </div>
    </div>
  );
};
