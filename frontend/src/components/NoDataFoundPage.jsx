// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";

export const NoDataFoundPage = ({ image, title, description }) => {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        className="relative mt-10"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: [0, -12, 0],
        }}
        transition={{
          opacity: { duration: 0.6 },
          scale: {
            duration: 0.8,
            ease: "backOut",
          },
          y: {
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        {/* Image glow */}
        <div className="absolute inset-6 rounded-full" />

        <img
          src={image}
          alt="No tournament"
          className="relative h-64 w-64 object-contain drop-shadow-xl sm:h-72 sm:w-72 md:h-80 md:w-80"
        />
      </motion.div>

      {/* Text */}
      <motion.div
        className="relative mt-2 flex flex-col items-center px-4 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          delay: 0.5,
          ease: "easeOut",
        }}
      >
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
          {title}
        </h2>

        <p className="mt-2 max-w-sm text-sm text-base-content/60 sm:text-base">
          {description}
        </p>

        {/* Decorative dots */}
        <div className="mt-5 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
          <span className="h-1.5 w-6 rounded-full bg-primary/60" />
          <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
        </div>
      </motion.div>
    </div>
  );
};
