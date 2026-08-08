import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
export const NewsList = ({ articles }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article, index) => (
        <motion.div
          key={index}
          whileHover={{ y: -6 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="group rounded-2xl overflow-hidden bg-base-100 shadow-md hover:shadow-2xl border border-base-300/40 flex flex-col"
        >
          {/* Image (Top ~40%) */}
          <div className="relative h-44 overflow-hidden">
            {/* subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />

            <img
              src={article.urlToImage}
              alt={article.title}
              className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
            />
          </div>

          {/* Content (Bottom area) */}
          <div className="flex flex-col justify-between flex-1 p-5">
            <div>
              <h2 className="text-lg font-semibold leading-tight mb-3 line-clamp-2 group-hover:text-primary transition">
                {article.title}
              </h2>

              <p className="text-sm opacity-70 line-clamp-3">
                {article.description}
              </p>
            </div>

            {/* CTA */}
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all"
            >
              Read more
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>
        </motion.div>
      ))}

      {/* See All Card */}
      <Link
        to="https://www.bbc.com/sport/cricket"
        className="flex items-center justify-center rounded-2xl border border-dashed border-base-300 hover:border-primary transition min-h-[320px]"
      >
        <button className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition duration-300">
          See All Articles →
        </button>
      </Link>
    </div>
  );
};
