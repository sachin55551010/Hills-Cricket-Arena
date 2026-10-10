// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import errorImg from "../../assets/404.svg";

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh flex items-center justify-center px-6 py-12 bg-base-100 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-lg flex flex-col items-center text-center"
      >
        {/* Illustration */}
        <motion.img
          src={errorImg}
          alt="Page not found"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="w-full max-w-[320px] sm:max-w-[380px] h-auto object-contain"
        />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 space-y-3"
        >
          <span className="text-sm font-semibold tracking-[0.2em] uppercase text-primary">
            Error 404
          </span>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-base-content">
            Page not found
          </h1>

          <p className="text-base-content/60 text-sm sm:text-base leading-7 max-w-sm mx-auto">
            Oops! The page you're looking for doesn't exist or may have been
            moved. Let's get you back on track.
          </p>
        </motion.div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-8 w-full sm:w-auto">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(-1)}
            className="btn btn-primary w-full sm:w-auto min-w-36 rounded-xl px-6 shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            Go Back
          </motion.button>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/")}
            className="btn btn-ghost w-full sm:w-auto rounded-xl px-6"
          >
            Back to Home
          </motion.button>
        </div>

        {/* Footer */}
        <p className="mt-12 text-xs text-base-content/40">
          Lost your way? It happens.
        </p>
      </motion.div>
    </div>
  );
};
