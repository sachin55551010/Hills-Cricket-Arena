import { Calendar, Play, X } from "lucide-react";
import { Link } from "react-router-dom";

export const ChooseMatchActionModal = ({ setIsMatchActionModal }) => {
  return (
    <div className="fixed z-[999] inset-0 backdrop-blur-sm flex items-center justify-center p-4 bg-black/10">
      <div className=" rounded-2xl shadow-2xl max-w-md w-full border border-slate-700/50 overflow-hidden">
        {/* Content */}
        <div className="relative p-8">
          {/* Icon circle */}
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-blue-500/50">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-center mb-3 text-base-content/60">
            Choose Match Action
          </h2>

          {/* Description */}
          <p className="text-slate-400 text-center mb-8 leading-relaxed">
            Would you like to schedule this match for later or start playing
            right away?
          </p>

          {/* Action buttons */}
          <div className="space-y-4">
            {/* Schedule Match Button */}
            <Link to="schedule">
              <button className="btn w-full btn-warning h-14 rounded-lg">
                <div className="relative flex items-center justify-center gap-3">
                  <Calendar className="w-5 h-5" />
                  <span>Schedule Match</span>
                </div>
              </button>
            </Link>

            {/* Start Match Button */}
            <Link to="start">
              <button className="mt-6 btn btn-success w-full h-14 rounded-lg">
                <div className="relative flex items-center justify-center gap-3">
                  <Play className="w-5 h-5" />
                  <span>Start Match Now</span>
                </div>
              </button>
            </Link>
          </div>
          <button
            onClick={() => setIsMatchActionModal(false)}
            className="absolute bg-black/20 p-1 rounded-lg top-[5%] right-[5%] cursor-pointer hover:bg-black/10"
          >
            <X strokeWidth={4} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-2xl text-white mb-4">Modal Preview</h1>
        <p className="text-slate-400">The modal is displayed below</p>
      </div>
      <ChooseMatchActionModal />
    </div>
  );
}
