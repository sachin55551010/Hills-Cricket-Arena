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
  }, [loadingMessages.length]);

  const balls = [0, 1, 2];

  return (
    <div className="relative flex h-dvh w-screen items-center justify-center overflow-hidden bg-[#050505] px-6">
      {/* 
          BACKGROUND
       */}

      {/* Ambient red glow */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/10 blur-[120px]"
        animate={
          shouldReduceMotion
            ? {}
            : {
                scale: [1, 1.12, 1],
                opacity: [0.35, 0.55, 0.35],
              }
        }
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Small ambient glow */}
      <div className="pointer-events-none absolute left-[20%] top-[25%] h-40 w-40 rounded-full bg-red-500/5 blur-[80px]" />

      <div className="pointer-events-none absolute bottom-[15%] right-[15%] h-52 w-52 rounded-full bg-orange-500/5 blur-[100px]" />

      {/* Subtle vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.65)_100%)]" />

      {/* 
          MAIN CONTENT
      */}

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative z-10 flex w-full max-w-md flex-col items-center"
      >
        {/* 
            BRAND
        */}

        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.15,
            ease: "easeOut",
          }}
          className="mb-14 flex items-center gap-3"
        >
          <motion.div
            animate={
              shouldReduceMotion
                ? {}
                : {
                    rotate: [0, -4, 4, 0],
                  }
            }
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <img
              src={myAppLogo}
              alt="Hills Cricket Arena"
              className="h-11 w-auto drop-shadow-[0_0_15px_rgba(255,40,40,0.25)]"
            />
          </motion.div>

          <div>
            <h1 className="font-fredoka text-2xl font-semibold tracking-wide text-white">
              Hills Cricket Arena
            </h1>

            <p className="mt-0.5 text-center text-[10px] font-medium uppercase tracking-[0.3em] text-white/35">
              Play • Score • Compete
            </p>
          </div>
        </motion.div>

        {/* 
            CRICKET BALL ANIMATION
         */}

        <div className="relative mb-14 flex h-48 w-72 items-center justify-center">
          {/* Outer orbit ring */}
          <motion.div
            className="absolute h-44 w-44 rounded-full border border-red-500/10"
            animate={
              shouldReduceMotion
                ? {}
                : {
                    rotate: 360,
                  }
            }
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {/* Orbit dot */}
            <div className="absolute -right-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
          </motion.div>

          {/* Second orbit */}
          <motion.div
            className="absolute h-56 w-56 rounded-full border border-white/[0.03]"
            animate={
              shouldReduceMotion
                ? {}
                : {
                    rotate: -360,
                  }
            }
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Glow behind ball */}
          <motion.div
            className="absolute h-28 w-28 rounded-full bg-red-600/20 blur-3xl"
            animate={
              shouldReduceMotion
                ? {}
                : {
                    scale: [0.85, 1.15, 0.85],
                    opacity: [0.35, 0.65, 0.35],
                  }
            }
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Main cricket ball */}
          <motion.div
            className="relative z-20 h-24 w-24"
            animate={
              shouldReduceMotion
                ? {}
                : {
                    y: [0, -14, 0],
                    rotate: [0, 180, 360],
                  }
            }
            transition={{
              y: {
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              },
              rotate: {
                duration: 2.8,
                repeat: Infinity,
                ease: "linear",
              },
            }}
          >
            <img
              src={cricketBall}
              alt=""
              className="h-full w-full drop-shadow-[0_12px_20px_rgba(0,0,0,0.65)]"
            />

            {/* Ball shine */}
            <motion.div
              className="pointer-events-none absolute left-[18%] top-[15%] h-5 w-5 rounded-full bg-white/20 blur-md"
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      opacity: [0.2, 0.55, 0.2],
                    }
              }
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          {/* Ground shadow */}
          <motion.div
            className="absolute bottom-4 h-3 w-24 rounded-full bg-black/70 blur-md"
            animate={
              shouldReduceMotion
                ? {}
                : {
                    scaleX: [1, 0.65, 1],
                    opacity: [0.6, 0.25, 0.6],
                  }
            }
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* 
              SMALL ORBITING BALLS
           */}

          {balls.map((ball, i) => {
            const angles = [0, 120, 240];

            return (
              <motion.div
                key={ball}
                className="absolute h-6 w-6"
                style={{
                  transformOrigin: "0 0",
                }}
                animate={
                  shouldReduceMotion
                    ? {}
                    : {
                        rotate: [angles[i], angles[i] + 360],
                      }
                }
                transition={{
                  duration: 5 + i * 0.8,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 0.4,
                }}
              >
                <motion.img
                  src={cricketBall}
                  alt=""
                  className="h-full w-full"
                  style={{
                    transform: `translateX(${78 + i * 8}px)`,
                  }}
                  animate={
                    shouldReduceMotion
                      ? {}
                      : {
                          rotate: [0, -360],
                        }
                  }
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* 
            MESSAGE
        */}

        <div className="mb-7 flex h-8 items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={loadingMessages[index]}
              initial={{
                opacity: 0,
                y: 10,
                filter: "blur(4px)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                y: -10,
                filter: "blur(4px)",
              }}
              transition={{
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="font-fredoka text-lg font-medium text-white/75"
              role="status"
              aria-live="polite"
            >
              {loadingMessages[index]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* 
            PROGRESS BAR
        */}

        <div className="w-56">
          <div className="relative h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
            {isDeterminate ? (
              <motion.div
                className="relative h-full rounded-full bg-gradient-to-r from-red-700 via-red-500 to-orange-400"
                animate={{
                  width: `${Math.min(100, Math.max(0, progress))}%`,
                }}
                transition={{
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {/* Progress shine */}
                <motion.div
                  className="absolute right-0 top-0 h-full w-8 bg-white/30 blur-sm"
                  animate={
                    shouldReduceMotion
                      ? {}
                      : {
                          opacity: [0.2, 0.7, 0.2],
                        }
                  }
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                  }}
                />
              </motion.div>
            ) : (
              <motion.div
                className="absolute left-0 h-full w-1/3 rounded-full bg-gradient-to-r from-red-700 via-red-500 to-orange-400"
                animate={
                  shouldReduceMotion
                    ? {
                        opacity: 0.7,
                      }
                    : {
                        x: ["-120%", "320%"],
                      }
                }
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}
          </div>

          {/* Percentage */}
          {isDeterminate && (
            <motion.div
              key={progress}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-center text-[10px] font-medium tracking-widest text-white/30"
            >
              {Math.round(Math.min(100, Math.max(0, progress)))}%
            </motion.div>
          )}
        </div>

        {/* Bottom subtle text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-10 text-[9px] uppercase tracking-[0.35em] text-white/20"
        >
          Hills • Cricket • Community
        </motion.p>
      </motion.div>
    </div>
  );
};
