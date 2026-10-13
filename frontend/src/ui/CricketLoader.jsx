
import cricketBall from "../../assets/cricket_ball.svg";
import myAppLogo from "../../public/my_app_logo.png";

import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "motion/react";

import { useEffect, useState } from "react";

export const CricketLoader = ({ progress } = {}) => {
  const loadingMessages = [
    "Getting the pitch ready...",
    "Preparing your match center...",
    "Bringing the cricket community together...",
    "Setting up your experience...",
  ];

  const [index, setIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const isDeterminate = typeof progress === "number";
  const percentage = Math.min(100, Math.max(0, progress ?? 0));

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2400);

    return () => clearInterval(interval);
  }, [loadingMessages.length]);

  return (
    <div className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-[#080b0a] px-5 text-white">

      {/* Subtle cricket-pitch texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Center line: a restrained cricket-pitch detail */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/[0.035]"
      />

      <motion.main
        initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="relative z-10 flex w-full max-w-sm flex-col items-center"
      >

        {/* Brand */}
        <div className="mb-12 flex flex-col items-center gap-3">
          <motion.img
            src={myAppLogo}
            alt="Hills Cricket Arena"
            className="h-12 w-auto object-contain"
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />

          <div className="text-center">
            <h1 className="font-fredoka text-2xl font-semibold tracking-wide">
              Hills Cricket Arena
            </h1>

            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/40">
              Play. Score. Compete.
            </p>
          </div>
        </div>

        {/* Cricket ball and pitch illustration */}
        <div className="relative mb-11 flex h-48 w-64 items-center justify-center">

          {/* Fine circular outline */}
          <div
            aria-hidden="true"
            className="absolute h-40 w-40 rounded-full border border-white/[0.07]"
          />

          {/* Small red accent ring */}
          <motion.div
            aria-hidden="true"
            className="absolute h-40 w-40 rounded-full border border-dashed border-red-500/25"
            animate={
              shouldReduceMotion ? {} : { rotate: 360 }
            }
            transition={{
              duration: 32,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Minimal wicket behind the ball */}
          <div
            aria-hidden="true"
            className="absolute bottom-[38px] right-[42px] flex h-12 items-start gap-[5px] opacity-40"
          >
            {[0, 1, 2].map((stump) => (
              <div
                key={stump}
                className="h-11 w-[3px] rounded-full bg-white/60"
              />
            ))}
            <div className="absolute -top-[2px] left-[-3px] h-[3px] w-6 rounded-full bg-white/60" />
          </div>

          {/* Main cricket ball */}
          <motion.div
            className="relative z-10 h-[88px] w-[88px]"
            animate={
              shouldReduceMotion
                ? {}
                : {
                    y: [0, -7, 0],
                    rotate: [-5, 5, -5],
                  }
            }
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <img
              src={cricketBall}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-contain drop-shadow-[0_12px_14px_rgba(0,0,0,0.5)]"
            />
          </motion.div>

          {/* Ground shadow */}
          <motion.div
            aria-hidden="true"
            className="absolute bottom-[34px] h-2 w-20 rounded-full bg-black/70"
            animate={
              shouldReduceMotion
                ? {}
                : {
                    scaleX: [1, 0.8, 1],
                    opacity: [0.8, 0.4, 0.8],
                  }
            }
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Small pitch marker */}
          <div
            aria-hidden="true"
            className="absolute bottom-[17px] h-px w-44 bg-white/15"
          />
        </div>

        {/* Loading message */}
        <div className="mb-7 flex h-7 items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={loadingMessages[index]}
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 6 }
              }
              animate={{ opacity: 1, y: 0 }}
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: -6 }
              }
              transition={{ duration: 0.25 }}
              className="text-center text-sm font-medium text-white/65"
              role="status"
              aria-live="polite"
            >
              {loadingMessages[index]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Minimal solid-color progress indicator */}
        <div className="w-52">
          <div
            className="relative h-1 overflow-hidden rounded-full bg-white/10"
            role="progressbar"
            aria-label="Loading application"
            aria-valuemin={isDeterminate ? 0 : undefined}
            aria-valuemax={isDeterminate ? 100 : undefined}
            aria-valuenow={isDeterminate ? percentage : undefined}
          >
            {isDeterminate ? (
              <motion.div
                className="h-full rounded-full bg-red-500"
                animate={{ width: `${percentage}%` }}
                transition={{
                  duration: 0.35,
                  ease: "easeOut",
                }}
              />
            ) : (
              <motion.div
                className="absolute left-0 top-0 h-full w-1/3 rounded-full bg-red-500"
                animate={
                  shouldReduceMotion
                    ? { opacity: 0.75 }
                    : { x: ["-100%", "300%"] }
                }
                transition={{
                  duration: 1.5,
                  repeat: shouldReduceMotion ? 0 : Infinity,
                  ease: "easeInOut",
                }}
              />
            )}
          </div>

          {isDeterminate && (
            <p className="mt-2 text-center text-[10px] font-medium tabular-nums text-white/40">
              {Math.round(percentage)}%
            </p>
          )}
        </div>

        {/* Brand signature */}
        <p className="mt-10 text-[9px] font-medium uppercase tracking-[0.3em] text-white/25">
          Built for the love of cricket
        </p>
      </motion.main>
    </div>
  );
};
