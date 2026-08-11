import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import { BattingStats } from "../../components/BattingStats";
import { BowlingStats } from "../../components/BowlingStats";
import { Header } from "../../components/Header";
import Bat from "../../../assets/batsman.svg";
import Ball from "../../../assets/bowler.svg";
import { useParams } from "react-router-dom";
import { useProfileQuery } from "../../store/authApi";

const TABS = [
  { id: "batting", label: "Batting", icon: Bat },
  { id: "bowling", label: "Bowling", icon: Ball },
];

export const CareerStats = () => {
  const [activeTab, setActiveTab] = useState("batting");
  const { playerId } = useParams();
  const { data, isLoading } = useProfileQuery(playerId);

  return (
    <div className="flex flex-col items-center">
      <Header data={data?.playerProfile?.playerName} />

      <div className="mt-18 w-[97%] flex justify-center">
        <div className="inline-flex gap-1 rounded-xl bg-base-200 p-1 shadow-inner">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileTap={{ scale: 0.94 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "text-primary-content shadow-[0_2px_5px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.15)]"
                    : "text-base-content/60 hover:text-base-content"
                }`}
              >
                {/* Sliding indicator */}
                {isActive && (
                  <motion.span
                    layoutId="career-stats-tab-indicator"
                    className="absolute inset-0 -z-0 rounded-lg"
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 35,
                    }}
                  />
                )}

                <span className="relative z-10 flex items-center gap-2">
                  <img
                    src={tab.icon}
                    alt=""
                    className="h-5 w-auto transition-transform duration-200"
                  />

                  <span>{tab.label}</span>
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 w-[97%] md:w-[80%] lg:w-[80%] flex flex-col items-center gap-2 rounded-lg bg-base-200 p-2">
        {activeTab === "batting" ? (
          <BattingStats data={data} isLoading={isLoading} />
        ) : (
          <BowlingStats data={data} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
};
